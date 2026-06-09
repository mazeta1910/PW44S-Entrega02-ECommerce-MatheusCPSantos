package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String description;

    @NotNull
    private String image;

    private CategoryDTO category;

    @Builder.Default
    private Boolean adultOnly = false;

    private Double averageRating;

    @Builder.Default
    private Integer reviewCount = 0;

    private String specifications;

    @Builder.Default
    private List<ProductVariantDTO> variants = new ArrayList<>();

    /** Menor preço entre as variações ativas (útil para vitrine). */
    private BigDecimal startingPrice;
}
