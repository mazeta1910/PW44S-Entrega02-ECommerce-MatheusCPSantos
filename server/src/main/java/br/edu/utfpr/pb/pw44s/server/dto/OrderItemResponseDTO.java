package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDTO {

    private Long id;
    private Long variantId;
    private String productName;
    private String variantLabel;
    private DeliveryType deliveryType;
    private Platform platform;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
