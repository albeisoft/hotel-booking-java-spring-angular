package com.albeisoft.hotelbooking.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException (String message) {
        super(message);
    }
}
