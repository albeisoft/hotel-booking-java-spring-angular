package com.albeisoft.hotelbooking.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import com.albeisoft.hotelbooking.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    void deleteCategoryById(Long id);
    Category findCategoryById(Long id);
}
