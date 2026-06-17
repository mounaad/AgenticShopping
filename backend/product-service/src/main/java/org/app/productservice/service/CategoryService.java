package org.app.productservice.service;

import org.app.productservice.entity.Category;
import org.app.productservice.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    public Category getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Category create(Category category) {
        return repository.save(category);
    }

    public Category update(Long id, Category category) {

        Category existing = repository.findById(id).orElse(null);

        if(existing == null) {
            return null;
        }

        existing.setName(category.getName());

        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}