package com.albeisoft.hotelbooking.services;
import com.albeisoft.hotelbooking.models.Category;
import com.albeisoft.hotelbooking.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    // set repository to constructor
    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    // add a category
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }
    // get all categories
    public List<Category> findAllCategories() {
        return categoryRepository.findAll();
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category findCategoryById(Long id) {
       return categoryRepository.findCategoryById(id);
    }

    public void deleteCategory(Long id) {
        boolean exists = categoryRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Category with id " + id + " does not exists.");
        }
       // categoryRepository.deleteCategoryById(id);
        categoryRepository.deleteById(id);
    }
}
