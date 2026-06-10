package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderResponseDTO;
import br.edu.utfpr.pb.pw44s.server.dto.OrderSupportRequestDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {

    List<Order> findByUserEmail(String email);

    Order findByIdAndUserEmail(Long id, String email);

    OrderResponseDTO toResponseDto(Order order);

    Order submitSupportRequest(Long orderId, String email, OrderSupportRequestDTO dto);

    Order saveFromDto(OrderDTO dto, User user);
}