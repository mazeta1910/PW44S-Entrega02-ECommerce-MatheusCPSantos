package br.edu.utfpr.pb.pw44s.server.mapper;

import br.edu.utfpr.pb.pw44s.server.dto.ProductVariantDTO;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductVariantMapper {

    @Mapping(target = "productId", source = "product.id")
    ProductVariantDTO toDto(ProductVariant entity);

    @Mapping(target = "product", ignore = true)
    ProductVariant toEntity(ProductVariantDTO dto);
}
