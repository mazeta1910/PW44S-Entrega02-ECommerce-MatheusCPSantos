package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import br.edu.utfpr.pb.pw44s.server.model.enums.OrderStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class OrderMapper {

    @Autowired
    protected AddressMapper addressMapper;

    @Mapping(target = "items", ignore = true)
    public abstract Order toEntity(OrderDTO dto);

    @Mapping(target = "items", ignore = true)
    public abstract OrderDTO toDto(Order entity);

    public OrderResponseDTO toResponseDto(Order entity) {
        if (entity == null) {
            return null;
        }

        List<OrderItemResponseDTO> items = entity.getItems() == null
                ? List.of()
                : entity.getItems().stream().map(this::toItemResponse).collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(entity.getId())
                .items(items)
                .deliveryAddress(addressMapper.toDto(entity.getDeliveryAddress()))
                .total(entity.getTotal() != null ? entity.getTotal().doubleValue() : null)
                .freightPrice(entity.getFreightPrice() != null ? entity.getFreightPrice().doubleValue() : null)
                .couponDiscount(entity.getCouponDiscount() != null ? entity.getCouponDiscount().doubleValue() : null)
                .carrierName(entity.getCarrierName())
                .estimatedDeliveryDays(entity.getEstimatedDeliveryDays())
                .paymentMethod(entity.getPaymentMethod())
                .paymentDiscount(entity.getPaymentDiscount() != null ? entity.getPaymentDiscount().doubleValue() : null)
                .status(entity.getStatus() != null ? entity.getStatus() : OrderStatus.CONFIRMED)
                .supportRequestMessage(entity.getSupportRequestMessage())
                .orderDate(entity.getOrderDate() != null ? entity.getOrderDate().toLocalDate() : null)
                .build();
    }

    public OrderItemResponseDTO toItemResponse(OrderItem item) {
        var variant = item.getVariant();
        var product = variant != null ? variant.getProduct() : null;
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponseDTO.builder()
                .id(item.getId())
                .variantId(variant != null ? variant.getId() : null)
                .productId(product != null ? product.getId() : null)
                .productName(product != null ? product.getName() : null)
                .productImage(product != null ? product.getImage() : null)
                .variantLabel(variant != null ? variant.getLabel() : null)
                .deliveryType(variant != null ? variant.getDeliveryType() : null)
                .platform(variant != null ? variant.getPlatform() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }
}
