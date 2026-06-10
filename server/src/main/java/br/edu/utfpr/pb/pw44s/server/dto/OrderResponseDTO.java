package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDTO {

    private Long id;

    private UserResponseDTO user;

    private List<OrderItemResponseDTO> items;

    private AddressDTO deliveryAddress;

    private Double total;

    private Double freightPrice;

    private Double couponDiscount;

    private String carrierName;

    private Integer estimatedDeliveryDays;

    private OrderStatus status;

    private String supportRequestMessage;

    private LocalDate orderDate;
}
