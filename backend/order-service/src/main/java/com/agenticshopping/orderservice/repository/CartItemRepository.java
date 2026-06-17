package com.agenticshopping.orderservice.repository;

import com.agenticshopping.orderservice.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    List<CartItem> findByCartId(String cartId);
    Optional<CartItem> findByCartIdAndProductId(String cartId, String productId);
}