package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class OrderDTO {

    private Long id;

    private UserDTO user;

    @NotEmpty(message = "O pedido deve conter pelo menos um item.")
    @Valid
    private List<OrderItemDTO> items;

    @NotNull(message = "O endereço de entrega é obrigatório.")
    private AddressDTO deliveryAddress;

    private Double total;

    private Double freightPrice;

    private Double couponDiscount;

    private String couponCode;

    private String carrierName;

    private Integer estimatedDeliveryDays;

    private LocalDate orderDate;
}
