package com.albeisoft.hotelbooking.repositories;

import com.albeisoft.hotelbooking.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    void deleteRoomById(Long id);
    Room findRoomById(Long id);

    List<Room> findAll();

    /* // nativeQuery default is false,
    // if nativeQuery=false use table name as the Entity name if set @Entity(name = "Room") else default name is name of model class (Room)
    * /
    // HQL - Hibernate Query Language
    @Query(value = "select r.id, r.name, r.floor, r.is_view, r.no_places, r.category_id from Room r", nativeQuery = false)
    List<Room> findAll(); // if @Query with nativeQuery = false
    /* */

    /* */
    // JPQL - Java Persistence Query Language
    @Query(value = "select r.id, r.name, r.floor, r.is_view, r.no_places, c.name as category_name from rooms r " +
            "inner join categories c on r.category_id = c.id ", nativeQuery = true)

    List<Object> findAllCustom(); // for @Query with nativeQuery = true
    /* */
}