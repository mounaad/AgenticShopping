package com.agenticshopping.orderservice.service;

import com.agenticshopping.orderservice.entity.Cart;
import com.agenticshopping.orderservice.entity.CartItem;
import com.agenticshopping.orderservice.repository.CartItemRepository;
import com.agenticshopping.orderservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    // Récupérer ou créer le panier d'un user
    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUserId(userId);
                    return cartRepository.save(cart);
                });
    }

    // Ajouter un produit au panier
    public Cart addItem(String userId, String productId, String productName, Double price, Integer quantity) {
        Cart cart = getOrCreateCart(userId);

        // Si le produit existe déjà → augmente la quantité
        Optional<CartItem> existing = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), productId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProductId(productId);
            item.setProductName(productName);
            item.setPrice(price);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return cartRepository.findById(cart.getId()).orElseThrow();
    }

    // Supprimer un item du panier
    public void removeItem(String cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    // Vider le panier
    public void clearCart(String userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
    }
}
