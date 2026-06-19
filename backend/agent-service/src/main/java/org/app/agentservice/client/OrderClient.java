package org.app.agentservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;


@FeignClient(
        name="order-service"
)
public interface OrderClient {


    @PostMapping("/api/cart/{userId}/add")
    String addToCart(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam String productName,
            @RequestParam Double price,
            @RequestParam Integer quantity
    );



    @GetMapping("/api/cart/{userId}")
    String getCart(
            @PathVariable String userId
    );




    @PostMapping("/api/orders/{userId}")
    String createOrder(
            @PathVariable String userId,
            @RequestParam String paymentMethod
    );



    @GetMapping("/api/orders/{orderId}")
    String getOrder(
            @PathVariable String orderId
    );



    @GetMapping("/api/orders/user/{userId}")
    String getUserOrders(
            @PathVariable String userId
    );



    @PostMapping("/api/payments/checkout/{orderId}")
    String createCheckout(
            @PathVariable String orderId
    );



    @GetMapping("/api/payments/cancel")
    String cancelPayment(
            @RequestParam String orderId
    );


}