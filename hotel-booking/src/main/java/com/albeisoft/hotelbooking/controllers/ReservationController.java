package com.albeisoft.hotelbooking.controllers;

import com.albeisoft.hotelbooking.models.Client;
import com.albeisoft.hotelbooking.models.Reservation;
import com.albeisoft.hotelbooking.services.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Reservation>> getAllReservations(){
        List<Reservation> reservations = reservationService.findAllReservations();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }
    /* */
    @GetMapping("/allcustom")
    public ResponseEntity<List<Object>> getAllReservationsCustom(){
        List<Object> reservationsCustom = reservationService.findAllCustom();

        return new ResponseEntity<>(reservationsCustom, HttpStatus.OK);
    }


    // set @Valid to show at api response invalid data fields and error messages from model annotations
    @GetMapping("/find/{id}")
    public ResponseEntity<Reservation> getReservationById(@Valid @PathVariable("id") Long id){
        Reservation reservation;
        if (reservationService.findReservationById(id) != null) {
            // if found record by id in DB then will show it
            reservation = reservationService.findReservationById(id);
            return new ResponseEntity<>(reservation, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<Reservation> addReservation(@Valid @RequestBody Reservation reservation) {
        Reservation newReservation = reservationService.addReservation(reservation);
        return new ResponseEntity<>(newReservation, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Reservation> updateReservation(@Valid @RequestBody Reservation reservation) {
        Reservation updateReservation;
        if (reservationService.findReservationById(reservation.getId()) != null) {
            // if found record by id in DB then will show it
            updateReservation = reservationService.updateReservation(reservation);
            return new ResponseEntity<>(updateReservation, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    /* */
    // method will return no entity so at ResponseEntity will put <?>
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteReservation(@Valid @PathVariable("id") Long id) {
        reservationService.deleteReservation(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // method will return no entity so at ResponseEntity will put <?>
    @PostMapping("/deleterecords")
    @Transactional
    public ResponseEntity<Reservation[]> deleteRecords(@RequestBody List<Reservation> selectedRecordsToDelete) {
        // check if selectedRecordsToDelete is null
        if (selectedRecordsToDelete == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        for (var item : selectedRecordsToDelete) {
            reservationService.deleteReservation(item.getId());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}