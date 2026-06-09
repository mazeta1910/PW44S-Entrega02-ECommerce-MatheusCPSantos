package br.edu.utfpr.pb.pw44s.server.catalog;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class ProductCatalogSpecification {

    private ProductCatalogSpecification() {
    }

    public static Specification<Product> withFilters(
            List<Long> categoryIds,
            List<DeliveryType> deliveryTypes,
            List<Platform> platforms,
            List<ItemCondition> itemConditions,
            String search,
            Boolean onSale,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            CatalogSort sort) {

        return (root, query, criteriaBuilder) -> {
            boolean countQuery = isCountQuery(query);
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern)
                ));
            }

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

            if (Boolean.TRUE.equals(onSale)) {
                Subquery<Long> promoSubquery = query.subquery(Long.class);
                Root<ProductVariant> promoVariant = promoSubquery.from(ProductVariant.class);
                promoSubquery.select(promoVariant.get("id"))
                        .where(
                                criteriaBuilder.equal(promoVariant.get("product"), root),
                                criteriaBuilder.isTrue(promoVariant.get("active")),
                                criteriaBuilder.isNotNull(promoVariant.get("listPrice")),
                                criteriaBuilder.greaterThan(
                                        promoVariant.get("listPrice"),
                                        promoVariant.get("price")
                                )
                        );
                predicates.add(criteriaBuilder.exists(promoSubquery));
            }

            if (minPrice != null || maxPrice != null) {
                Subquery<BigDecimal> startingPriceSubquery =
                        minActiveVariantPrice(root, query, criteriaBuilder);
                if (minPrice != null) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                            startingPriceSubquery,
                            minPrice
                    ));
                }
                if (maxPrice != null) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(
                            startingPriceSubquery,
                            maxPrice
                    ));
                }
            }

            if (!countQuery && query != null) {
                query.distinct(true);
                root.fetch("category", JoinType.LEFT);
                if (!filterByVariant) {
                    root.fetch("variants", JoinType.LEFT);
                }
                applySort(root, query, criteriaBuilder, sort);
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void applySort(
            Root<Product> root,
            CriteriaQuery<?> query,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder,
            CatalogSort sort) {
        if (sort == null || sort == CatalogSort.RELEVANCE) {
            query.orderBy(criteriaBuilder.desc(root.get("id")));
            return;
        }

        List<Order> orders = new ArrayList<>();

        switch (sort) {
            case PRICE_ASC -> orders.add(criteriaBuilder.asc(minActiveVariantPrice(root, query, criteriaBuilder)));
            case PRICE_DESC -> orders.add(criteriaBuilder.desc(minActiveVariantPrice(root, query, criteriaBuilder)));
            case RATING_DESC -> {
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("averageRating"), 0.0)
                ));
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("reviewCount"), 0)
                ));
            }
            case POPULARITY_DESC -> {
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("reviewCount"), 0)
                ));
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("averageRating"), 0.0)
                ));
            }
            case DISCOUNT_DESC -> orders.add(criteriaBuilder.desc(
                    maxActiveVariantDiscount(root, query, criteriaBuilder)
            ));
            case NAME_ASC -> orders.add(criteriaBuilder.asc(criteriaBuilder.lower(root.get("name"))));
            case NAME_DESC -> orders.add(criteriaBuilder.desc(criteriaBuilder.lower(root.get("name"))));
            default -> orders.add(criteriaBuilder.desc(root.get("id")));
        }

        query.orderBy(orders);
    }

    private static Subquery<BigDecimal> minActiveVariantPrice(
            Root<Product> root,
            CriteriaQuery<?> query,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder) {
        Subquery<BigDecimal> subquery = query.subquery(BigDecimal.class);
        Root<ProductVariant> variant = subquery.from(ProductVariant.class);
        subquery.select(criteriaBuilder.min(variant.get("price")))
                .where(
                        criteriaBuilder.equal(variant.get("product"), root),
                        criteriaBuilder.isTrue(variant.get("active"))
                );
        return subquery;
    }

    private static Subquery<BigDecimal> maxActiveVariantDiscount(
            Root<Product> root,
            CriteriaQuery<?> query,
            jakarta.persistence.criteria.CriteriaBuilder criteriaBuilder) {
        Subquery<BigDecimal> subquery = query.subquery(BigDecimal.class);
        Root<ProductVariant> variant = subquery.from(ProductVariant.class);
        subquery.select(criteriaBuilder.max(
                criteriaBuilder.diff(variant.get("listPrice"), variant.get("price"))
        )).where(
                criteriaBuilder.equal(variant.get("product"), root),
                criteriaBuilder.isTrue(variant.get("active")),
                criteriaBuilder.isNotNull(variant.get("listPrice")),
                criteriaBuilder.greaterThan(variant.get("listPrice"), variant.get("price"))
        );
        return subquery;
    }

    private static boolean isCountQuery(CriteriaQuery<?> query) {
        if (query == null || query.getResultType() == null) {
            return false;
        }
        Class<?> resultType = query.getResultType();
        return Long.class.equals(resultType) || long.class.equals(resultType);
    }
}
