package org.app.productservice.service;

import org.app.productservice.entity.Product;
import org.app.productservice.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Product getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product create(Product product) {
        return repo.save(product);
    }

    public Product update(Long id, Product p) {
        return repo.findById(id).map(prod -> {
            prod.setName(p.getName());
            prod.setDescription(p.getDescription());
            prod.setPrice(p.getPrice());
            prod.setStock(p.getStock());
            prod.setImageUrl(p.getImageUrl());
            prod.setCategory(p.getCategory());
            return repo.save(prod);
        }).orElse(null);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Product> searchByName(String name) {
        return repo.findByNameContainingIgnoreCase(name);
    }

    public List<Product> getByCategory(String category) {
        return repo.findByCategoryName(category);
    }
}