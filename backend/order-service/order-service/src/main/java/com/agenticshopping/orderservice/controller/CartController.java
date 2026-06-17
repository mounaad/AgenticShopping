package com.agenticshopping.orderservice.controller;


import com.agenticshopping.orderservice.entity.Cart;
import com.agenticshopping.orderservice.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getOrCreateCart(userId);
    }

    @PostMapping("/{userId}/add")
    public Cart addItem(
            @PathVariable String userId,
            @RequestParam String productId,
            @RequestParam String productName,
            @RequestParam Double price,
            @RequestParam Integer quantity) {

        return cartService.addItem(
                userId,
                productId,
                productName,
                price,
                quantity
        );
    }

    @DeleteMapping("/item/{cartItemId}")
    public void removeItem(@PathVariable String cartItemId) {
        cartService.removeItem(cartItemId);
    }

    @DeleteMapping("/{userId}/clear")
    public void clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
    }
}