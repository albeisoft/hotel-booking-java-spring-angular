package com.albeisoft.hotelbooking.models;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clients")
public class Client implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @NotBlank(message = "Name is required.")
    @Size(min = 5, max = 100, message = "Name '${validatedValue}' length must be between {min} and {max} characters.")
    // can set in DB other name of field by using @Column...
    // @Column(name = "Name")
    private String name;

    @NotBlank(message = "Identification is required.")
    @Size(min = 10, max = 15, message = "Identification '${validatedValue}' length must be between {min} and {max} characters.")
    //Identification is a number that begin with 1
    //@Pattern(regexp = "[\\s]*[1-9]*[0-9]+",message="Identification {0} must be only numbers.")
    @Pattern(regexp = "[1-9][0-9]*",message="Identification must be only numbers and start from 1.")
    private String identification;

    @NotBlank(message = "Address is required.")
    @Size(min = 10, max = 250, message = "Address '${validatedValue}' length must be between {min} and {max} characters.")
    private String address;

    @NotBlank(message = "Telephone is required.")
    // Telephone starts with 0, only numbers
    //@Pattern(regexp = "[0-9]+",message="Telephone must be only numbers.")
    @Pattern(regexp = "[\\s]*[0-9]*[1-9]+",message="Telephone must be only numbers.")
    private String telephone;

    @NotBlank(message = "Email is required.")
    //@Email(message="Email is not valid.")
    @Pattern(regexp = "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$",message="Email is not valid.")
    private String email;

    private Timestamp created_at;

    private Timestamp updated_at;
}
