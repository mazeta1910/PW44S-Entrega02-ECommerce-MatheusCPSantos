package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductVariantDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.ProductVariantMapper;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("product-variants")
public class ProductVariantController extends CrudController<ProductVariant, ProductVariantDTO, Long> {

    private final IProductVariantService productVariantService;
    private final ProductVariantMapper productVariantMapper;

    public ProductVariantController(
            IProductVariantService productVariantService,
            ProductVariantMapper productVariantMapper) {
        this.productVariantService = productVariantService;
        this.productVariantMapper = productVariantMapper;
    }

    @Override
    protected ICrudService<ProductVariant, Long> getService() {
        return productVariantService;
    }

    @Override
    protected ProductVariantDTO toDto(ProductVariant entity) {
        return productVariantMapper.toDto(entity);
    }

    @Override
    protected ProductVariant toEntity(ProductVariantDTO dto) {
        return productVariantMapper.toEntity(dto);
    }

    @GetMapping("by-product/{productId}")
    public ResponseEntity<List<ProductVariantDTO>> findByProduct(@PathVariable Long productId) {
        List<ProductVariantDTO> variants = productVariantService.findByProductId(productId)
                .stream()
                .map(productVariantMapper::toDto)
                .toList();
        return ResponseEntity.ok(variants);
    }
}
