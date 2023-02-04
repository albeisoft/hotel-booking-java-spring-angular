package com.albeisoft.hotelbooking.services;
import com.albeisoft.hotelbooking.models.Room;
import com.albeisoft.hotelbooking.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    // set repository to constructor
    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    // add a room
    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }
    // get all rooms
    public List<Room> findAll() {
       return roomRepository.findAll();
    }
    public List <Object> findAllCustom() {
        return roomRepository.findAllCustom();
    }

    public Room updateRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room findRoomById(Long id) {
       return roomRepository.findRoomById(id);
    }

    public void deleteRoom(Long id) {
        boolean exists = roomRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Room with id " + id + " does not exists.");
        }
       // roomRepository.deleteRoomById(id);
        roomRepository.deleteById(id);
    }
}
