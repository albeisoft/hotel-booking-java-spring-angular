package com.albeisoft.hotelbooking.repositories;

import com.albeisoft.hotelbooking.models.Reservation;
import com.albeisoft.hotelbooking.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    void deleteReservationById(Long id);
    Reservation findReservationById(Long id);

    List<Reservation> findAll();

    @Query(value = "select re.id, cl.name as client_name, ro.name as room_name, re.date, re.no_days, re.no_persons from reservations re " +
            "inner join clients cl on re.client_id = cl.id " +
            "inner join rooms ro on re.room_id = ro.id", nativeQuery = true)
    List<Object> findAllCustom(); // for @Query with nativeQuery = true
}
