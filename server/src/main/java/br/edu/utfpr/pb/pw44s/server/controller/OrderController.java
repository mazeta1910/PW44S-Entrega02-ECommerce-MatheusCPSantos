package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderSupportRequestDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("orders")
public class OrderController extends CrudController<Order, OrderDTO, Long> {

    private final IOrderService orderService;
    private final OrderMapper orderMapper; // Injetamos o Mapper aqui

    public OrderController(IOrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @Override
    protected ICrudService<Order, Long> getService() {
        return orderService;
    }

    @Override
    protected OrderDTO toDto(Order entity) {
        return orderMapper.toDto(entity);
    }

    @Override
    protected Order toEntity(OrderDTO dto) {
        return orderMapper.toEntity(dto);
    }

    @GetMapping("me")
    public ResponseEntity<List<OrderResponseDTO>> findMyOrders() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        List<Order> orders = orderService.findByUserEmail(email);
        return ResponseEntity.ok(
                orders.stream().map(orderService::toResponseDto).collect(Collectors.toList()));
    }

    @GetMapping("me/{id}")
    public ResponseEntity<OrderResponseDTO> findMyOrder(@PathVariable Long id) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        Order order = orderService.findByIdAndUserEmail(id, email);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(orderService.toResponseDto(order));
    }

    @PostMapping("me/{id}/support-request")
    public ResponseEntity<OrderResponseDTO> submitSupportRequest(
            @PathVariable Long id,
            @RequestBody @Valid OrderSupportRequestDTO requestDto) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        Order updatedOrder = orderService.submitSupportRequest(id, email, requestDto);
        return ResponseEntity.ok(orderService.toResponseDto(updatedOrder));
    }

    @PostMapping("checkout")
    public ResponseEntity<OrderResponseDTO> finalizePurchase(@RequestBody OrderDTO orderDto,
                                                             @AuthenticationPrincipal User user) {
        Order savedOrder = orderService.saveFromDto(orderDto, user);
        Order completeOrder = orderService.findById(savedOrder.getId());

        return ResponseEntity.ok(orderService.toResponseDto(completeOrder));
    }
}