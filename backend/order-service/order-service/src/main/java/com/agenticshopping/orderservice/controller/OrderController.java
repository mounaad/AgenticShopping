package com.agenticshopping.orderservice.controller;


import com.agenticshopping.orderservice.entity.Order;
import com.agenticshopping.orderservice.entity.OrderStatus;
import com.agenticshopping.orderservice.entity.PaymentMethod;
import com.agenticshopping.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    public Order placeOrder(
            @PathVariable String userId,
            @RequestParam PaymentMethod paymentMethod) {

        return orderService.placeOrder(userId, paymentMethod);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable String userId) {
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable String orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/{orderId}/status")
    public Order updateStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status) {

        return orderService.updateStatus(orderId, status);
    }


}