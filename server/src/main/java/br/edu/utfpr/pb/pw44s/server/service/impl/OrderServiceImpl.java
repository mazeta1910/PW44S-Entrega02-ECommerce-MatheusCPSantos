package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.AddressMapper;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductVariantRepository;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl extends CrudServiceImpl<Order, Long> implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AddressMapper addressMapper;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            ProductVariantRepository productVariantRepository,
            AddressMapper addressMapper) {
        this.orderRepository = orderRepository;
        this.productVariantRepository = productVariantRepository;
        this.addressMapper = addressMapper;
    }

    @Override
    protected JpaRepository<Order, Long> getRepository() {
        return orderRepository;
    }

    @Override
    public List<Order> findByUserEmail(String email) {
        return orderRepository.findByUser_Email(email);
    }

    @Override
    public List<Order> findAll() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return orderRepository.findByUser_Email(email);
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
        order.setDeliveryAddress(addressMapper.toEntity(dto.getDeliveryAddress()));
        order.setItems(new ArrayList<>());

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

        return saveWithItems(order);
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

        order.setTotal(total);
        return orderRepository.save(order);
    }
}
