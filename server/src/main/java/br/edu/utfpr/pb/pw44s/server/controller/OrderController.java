package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.mapper.OrderMapper;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.ICrudService;
import br.edu.utfpr.pb.pw44s.server.service.IOrderService;
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
        String username = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        List<Order> orders = orderService.findByUsername(username);
        return ResponseEntity.ok(orders.stream().map(orderMapper::toResponseDto).collect(Collectors.toList()));
    }

    @PostMapping("checkout")
    public ResponseEntity<OrderResponseDTO> finalizePurchase(@RequestBody OrderDTO orderDto,
                                                             @AuthenticationPrincipal User user) {
        Order savedOrder = orderService.saveFromDto(orderDto, user);
        Order completeOrder = orderService.findById(savedOrder.getId());

        return ResponseEntity.ok(orderMapper.toResponseDto(completeOrder));
    }
}