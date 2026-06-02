package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.catalog.ProductCatalogSpecification;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductServiceImpl extends CrudServiceImpl<Product, Long>
        implements IProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    protected JpaRepository<Product, Long> getRepository() {
        return productRepository;
    }

    @Override
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    @Override
    public Page<Product> findCatalog(
            Pageable pageable,
            List<Long> categoryIds,
            List<DeliveryType> deliveryTypes,
            List<Platform> platforms,
            List<ItemCondition> itemConditions) {
        boolean hasCategoryFilter = categoryIds != null && !categoryIds.isEmpty();
        boolean hasDeliveryFilter = deliveryTypes != null && !deliveryTypes.isEmpty();
        boolean hasPlatformFilter = platforms != null && !platforms.isEmpty();
        boolean hasConditionFilter = itemConditions != null && !itemConditions.isEmpty();

        if (!hasCategoryFilter && !hasDeliveryFilter && !hasPlatformFilter && !hasConditionFilter) {
            return productRepository.findAll(pageable);
        }

        return productRepository.findAll(
                ProductCatalogSpecification.withFilters(
                        categoryIds, deliveryTypes, platforms, itemConditions),
                pageable
        );
    }

    @Override
    @Transactional
    public Product save(Product entity) {
        if (entity.getVariants() != null) {
            entity.getVariants().forEach(variant -> variant.setProduct(entity));
        }
        return productRepository.save(entity);
    }
}
