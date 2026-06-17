package com.agenticshopping.orderservice.repository;

import com.agenticshopping.orderservice.entity.Order;
import com.agenticshopping.orderservice.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStatus(OrderStatus status);
}
