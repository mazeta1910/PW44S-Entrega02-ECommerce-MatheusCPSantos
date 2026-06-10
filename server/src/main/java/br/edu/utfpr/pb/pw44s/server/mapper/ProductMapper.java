package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {CategoryMapper.class, ProductVariantMapper.class}
)
public interface ProductMapper {

    @Mapping(target = "startingPrice", ignore = true)
    ProductDTO toDto(Product entity);

    Product toEntity(ProductDTO dto);

    @AfterMapping
    default void fillStartingPrice(Product entity, @MappingTarget ProductDTO dto) {
        if (entity.getVariants() == null || entity.getVariants().isEmpty()) {
            return;
        }
        dto.setStartingPrice(
                entity.getVariants().stream()
                        .filter(v -> Boolean.TRUE.equals(v.getActive()))
                        .map(ProductVariant::getPrice)
                        .min(BigDecimal::compareTo)
                        .orElse(null)
        );
    }
}
