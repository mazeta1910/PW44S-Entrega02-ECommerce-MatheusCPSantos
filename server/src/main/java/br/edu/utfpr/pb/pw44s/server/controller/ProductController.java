package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.ProductDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.ProductMapper;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}