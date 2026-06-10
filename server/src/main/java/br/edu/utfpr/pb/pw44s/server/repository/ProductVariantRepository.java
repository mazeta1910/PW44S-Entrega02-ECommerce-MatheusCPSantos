package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProduct_IdAndActiveTrue(Long productId);

    List<ProductVariant> findByProduct_Category_IdAndActiveTrue(Long categoryId);

    @Query("""
            SELECT MIN(v.price), MAX(v.price)
            FROM ProductVariant v
            WHERE v.active = true
            """)
    Optional<Object[]> findActivePriceBounds();

    default Optional<BigDecimal[]> findActivePriceBoundsAsDecimals() {
        return findActivePriceBounds()
                .filter(bounds -> bounds.length == 2 && bounds[0] != null && bounds[1] != null)
                .map(bounds -> new BigDecimal[]{
                        (BigDecimal) bounds[0],
                        (BigDecimal) bounds[1]
                });
    }
}
