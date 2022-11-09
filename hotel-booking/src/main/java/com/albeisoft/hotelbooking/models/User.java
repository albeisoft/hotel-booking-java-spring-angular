package com.albeisoft.hotelbooking.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ManyToAny;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

import static javax.persistence.FetchType.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
// You can mame class User as AppUser to make difference of User from Spring Security
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(name = "user_name")
    private String userName;
    private String password;
    // EAGER fetch type is to load every userRoles when we load the user
    @ManyToMany(fetch = EAGER)
    private Collection<UserRole> userRoles = new ArrayList<>();

    /*
    @ManyToMany(fetch = EAGER)
    @JoinTable(
            name = "users_user_roles",
            joinColumns = @JoinColumn(name = "user_roles_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    */
}
