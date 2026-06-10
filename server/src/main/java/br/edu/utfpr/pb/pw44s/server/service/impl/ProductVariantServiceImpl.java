package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.repository.ProductVariantRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductVariantService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVariantServiceImpl extends CrudServiceImpl<ProductVariant, Long>
        implements IProductVariantService {

    private final ProductVariantRepository productVariantRepository;

    public ProductVariantServiceImpl(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    @Override
    protected JpaRepository<ProductVariant, Long> getRepository() {
        return productVariantRepository;
    }

    @Override
    public List<ProductVariant> findByProductId(Long productId) {
        return productVariantRepository.findByProduct_IdAndActiveTrue(productId);
    }
}
