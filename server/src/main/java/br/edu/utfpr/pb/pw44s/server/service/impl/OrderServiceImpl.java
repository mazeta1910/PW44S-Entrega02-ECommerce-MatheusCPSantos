package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CouponValidationDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderSupportRequestDTO;
import br.edu.utfpr.pb.pw44s.server.dto.FreightResponseDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.model.Address;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.model.enums.PaymentMethod;
import br.edu.utfpr.pb.pw44s.server.repository.AddressRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductVariantRepository;
import br.edu.utfpr.pb.pw44s.server.service.FreightService;
import br.edu.utfpr.pb.pw44s.server.service.ICouponService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {

    private static final BigDecimal PIX_DISCOUNT_RATE = new BigDecimal("0.05");

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final OrderMapper orderMapper;
    private final FreightService freightService;
    private final ICouponService couponService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductVariantRepository productVariantRepository,
            AddressRepository addressRepository,
            AddressMapper addressMapper,
            OrderMapper orderMapper,
            FreightService freightService,
            ICouponService couponService) {
        this.orderRepository = orderRepository;
        this.productVariantRepository = productVariantRepository;
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
        this.orderMapper = orderMapper;
        this.freightService = freightService;
        this.couponService = couponService;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return orderRepository;
    }

    @Override
    public List<Order> findByUserEmail(String email) {
        return orderRepository.findByUser_EmailOrderByOrderDateDescIdDesc(email);
    }

    @Override
    public Order findByIdAndUserEmail(Long id, String email) {
        return orderRepository.findByIdAndUser_Email(id, email).orElse(null);
    }

    @Override
    @Transactional
    public OrderResponseDTO toResponseDto(Order order) {
        if (order == null) {
            return null;
        }
        backfillDeliveryEstimate(order);
        return orderMapper.toResponseDto(order);
    }

    @Override
    @Transactional
    public Order submitSupportRequest(Long orderId, String email, OrderSupportRequestDTO dto) {
        Order order = findByIdAndUserEmail(orderId, email);
        if (order == null) {
            throw new IllegalArgumentException("Pedido não encontrado.");
        }

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Este pedido não permite novas solicitações.");
        }

        OrderStatus newStatus = switch (dto.getType()) {
            case CANCEL -> OrderStatus.CANCELLED;
            case REFUND -> OrderStatus.REFUND_REQUESTED;
            case EXCHANGE -> OrderStatus.EXCHANGE_REQUESTED;
        };

        order.setStatus(newStatus);
        order.setSupportRequestMessage(
                dto.getMessage() != null && !dto.getMessage().isBlank()
                        ? dto.getMessage().trim()
                        : null);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> findAll() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return orderRepository.findByUser_EmailOrderByOrderDateDescIdDesc(email);
    }

    @Override
    @Transactional
    public Order save(Order order) {
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            return saveWithItems(order);
        }
        return super.save(order);
    }

    @Override
    @Transactional
    public Order saveFromDto(OrderDTO dto, User user) {
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(resolveDeliveryAddress(dto, user));
        order.setItems(new ArrayList<>());

        if (dto.getFreightPrice() != null && dto.getFreightPrice() > 0) {
            order.setFreightPrice(BigDecimal.valueOf(dto.getFreightPrice()));
        }

        if (dto.getCarrierName() != null && !dto.getCarrierName().isBlank()) {
            order.setCarrierName(dto.getCarrierName().trim());
        }

        if (dto.getEstimatedDeliveryDays() != null && dto.getEstimatedDeliveryDays() > 0) {
            order.setEstimatedDeliveryDays(dto.getEstimatedDeliveryDays());
        }

        if (dto.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }
        order.setPaymentMethod(dto.getPaymentMethod());

        if (dto.getItems() != null) {
            for (OrderItemDTO itemDto : dto.getItems()) {
                ProductVariant variant = productVariantRepository
                        .findById(itemDto.getVariantId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Variação não encontrada. ID: " + itemDto.getVariantId()));

                if (!Boolean.TRUE.equals(variant.getActive())) {
                    throw new IllegalArgumentException(
                            "Variação indisponível: " + variant.getLabel());
                }

                int quantity = itemDto.getQuantity() != null ? itemDto.getQuantity() : 1;

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .variant(variant)
                        .quantity(quantity)
                        .unitPrice(variant.getPrice())
                        .build();
                order.getItems().add(item);
            }
        }

        applyCouponFromDto(order, dto, user);

        return saveWithItems(order);
    }

    private void applyCouponFromDto(Order order, OrderDTO dto, User user) {
        String couponCode = dto.getCouponCode();
        if (couponCode == null || couponCode.isBlank()) {
            if (dto.getCouponDiscount() != null && dto.getCouponDiscount() > 0) {
                throw new IllegalArgumentException(
                        "Informe o código do cupom para aplicar o desconto.");
            }
            return;
        }

        BigDecimal itemsSubtotal = order.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CouponValidationDTO validation = couponService.validateCoupon(
                couponCode.trim(),
                itemsSubtotal.doubleValue(),
                user.getEmail());

        if (!validation.isValid()) {
            throw new IllegalArgumentException(
                    validation.getMessage() != null
                            ? validation.getMessage()
                            : "Cupom inválido.");
        }

        order.setCouponCode(validation.getCode());
        order.setCouponDiscount(BigDecimal.valueOf(validation.getDiscountAmount()));
    }

    private Order saveWithItems(Order order) {
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItem item : order.getItems()) {
            item.setOrder(order);

            if (item.getVariant() != null && item.getVariant().getId() != null) {
                ProductVariant variant = productVariantRepository
                        .findById(item.getVariant().getId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Variação não encontrada. ID: " + item.getVariant().getId()));

                item.setVariant(variant);
                item.setUnitPrice(variant.getPrice());
            }

            BigDecimal lineTotal = item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(lineTotal);
        }

        if (order.getFreightPrice() != null) {
            total = total.add(order.getFreightPrice());
        }

        if (order.getCouponDiscount() != null) {
            total = total.subtract(order.getCouponDiscount());
            if (total.compareTo(BigDecimal.ZERO) < 0) {
                total = BigDecimal.ZERO;
            }
        }

        if (order.getPaymentMethod() == PaymentMethod.PIX) {
            BigDecimal paymentDiscount = total
                    .multiply(PIX_DISCOUNT_RATE)
                    .setScale(2, RoundingMode.HALF_UP);
            order.setPaymentDiscount(paymentDiscount);
            total = total.subtract(paymentDiscount);
        } else {
            order.setPaymentDiscount(BigDecimal.ZERO);
        }

        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        order.setTotal(total);
        return orderRepository.save(order);
    }

    private Address resolveDeliveryAddress(OrderDTO dto, User user) {
        if (dto.getDeliveryAddress() == null || dto.getDeliveryAddress().getId() == null) {
            throw new IllegalArgumentException("Endereço de entrega é obrigatório.");
        }

        Address address = addressRepository.findById(dto.getDeliveryAddress().getId())
                .orElseThrow(() -> new IllegalArgumentException("Endereço de entrega não encontrado."));

        if (address.getUser() == null || !address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Endereço não pertence ao usuário logado.");
        }

        if (!Boolean.TRUE.equals(address.getIsActive())) {
            throw new IllegalArgumentException("Endereço de entrega indisponível.");
        }

        return address;
    }

    private void backfillDeliveryEstimate(Order order) {
        if (order.getEstimatedDeliveryDays() != null && order.getEstimatedDeliveryDays() > 0) {
            return;
        }

        if (!hasPhysicalItems(order)) {
            return;
        }

        Address address = order.getDeliveryAddress();
        if (address == null || address.getZipCode() == null || address.getZipCode().isBlank()) {
            return;
        }

        List<FreightResponseDTO> options = freightService.calculateFreight(address.getZipCode());
        if (options.isEmpty()) {
            return;
        }

        FreightResponseDTO selected = options.stream()
                .filter(option -> order.getCarrierName() != null
                        && order.getCarrierName().equalsIgnoreCase(option.getCarrierName()))
                .findFirst()
                .orElse(options.get(0));

        order.setCarrierName(selected.getCarrierName());
        order.setEstimatedDeliveryDays(selected.getEstimatedDays());
        orderRepository.save(order);
    }

    private boolean hasPhysicalItems(Order order) {
        if (order.getItems() == null) {
            return false;
        }

        return order.getItems().stream()
                .anyMatch(item -> item.getVariant() != null
                        && item.getVariant().getDeliveryType() == DeliveryType.PHYSICAL);
    }
}
