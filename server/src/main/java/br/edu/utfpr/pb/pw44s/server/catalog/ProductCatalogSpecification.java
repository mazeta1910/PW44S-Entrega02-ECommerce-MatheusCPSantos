package br.edu.utfpr.pb.pw44s.server.catalog;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
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

            addVariantFilterExists(
                    root,
                    query,
                    criteriaBuilder,
                    predicates,
                    deliveryTypes,
                    platforms,
                    itemConditions
            );

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
                applySort(root, query, criteriaBuilder, sort);
            }

            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addVariantFilterExists(
            Root<Product> root,
            CriteriaQuery<?> query,
            CriteriaBuilder criteriaBuilder,
            List<Predicate> predicates,
            List<DeliveryType> deliveryTypes,
            List<Platform> platforms,
            List<ItemCondition> itemConditions) {
        boolean hasDeliveryFilter = deliveryTypes != null && !deliveryTypes.isEmpty();
        boolean hasPlatformFilter = platforms != null && !platforms.isEmpty();
        boolean hasConditionFilter = itemConditions != null && !itemConditions.isEmpty();

        if (!hasDeliveryFilter && !hasPlatformFilter && !hasConditionFilter) {
            return;
        }

        Subquery<Long> variantSubquery = query.subquery(Long.class);
        Root<ProductVariant> variant = variantSubquery.from(ProductVariant.class);
        List<Predicate> variantPredicates = new ArrayList<>();
        variantPredicates.add(criteriaBuilder.equal(variant.get("product"), root));
        variantPredicates.add(criteriaBuilder.isTrue(variant.get("active")));

        if (hasDeliveryFilter) {
            variantPredicates.add(variant.get("deliveryType").in(deliveryTypes));
        }
        if (hasPlatformFilter) {
            variantPredicates.add(variant.get("platform").in(platforms));
        }
        if (hasConditionFilter) {
            variantPredicates.add(variant.get("itemCondition").in(itemConditions));
        }

        variantSubquery.select(variant.get("id"))
                .where(variantPredicates.toArray(new Predicate[0]));
        predicates.add(criteriaBuilder.exists(variantSubquery));
    }

    private static void applySort(
            Root<Product> root,
            CriteriaQuery<?> query,
            CriteriaBuilder criteriaBuilder,
            CatalogSort sort) {
        if (sort == null || sort == CatalogSort.RELEVANCE) {
            query.orderBy(criteriaBuilder.desc(root.get("id")));
            return;
        }

        List<Order> orders = new ArrayList<>();

        switch (sort) {
            case PRICE_ASC -> {
                orders.add(criteriaBuilder.asc(minActiveVariantPrice(root, query, criteriaBuilder)));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case PRICE_DESC -> {
                orders.add(criteriaBuilder.desc(minActiveVariantPrice(root, query, criteriaBuilder)));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case RATING_DESC -> {
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("averageRating"), 0.0)
                ));
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("reviewCount"), 0)
                ));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case POPULARITY_DESC -> {
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("reviewCount"), 0)
                ));
                orders.add(criteriaBuilder.desc(
                        criteriaBuilder.coalesce(root.get("averageRating"), 0.0)
                ));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case DISCOUNT_DESC -> {
                orders.add(criteriaBuilder.desc(
                        maxActiveVariantDiscount(root, query, criteriaBuilder)
                ));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case NAME_ASC -> {
                orders.add(criteriaBuilder.asc(criteriaBuilder.lower(root.get("name"))));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            case NAME_DESC -> {
                orders.add(criteriaBuilder.desc(criteriaBuilder.lower(root.get("name"))));
                orders.add(criteriaBuilder.desc(root.get("id")));
            }
            default -> orders.add(criteriaBuilder.desc(root.get("id")));
        }

        query.orderBy(orders);
    }

    private static Subquery<BigDecimal> minActiveVariantPrice(
            Root<Product> root,
            CriteriaQuery<?> query,
            CriteriaBuilder criteriaBuilder) {
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
            CriteriaBuilder criteriaBuilder) {
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
