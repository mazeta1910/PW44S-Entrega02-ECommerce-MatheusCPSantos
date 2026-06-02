package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderItemResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    @Mapping(target = "items", ignore = true)
    Order toEntity(OrderDTO dto);

    @Mapping(target = "items", ignore = true)
    OrderDTO toDto(Order entity);

    default OrderResponseDTO toResponseDto(Order entity) {
        if (entity == null) {
            return null;
        }

        List<OrderItemResponseDTO> items = entity.getItems() == null
                ? List.of()
                : entity.getItems().stream().map(this::toItemResponse).collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(entity.getId())
                .items(items)
                .deliveryAddress(null)
                .total(entity.getTotal() != null ? entity.getTotal().doubleValue() : null)
                .orderDate(entity.getOrderDate() != null ? entity.getOrderDate().toLocalDate() : null)
                .build();
    }

    default OrderItemResponseDTO toItemResponse(OrderItem item) {
        var variant = item.getVariant();
        var product = variant != null ? variant.getProduct() : null;
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

        return OrderItemResponseDTO.builder()
                .id(item.getId())
                .variantId(variant != null ? variant.getId() : null)
                .productName(product != null ? product.getName() : null)
                .variantLabel(variant != null ? variant.getLabel() : null)
                .deliveryType(variant != null ? variant.getDeliveryType() : null)
                .platform(variant != null ? variant.getPlatform() : null)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(subtotal)
                .build();
    }
}
