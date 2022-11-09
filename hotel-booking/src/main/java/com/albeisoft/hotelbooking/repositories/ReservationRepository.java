package com.albeisoft.hotelbooking.repositories;

import com.albeisoft.hotelbooking.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    void deleteReservationById(Long id);
    Reservation findReservationById(Long id);
}
