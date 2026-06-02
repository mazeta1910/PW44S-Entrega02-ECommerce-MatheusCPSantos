package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.ProductVariant;

import java.util.List;

public interface IProductVariantService extends ICrudService<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);
}
