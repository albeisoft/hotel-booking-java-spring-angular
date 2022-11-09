package com.albeisoft.hotelbooking.repositories;
import com.albeisoft.hotelbooking.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    UserRole findByName(String name);
}
