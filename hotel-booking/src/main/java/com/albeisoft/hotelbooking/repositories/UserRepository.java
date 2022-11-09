package com.albeisoft.hotelbooking.repositories;

import com.albeisoft.hotelbooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserName(String userName);
}
