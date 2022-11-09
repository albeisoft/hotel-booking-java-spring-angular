package com.albeisoft.hotelbooking.repositories;

import com.albeisoft.hotelbooking.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
    void deleteClientById(Long id);
    Client findClientById(Long id);
}
