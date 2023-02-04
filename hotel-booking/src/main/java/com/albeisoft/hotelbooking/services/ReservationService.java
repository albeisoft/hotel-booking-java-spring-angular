package com.albeisoft.hotelbooking.services;
import com.albeisoft.hotelbooking.models.Reservation;
import com.albeisoft.hotelbooking.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    // set repository to constructor
    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    // add a reservation
    public Reservation addReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }
    // get all reservations
    public List<Reservation> findAllReservations() {
        return reservationRepository.findAll();
    }

    public List <Object> findAllCustom() {
        return reservationRepository.findAllCustom();
    }

    public Reservation updateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Reservation findReservationById(Long id) {
       return reservationRepository.findReservationById(id);
    }

    public void deleteReservation(Long id) {
        boolean exists = reservationRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Reservation with id " + id + " does not exists.");
        }
       // reservationRepository.deleteReservationById(id);
        reservationRepository.deleteById(id);
    }
}
