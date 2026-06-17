package com.agenticshopping.orderservice.controller;

import com.agenticshopping.orderservice.entity.Order;
import com.agenticshopping.orderservice.entity.PaymentStatus;
import com.agenticshopping.orderservice.service.OrderService;
import com.agenticshopping.orderservice.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderService orderService;
    private final StripeService stripeService;

    // 1. Créer session de paiement
    @PostMapping("/checkout/{orderId}")
    public String checkout(@PathVariable String orderId) {

        Order order = orderService.getOrderById(orderId);

        return stripeService.createCheckoutSession(order);
    }

    // 2. Success URL
    @GetMapping("/success")
    public String success(@RequestParam String orderId) {

        orderService.updatePaymentStatus(orderId, PaymentStatus.PAID);

        return "Payment successful for order " + orderId;
    }

    // 3. Cancel URL
    @GetMapping("/cancel")
    public String cancel(@RequestParam String orderId) {
        return "Payment cancelled for order " + orderId;
    }
}