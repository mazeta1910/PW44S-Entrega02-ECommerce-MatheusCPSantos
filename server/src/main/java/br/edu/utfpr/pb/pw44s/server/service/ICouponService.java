package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.CouponValidationDTO;
import br.edu.utfpr.pb.pw44s.server.model.Coupon;

public interface ICouponService extends ICrudService<Coupon, Long> {

    Coupon findByCode(String code);

    CouponValidationDTO validateCoupon(String code, double subtotal, String userEmail);
}
