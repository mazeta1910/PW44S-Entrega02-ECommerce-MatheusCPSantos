package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findAll();

    @EntityGraph(attributePaths = {"category", "variants"})
    Optional<Product> findById(Long id);

    @EntityGraph(attributePaths = {"category", "variants"})
    List<Product> findByCategory_Id(Long categoryId);

    @EntityGraph(attributePaths = {"category", "variants"})
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"category", "variants"})
    Page<Product> findByCategory_IdIn(Collection<Long> categoryIds, Pageable pageable);
}
