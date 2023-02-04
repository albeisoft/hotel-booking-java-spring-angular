package com.albeisoft.hotelbooking.services;

import com.albeisoft.hotelbooking.models.User;
import com.albeisoft.hotelbooking.models.UserRole;
import com.albeisoft.hotelbooking.repositories.UserRepository;
import com.albeisoft.hotelbooking.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional
//use logging
@Slf4j
public class UserServiceImplementation implements UserService, UserDetailsService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(userName);
        if (user == null) {
            log.error("User not found.");
            throw new UsernameNotFoundException("User not found.");
        }else {
            log.error("User found: {}.", userName);
        }
        // set roles to user from Spring Security
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getUserRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        //log.error("Roles to user, authorities as: {}.", authorities);
        return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getPassword(), authorities);
    }
    @Override
    public User saveUser(User user) {
        log.info("Saving new user {} to database.", user.getName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public UserRole saveUserRole(UserRole userRole) {
        log.info("Saving new user role {} to database.", userRole.getName());
        return userRoleRepository.save(userRole);
    }

    @Override
    public void addUserRoleToUser(String userName, String roleName) {
        log.info("Adding role {} to user {}.", roleName, userName);
        User user = userRepository.findByUserName(userName);
        UserRole userRole = userRoleRepository.findByName(roleName);
        user.getUserRoles().add(userRole);
    }

    @Override
    public User getUser(String userName) {
        log.info("Fetching user {}.", userName);
        return userRepository.findByUserName(userName);
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users.");
        return userRepository.findAll();
    }
}
