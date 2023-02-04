package com.albeisoft.hotelbooking.controllers;
import com.albeisoft.hotelbooking.models.Category;
import com.albeisoft.hotelbooking.services.CategoryService;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/category")
// deactivate, disable Spring Boot security
//@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    // @GetMapping(path = "/all", produces = { "application/json" })
    // @Operation(summary = "Get all categories")
    public ResponseEntity<List<Category>> getAllCategories(){
        List<Category> categories = categoryService.findAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    // set @Valid to show at api response invalid data fields and error messages from model annotations
    @GetMapping("/find/{id}")
    public ResponseEntity<Category> getCategoryById(@Valid @PathVariable("id") Long id){
        Category category;
        if (categoryService.findCategoryById(id) != null) {
            // if found record by id in DB then will show it
            category = categoryService.findCategoryById(id);
            return new ResponseEntity<>(category, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<Category> addCategory(@Valid @RequestBody Category category) {
        Category newCategory = categoryService.addCategory(category);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category) {
        Category updateCategory;
        if (categoryService.findCategoryById(category.getId()) != null) {
            // if found record by id in DB then will show it
            updateCategory = categoryService.updateCategory(category);
            return new ResponseEntity<>(updateCategory, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }


    // method will return no entity so at ResponseEntity will put <?>
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteCategory(@Valid @PathVariable("id") Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // method will return no entity so at ResponseEntity will put <?>
    @PostMapping("/deleterecords")
    @Transactional
    public ResponseEntity<Category[]> deleteRecords(@RequestBody List<Category> selectedRecordsToDelete) {
        // check if selectedRecordsToDelete is null
        if (selectedRecordsToDelete == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        //for (Category item : selectedRecordsToDelete) {
        for (var item : selectedRecordsToDelete) {
            categoryService.deleteCategory(item.getId());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    /* * /
    // without ResponseEntity and no status code custom set at return
    @DeleteMapping("/delete/{id}")
    @Transactional
    public void delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
    /*/

    /* * /
    // using @RequestMapping will code more than using @DeleteMapping
    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    @Transactional
    public ResponseEntity<?> deleteCategory(@PathVariable("id") Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    /*/
}