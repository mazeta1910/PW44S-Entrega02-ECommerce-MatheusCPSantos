package br.edu.utfpr.pb.pw44s.server.dto;

import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantDTO {

    private Long id;

    private Long productId;

    @NotNull
    private String label;

    @NotNull
    private String sku;

    @NotNull
    private BigDecimal price;

    @NotNull
    private DeliveryType deliveryType;

    @NotNull
    private Platform platform;

    @NotNull
    private ItemCondition itemCondition;

    @Builder.Default
    private Boolean active = true;
}
