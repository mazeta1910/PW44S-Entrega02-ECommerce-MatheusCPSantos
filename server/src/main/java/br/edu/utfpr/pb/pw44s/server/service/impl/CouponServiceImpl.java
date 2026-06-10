package br.edu.utfpr.pb.pw44s.server.service.impl;

import br.edu.utfpr.pb.pw44s.server.dto.CouponValidationDTO;
import br.edu.utfpr.pb.pw44s.server.model.Coupon;
import br.edu.utfpr.pb.pw44s.server.model.enums.DiscountType;
import br.edu.utfpr.pb.pw44s.server.model.enums.OrderStatus;
import br.edu.utfpr.pb.pw44s.server.repository.CouponRepository;
import br.edu.utfpr.pb.pw44s.server.repository.OrderRepository;
import br.edu.utfpr.pb.pw44s.server.service.ICouponService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
public class CouponServiceImpl extends CrudServiceImpl<Coupon, Long> implements ICouponService {

    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;

    public CouponServiceImpl(CouponRepository couponRepository, OrderRepository orderRepository) {
        this.couponRepository = couponRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    protected JpaRepository<Coupon, Long> getRepository() {
        return couponRepository;
    }

    @Override
    public Coupon findByCode(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        return couponRepository.findByCodeAndActiveTrue(code.trim()).orElse(null);
    }

    @Override
    public CouponValidationDTO validateCoupon(String code, double subtotal, String userEmail) {
        if (code == null || code.isBlank()) {
            return invalid(code, "Informe um código de cupom.");
        }

        Coupon coupon = findByCode(code);
        if (coupon == null) {
            return invalid(code, "Cupom inválido ou inexistente.");
        }

        LocalDate today = LocalDate.now();
        if (coupon.getStartDate() != null && today.isBefore(coupon.getStartDate())) {
            return invalid(code, "Este cupom ainda não está vigente.");
        }
        if (coupon.getEndDate() != null && today.isAfter(coupon.getEndDate())) {
            return invalid(code, "Este cupom expirou.");
        }

        BigDecimal subtotalValue = BigDecimal.valueOf(subtotal);
        if (coupon.getMinPurchaseValue() != null
                && subtotalValue.compareTo(coupon.getMinPurchaseValue()) < 0) {
            return invalid(code, "Valor mínimo da compra não atingido para este cupom.");
        }

        if (Boolean.TRUE.equals(coupon.getFirstPurchaseOnly()) && userEmail != null) {
            long previousOrders = orderRepository.countByUser_Email(userEmail);
            if (previousOrders > 0) {
                return invalid(code, "Cupom válido apenas para a primeira compra.");
            }
        }

        if (userEmail != null && coupon.getCode() != null) {
            long previousUses = orderRepository
                    .countByUser_EmailAndCouponCodeIgnoreCaseAndStatusNot(
                            userEmail, coupon.getCode(), OrderStatus.CANCELLED);
            if (previousUses > 0) {
                return invalid(code, "Você já utilizou este cupom em outro pedido.");
            }
        }

        BigDecimal discountAmount = calculateDiscount(coupon, subtotalValue);
        if (discountAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return invalid(code, "Cupom não aplicável a este pedido.");
        }

        return CouponValidationDTO.builder()
                .code(coupon.getCode())
                .discountAmount(discountAmount.setScale(2, RoundingMode.HALF_UP).doubleValue())
                .valid(true)
                .message("Cupom aplicado com sucesso!")
                .build();
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        if (coupon.getType() == DiscountType.PERCENTAGE) {
            return subtotal
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        return coupon.getDiscountValue().min(subtotal);
    }

    private CouponValidationDTO invalid(String code, String message) {
        return CouponValidationDTO.builder()
                .code(code)
                .discountAmount(0.0)
                .valid(false)
                .message(message)
                .build();
    }

    @Override
    public void deleteById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cupom não encontrado"));

        coupon.setActive(false);
        couponRepository.save(coupon);
    }
}
