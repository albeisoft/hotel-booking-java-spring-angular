package com.albeisoft.hotelbooking.services;
import com.albeisoft.hotelbooking.models.Client;
import com.albeisoft.hotelbooking.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    // set repository to constructor
    @Autowired
    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }
    // add a client
    public Client addClient(Client client) {
        return clientRepository.save(client);
    }
    // get all clients
    public List<Client> findAllClients() {
        return clientRepository.findAll();
    }

    public Client updateClient(Client client) {
        return clientRepository.save(client);
    }

    public Client findClientById(Long id) {
       return clientRepository.findClientById(id);
    }

    public void deleteClient(Long id) {
        boolean exists = clientRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Client with id " + id + " does not exists.");
        }
       // clientRepository.deleteClientById(id);
        clientRepository.deleteById(id);
    }
}
