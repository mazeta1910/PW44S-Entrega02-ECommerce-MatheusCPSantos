package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.dto.OrderDTO;
import br.edu.utfpr.pb.pw44s.server.model.Order;
import br.edu.utfpr.pb.pw44s.server.model.User;

import java.util.List;

public interface IOrderService extends ICrudService<Order, Long> {

    List<Order> findByUsername(String username);

    Order saveFromDto(OrderDTO dto, User user);
}