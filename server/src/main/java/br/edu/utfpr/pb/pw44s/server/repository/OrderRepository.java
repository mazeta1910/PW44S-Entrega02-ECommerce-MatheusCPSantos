package br.edu.utfpr.pb.pw44s.server.repository;

import br.edu.utfpr.pb.pw44s.server.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product", "user", "deliveryAddress"})
    List<Order> findByUser_Email(String email);

    @EntityGraph(attributePaths = {"items", "items.variant", "items.variant.product", "user", "deliveryAddress"})
    Optional<Order> findById(Long id);
}