package com.albeisoft.hotelbooking.models;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

import javax.validation.constraints.*;
import lombok.*;
import org.hibernate.validator.constraints.Range;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity // default name is the name of class "Category", is like you set: @Entity(name = "Category")
@Table(name = "categories")
//@Data
public class Category implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // use like in Oracle DB with sequences and in MySQL will use a separate table hibernate_sequence with colum
    // next_val (for next increment value)
    // @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    // if wish to use in DB with other field name use:
    // @Column(name = "Id", updatable = false, nullable = false)
    private Long id;

    @NotBlank(message = "Name is required.")
    @Size(min = 2, max = 100, message = "Name '${validatedValue}' length must be between {min} and {max} characters.")
    // can set in DB other name of field by using @Column...
    // @Column(name = "Name")
    private String name;

    @NotBlank(message = "Price is required.")
    @Positive
    //@Min(value = 10, message = "Price '${validatedValue}' must be grater or equal with {value}.")
    @Range(min=10, max=Integer.MAX_VALUE, message = "Price '${validatedValue}' must be grater or equal with {min}.")
    private String price;

    private Timestamp created_at;

    private Timestamp updated_at;

    /*
    general standard JSR annotations:
    @NotNull validates that the annotated property value is not null.
    @AssertTrue validates that the annotated property value is true.
    @Size validates that the annotated property value has a size between the attributes min and max; can be applied to String, Collection, Map, and array properties.
    @Min validates that the annotated property has a value no smaller than the value attribute.
    @Max validates that the annotated property has a value no larger than the value attribute.
    @Email validates that the annotated property is a valid email address.

    other useful annotations that can be found in the JSR:
    @NotEmpty validates that the property is not null or empty; can be applied to String, Collection,
    Map or Array values.
    @NotBlank can be applied only to text values and validates that the property is not null or whitespace.
    @NotNull can be applied to validate if the property is not null
    @Positive and @PositiveOrZero apply to numeric values and validate that they are strictly positive, or positive
    including 0.
    @Negative and @NegativeOrZero apply to numeric values and validate that they are strictly negative, or negative
    including 0.
    @Past and @PastOrPresent validate that a date value is in the past or the past including the present; can be
    applied to date types including those added in Java 8.
    @Future and @FutureOrPresent validate that a date value is in the future, or in the future including the present.
    */
}
