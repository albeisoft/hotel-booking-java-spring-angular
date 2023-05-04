Hotel Booking - Java with Spring and SPA [Single Page Application] with Angular (hotel-booking-java-spring-angular) is a version of example of web application for Hotel Reservation (Hotel Booking) created on:
- back end (server side) with Java, Spring framework (Java framework), Spring Boot and:
	* Spring Web [build web, including RESTful (API, web services), applications using Spring MVC, uses Apache Tomcat as the default embedded container] 
	* Spring Data JPA [persist data in SQL stores with Java Persistence API using Spring Data and Hibernate]
	* MySQL Driver [MySQL JDBC and R2DBC driver]
	* Spring Security [highly customizable authentication and access-control framework for Spring applications]
	* used JWT [JSON Web Token] and refresh tokens (with Java JWT from auth0 - Java implementation of JSON Web Token) for security autentication and authorization (with roles, etc.)
	* Lombok [Java annotation library which helps to reduce boilerplate code]
	* Validation [Bean Validation with Hibernate validator]
	* Spring Boot DevTools [provides fast application restarts, LiveReload, and configurations for enhanced development experience], etc.)

Java 19.x, Spring framework 5.x, Spring Boot 2.7.5, Maven, Packaging as Jar.

- front end (client side, browser side) with JavaScript and Angular (version 15.x) that is an JavaScript Framework, Angular framework is embedded with original MVC [Model View Controller] but it's more of an MVVM [Model View ViewModel] software architectural setup; also used Angular Material UI: Material Data Table (better data table with filter, pagination, sort, etc.), Material Date Picker (Date picker need in some forms), moment.js (for date formating and date processing with Angular);
- database: MariaDB (a better version of MySQL version, MariaDB is 100% compatible with prior versions of MySQL). 

Installation

Clone the repository:

git clone https://github.com/albeisoft/hotel-booking-java-spring-angular.git

Then cd into the folder with command:

cd hotel-booking-java-spring-angular/HotelBooking

Open folder HotelBooking with your IDE: IntelliJ IDEA, Eclipse, NetBeans, Visual Studio Code, etc. 

Then create a database named "hotel_java" and change database autentication data in application.properties file from folder hotel-booking-java-spring-angular\hotel-booking\src\main\resources.

Run (compile) back end

After run HotelBooking (back end application) in your IDE go to http://localhost:8080.

Run (compile) front end scripts

First install node packages with next command in a terminal from hotel-booking-client-app folder:

npm install

To run Angular application go into folder hotel-booking-client-app and run this command in a Visual Studio (or other IDE: IntelliJ IDEA, etc.) terminal (any change you make to the HTML, CSS, JavaScript, Angular code will be reflected immediately in the page you see in your browser):

ng serve

Then go to http://localhost:5001/ from your browser and see the web application.
