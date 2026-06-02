package br.edu.utfpr.pb.pw44s.server.model;

import java.math.BigDecimal;
import java.util.Objects;

import br.edu.utfpr.pb.pw44s.server.model.enums.DeliveryType;
import br.edu.utfpr.pb.pw44s.server.model.enums.ItemCondition;
import br.edu.utfpr.pb.pw44s.server.model.enums.Platform;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_product_variant")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Column(length = 120)
    private String label;

    @NotNull
    @Column(length = 50, unique = true)
    private String sku;

    @NotNull
    private BigDecimal price;

    @Column(name = "list_price")
    private BigDecimal listPrice;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_type", nullable = false)
    private DeliveryType deliveryType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "item_condition", nullable = false)
    private ItemCondition itemCondition;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean active = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductVariant that = (ProductVariant) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
