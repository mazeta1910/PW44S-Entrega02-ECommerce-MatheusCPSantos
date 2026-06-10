package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.catalog.CatalogSort;
import br.edu.utfpr.pb.pw44s.server.catalog.ProductCatalogSpecification;
import br.edu.utfpr.pb.pw44s.server.dto.CatalogPriceBoundsDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import br.edu.utfpr.pb.pw44s.server.repository.ProductRepository;
import br.edu.utfpr.pb.pw44s.server.repository.ProductVariantRepository;
import br.edu.utfpr.pb.pw44s.server.service.IProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductServiceImpl extends CrudServiceImpl<Product, Long>
        implements IProductService {

    private static final BigDecimal DEFAULT_MIN_PRICE = BigDecimal.ZERO;
    private static final BigDecimal DEFAULT_MAX_PRICE = new BigDecimal("5000");

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            ProductVariantRepository productVariantRepository) {
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
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
            List<ItemCondition> itemConditions,
            String search,
            Boolean onSale,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            CatalogSort sort) {
        boolean hasCategoryFilter = categoryIds != null && !categoryIds.isEmpty();
        boolean hasDeliveryFilter = deliveryTypes != null && !deliveryTypes.isEmpty();
        boolean hasPlatformFilter = platforms != null && !platforms.isEmpty();
        boolean hasConditionFilter = itemConditions != null && !itemConditions.isEmpty();
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasOnSaleFilter = Boolean.TRUE.equals(onSale);
        boolean hasMinPriceFilter = minPrice != null;
        boolean hasMaxPriceFilter = maxPrice != null;
        CatalogSort effectiveSort = sort != null ? sort : CatalogSort.RELEVANCE;

        if (!hasCategoryFilter && !hasDeliveryFilter && !hasPlatformFilter
                && !hasConditionFilter && !hasSearch && !hasOnSaleFilter
                && !hasMinPriceFilter && !hasMaxPriceFilter
                && effectiveSort == CatalogSort.RELEVANCE) {
            return productRepository.findAll(pageable);
        }

        return productRepository.findAll(
                ProductCatalogSpecification.withFilters(
                        categoryIds,
                        deliveryTypes,
                        platforms,
                        itemConditions,
                        search,
                        onSale,
                        minPrice,
                        maxPrice,
                        effectiveSort),
                pageable
        );
    }

    @Override
    public CatalogPriceBoundsDTO getCatalogPriceBounds() {
        return productVariantRepository.findActivePriceBoundsAsDecimals()
                .map(bounds -> CatalogPriceBoundsDTO.builder()
                        .minPrice(bounds[0])
                        .maxPrice(bounds[1])
                        .build())
                .orElseGet(() -> CatalogPriceBoundsDTO.builder()
                        .minPrice(DEFAULT_MIN_PRICE)
                        .maxPrice(DEFAULT_MAX_PRICE)
                        .build());
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
