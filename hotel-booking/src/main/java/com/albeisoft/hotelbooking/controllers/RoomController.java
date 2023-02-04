package com.albeisoft.hotelbooking.controllers;

import com.albeisoft.hotelbooking.models.Reservation;
import com.albeisoft.hotelbooking.models.Room;
import com.albeisoft.hotelbooking.services.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/room")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    /* */
    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms(){
        List<Room> rooms = roomService.findAll();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }
    /* */
    @GetMapping("/allcustom")
    public ResponseEntity<List<Object>> getAllRoomsCustom(){
      List<Object> roomsCustom = roomService.findAllCustom();
        /* * /
        for (Object[] obj : roomsCustom) {
            System.out.println(
                    "id: " + obj[0].toString() + " | " +
                    "name : " + obj[1].toString() + " | " +
                    "floor : " + obj[2].toString() + " | " +
                    "is_view : " + obj[3].toString() + " | " +
                    "no_places : " + obj[4].toString() + " | " +
                    "category_name : " + obj[5].toString()
            );
        }
        /* */
      return new ResponseEntity<>(roomsCustom, HttpStatus.OK);
    }

    // set @Valid to show at api response invalid data fields and error messages from model annotations
    @GetMapping("/find/{id}")
    public ResponseEntity<Room> getRoomById(@Valid @PathVariable("id") Long id){
        Room room;
        if (roomService.findRoomById(id) != null) {
            // if found record by id in DB then will show it
            room = roomService.findRoomById(id);
            return new ResponseEntity<>(room, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<Room> addRoom(@Valid @RequestBody Room room) {
        Room newRoom = roomService.addRoom(room);
        return new ResponseEntity<>(newRoom, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Room> updateRoom(@Valid @RequestBody Room room) {
        Room updateRoom;
        if (roomService.findRoomById(room.getId()) != null) {
            // if found record by id in DB then will show it
            updateRoom = roomService.updateRoom(room);
            return new ResponseEntity<>(updateRoom, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    /* */
    // method will return no entity so at ResponseEntity will put <?>
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteRoom(@Valid @PathVariable("id") Long id) {
        roomService.deleteRoom(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // method will return no entity so at ResponseEntity will put <?>
    @PostMapping("/deleterecords")
    @Transactional
    public ResponseEntity<Room[]> deleteRecords(@RequestBody List<Room> selectedRecordsToDelete) {
        // check if selectedRecordsToDelete is null
        if (selectedRecordsToDelete == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        for (var item : selectedRecordsToDelete) {
            roomService.deleteRoom(item.getId());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}