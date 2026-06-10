package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.CouponDTO;
import br.edu.utfpr.pb.pw44s.server.dto.CouponValidationDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.CouponMapper;
import br.edu.utfpr.pb.pw44s.server.model.Coupon;
import br.edu.utfpr.pb.pw44s.server.service.ICouponService;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("coupons")
public class CouponController extends CrudController<Coupon, CouponDTO, Long> {

    private final ICouponService couponService;
    private final CouponMapper couponMapper;

    public CouponController(ICouponService couponService, CouponMapper couponMapper) {
        this.couponService = couponService;
        this.couponMapper = couponMapper;
    }

    @Override
    protected ICrudService<Coupon, Long> getService() {
        return couponService;
    }

    @Override
    protected CouponDTO toDto(Coupon entity) {
        return couponMapper.toDto(entity);
    }

    @Override
    protected Coupon toEntity(CouponDTO dto) {
        return couponMapper.toEntity(dto);
    }

    @GetMapping("validate")
    public ResponseEntity<CouponValidationDTO> validate(
            @RequestParam String code,
            @RequestParam(defaultValue = "0") double subtotal) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        return ResponseEntity.ok(couponService.validateCoupon(code, subtotal, email));
    }
}
