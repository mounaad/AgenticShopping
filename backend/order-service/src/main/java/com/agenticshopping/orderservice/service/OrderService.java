package com.agenticshopping.orderservice.service;

import com.agenticshopping.orderservice.entity.*;
import com.agenticshopping.orderservice.repository.CartRepository;
import com.agenticshopping.orderservice.repository.OrderRepository;
import com.agenticshopping.orderservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PaymentRepository paymentRepository;

    // Créer une commande depuis le panier
    public Order placeOrder(String userId, PaymentMethod paymentMethod) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty())
            throw new RuntimeException("Cart is empty");

        // Créer la commande
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus(OrderStatus.PENDING);

        // Convertir CartItems en OrderItems
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(cartItem.getProductId());
            item.setProductName(cartItem.getProductName());
            item.setPrice(cartItem.getPrice());
            item.setQuantity(cartItem.getQuantity());
            return item;
        }).toList();

        order.setItems(orderItems);

        // Calculer le total
        Double total = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Créer le paiement
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setMethod(paymentMethod);
        payment.setAmount(total);
        payment.setIsPaid(paymentMethod == PaymentMethod.ONLINE);
        paymentRepository.save(payment);

        return savedOrder;
    }

    // Récupérer les commandes d'un user
    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }

    // Récupérer une commande par id
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Changer le statut d'une commande (ADMIN)
    public Order updateStatus(String orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void updatePaymentStatus(String orderId, PaymentStatus status) {

        Order order = getOrderById(orderId);

        order.getPayment().setStatus(status);

        if (status == PaymentStatus.PAID) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        orderRepository.save(order);
    }
}