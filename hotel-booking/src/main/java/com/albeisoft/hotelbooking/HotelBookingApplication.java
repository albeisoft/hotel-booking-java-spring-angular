package com.albeisoft.hotelbooking;

import com.albeisoft.hotelbooking.models.User;
import com.albeisoft.hotelbooking.models.UserRole;
import com.albeisoft.hotelbooking.services.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

@SpringBootApplication
public class HotelBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(HotelBookingApplication.class, args);
	}
	@Bean
	PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}

	// save data in DB for users, roles, roles to users
	@Bean
	CommandLineRunner run (UserService userService) {
		return args -> {
			userService.saveUserRole(new UserRole(null,"ROLE_USER"));
			userService.saveUserRole(new UserRole(null,"ROLE_MANAGER"));
			userService.saveUserRole(new UserRole(null,"ROLE_ADMIN"));
			userService.saveUserRole(new UserRole(null,"ROLE_SUPER_ADMIN"));

			userService.saveUser(new User(null,"Admin Admin","admin","123456", new ArrayList<>()));
			userService.saveUser(new User(null,"John Daniel","john","123456", new ArrayList<>()));

			userService.addUserRoleToUser("admin","ROLE_USER");
			userService.addUserRoleToUser("admin","ROLE_MANAGER");
			userService.addUserRoleToUser("admin","ROLE_ADMIN");
			userService.addUserRoleToUser("john","ROLE_MANAGER");
			userService.addUserRoleToUser("john","ROLE_SUPER_ADMIN");
		};
	}

}
