package com.incubyte.sweetshop.service;

import com.incubyte.sweetshop.model.Sweet;
import com.incubyte.sweetshop.repository.SweetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SweetService {

    private final SweetRepository repository;

    public SweetService(SweetRepository repository) {
        this.repository = repository;
    }


    @Transactional
    public void purchase(Long id, int qty) {
        Sweet s = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sweet not found"));

        if (s.getQuantity() < qty) {
            throw new IllegalStateException("Insufficient stock");
        }

        s.setQuantity(s.getQuantity() - qty);
        repository.save(s);
    }

    @Transactional
    public void restock(Long id, int qty) {
        Sweet s = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sweet not found"));

        s.setQuantity(s.getQuantity() + qty);
        repository.save(s);
    }
}
