package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.catalog.CatalogSort;
import br.edu.utfpr.pb.pw44s.server.dto.CatalogPriceBoundsDTO;
import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.ProductMapper;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("products")
public class ProductController extends CrudController<Product, ProductDTO, Long> {

    private final ProductMapper productMapper;

    public ProductController(IProductService productService, ProductMapper productMapper) {
        this.productMapper = productMapper;
        ProductController.productService = productService;
    }

    private static IProductService productService;

    @Override
    protected ICrudService<Product, Long> getService() {
        return productService;
    }

    @Override
    protected ProductDTO toDto(Product entity) {
        return productMapper.toDto(entity);
    }

    @Override
    protected Product toEntity(ProductDTO dto) {
        return productMapper.toEntity(dto);
    }

    @GetMapping("by-category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> findByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.findByCategoryId(categoryId)
                .stream()
                .map(productMapper::toDto)
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("catalog/price-bounds")
    public ResponseEntity<CatalogPriceBoundsDTO> getCatalogPriceBounds() {
        return ResponseEntity.ok(productService.getCatalogPriceBounds());
    }

    @GetMapping("catalog")
    public ResponseEntity<Page<ProductDTO>> findCatalog(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) List<Long> categoryIds,
            @RequestParam(required = false) List<DeliveryType> deliveryTypes,
            @RequestParam(required = false) List<Platform> platforms,
            @RequestParam(required = false) List<ItemCondition> itemConditions,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean onSale,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) CatalogSort sort) {
        Page<Product> productPage = productService.findCatalog(
                PageRequest.of(page, size),
                categoryIds,
                deliveryTypes,
                platforms,
                itemConditions,
                q,
                onSale,
                minPrice,
                maxPrice,
                sort
        );
        return ResponseEntity.ok(productPage.map(productMapper::toDto));
    }

}