package org.app.productservice.repository;

import org.app.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryName(String name);

    List<Product> findByNameContainingIgnoreCase(String name);
}