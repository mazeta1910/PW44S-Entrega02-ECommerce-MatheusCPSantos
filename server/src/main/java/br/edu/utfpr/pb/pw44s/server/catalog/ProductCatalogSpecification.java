package br.edu.utfpr.pb.pw44s.server.catalog;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductCatalogSpecification {

    private ProductCatalogSpecification() {
    }

    public static Specification<Product> withFilters(
            List<Long> categoryIds,
            List<DeliveryType> deliveryTypes,
            List<Platform> platforms,
            List<ItemCondition> itemConditions) {

        return (root, query, criteriaBuilder) -> {
            boolean countQuery = isCountQuery(query);
            List<Predicate> predicates = new ArrayList<>();

            if (categoryIds != null && !categoryIds.isEmpty()) {
                predicates.add(root.get("category").get("id").in(categoryIds));
            }

            boolean filterByVariant =
                    (deliveryTypes != null && !deliveryTypes.isEmpty())
                            || (platforms != null && !platforms.isEmpty())
                            || (itemConditions != null && !itemConditions.isEmpty());

            if (filterByVariant) {
                Join<Product, ProductVariant> variants = root.join("variants", JoinType.INNER);
                predicates.add(criteriaBuilder.isTrue(variants.get("active")));

                if (deliveryTypes != null && !deliveryTypes.isEmpty()) {
                    predicates.add(variants.get("deliveryType").in(deliveryTypes));
                }
                if (platforms != null && !platforms.isEmpty()) {
                    predicates.add(variants.get("platform").in(platforms));
                }
                if (itemConditions != null && !itemConditions.isEmpty()) {
                    predicates.add(variants.get("itemCondition").in(itemConditions));
                }
            }

            if (!countQuery && query != null) {
                query.distinct(true);
                root.fetch("category", JoinType.LEFT);
                if (!filterByVariant) {
                    root.fetch("variants", JoinType.LEFT);
                }
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean isCountQuery(CriteriaQuery<?> query) {
        if (query == null || query.getResultType() == null) {
            return false;
        }
        Class<?> resultType = query.getResultType();
        return Long.class.equals(resultType) || long.class.equals(resultType);
    }
}
