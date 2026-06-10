package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.catalog.CatalogSort;
import br.edu.utfpr.pb.pw44s.server.dto.CatalogPriceBoundsDTO;
import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService extends ICrudService<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    Page<Product> findCatalog(
            Pageable pageable,
            List<Long> categoryIds,
            List<DeliveryType> deliveryTypes,
            List<Platform> platforms,
            List<ItemCondition> itemConditions,
            String search,
            Boolean onSale,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            CatalogSort sort
    );

    CatalogPriceBoundsDTO getCatalogPriceBounds();
}
