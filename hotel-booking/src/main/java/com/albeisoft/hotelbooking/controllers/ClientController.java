package com.albeisoft.hotelbooking.controllers;

import com.albeisoft.hotelbooking.models.Category;
import com.albeisoft.hotelbooking.models.Client;
import com.albeisoft.hotelbooking.services.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/client")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Client>> getAllClients(){
        List<Client> clients = clientService.findAllClients();
        return new ResponseEntity<>(clients, HttpStatus.OK);
    }
    // set @Valid to show at api response invalid data fields and error messages from model annotations
    @GetMapping("/find/{id}")
    public ResponseEntity<Client> getClientById(@Valid @PathVariable("id") Long id){
        Client client;
        if (clientService.findClientById(id) != null) {
            // if found record by id in DB then will show it
            client = clientService.findClientById(id);
            return new ResponseEntity<>(client, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<Client> addClient(@Valid @RequestBody Client client) {
        Client newClient = clientService.addClient(client);
        return new ResponseEntity<>(newClient, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Client> updateClient(@Valid @RequestBody Client client) {
        Client updateClient;
        if (clientService.findClientById(client.getId()) != null) {
            // if found record by id in DB then will show it
            updateClient = clientService.updateClient(client);
            return new ResponseEntity<>(updateClient, HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    /* */
    // method will return no entity so at ResponseEntity will put <?>
    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<?> deleteClient(@Valid @PathVariable("id") Long id) {
        clientService.deleteClient(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // method will return no entity so at ResponseEntity will put <?>
    @PostMapping("/deleterecords")
    @Transactional
    public ResponseEntity<Client[]> deleteRecords(@RequestBody List<Client> selectedRecordsToDelete) {
        // check if selectedRecordsToDelete is null
        if (selectedRecordsToDelete == null)
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        for (var item : selectedRecordsToDelete) {
            clientService.deleteClient(item.getId());
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}