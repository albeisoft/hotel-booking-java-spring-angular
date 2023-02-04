package com.albeisoft.hotelbooking.models;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "Room")
//@Entity // default entity name is class name, for Hibernate HQL
@Table(name = "rooms")
public class Room implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @NotBlank(message = "Name is required.")
    @Size(min = 2, max = 100, message = "Name '${validatedValue}' length must be between {min} and {max} characters.")
    private String name;

    private Boolean is_view;

    @NotNull(message = "Floor is required.")
    @Positive
    //@Min(value = 1, message = "Floor '${validatedValue}' must be grater or equal with {value}.")
    @Range(min=1, max=Integer.MAX_VALUE, message = "Floor '${validatedValue}' must be grater or equal with {min}.")
    private Integer floor;

    //@NotBlank(message = "No Places is required.")
    @NotNull(message = "No Places is required.")
    @Positive
    //@Min(value = 1, message = "No Places '${validatedValue}' must be grater or equal with {value}.")
    @Range(min=1, max=Integer.MAX_VALUE, message = "No Places '${validatedValue}' must be grater or equal with {min}.")
    private Integer no_places;

    @NotNull(message = "Category is required.")
    @Positive
    //@Min(value = 1, message = "Category '${validatedValue}' must be grater or equal with {value}.")
    @Range(min=1, max=Integer.MAX_VALUE, message = "Category '${validatedValue}' must be grater or equal with {min}.")
    private Long category_id;

    private String note;

    private Timestamp created_at;

    private Timestamp updated_at;
/*
    //@ManyToOne
    @ManyToOne(fetch = FetchType.EAGER)

*/

}