package com.albeisoft.hotelbooking.services;

import com.albeisoft.hotelbooking.models.User;
import com.albeisoft.hotelbooking.models.UserRole;

import java.util.List;

public interface UserService {
    User saveUser (User user);
    UserRole saveUserRole (UserRole userRole);
    void addUserRoleToUser(String userName, String userRoleName);
    User getUser(String UserName);
    List<User> getUsers();
}
