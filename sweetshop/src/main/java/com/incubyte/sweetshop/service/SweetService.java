package com.incubyte.sweetshop.service;

import com.incubyte.sweetshop.model.Sweet;
import com.incubyte.sweetshop.repository.SweetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class SweetService {

    private static final Logger log = LoggerFactory.getLogger(SweetService.class);

    private static final String SWEET_NOT_FOUND = "Sweet not found";
    private static final String INSUFFICIENT_STOCK = "Insufficient stock";
    private static final String QUANTITY_MUST_BE_POSITIVE = "Quantity must be > 0";

    private final SweetRepository repository;

    public SweetService(SweetRepository repository) {
        this.repository = repository;
    }


    @Transactional
    public void purchase(Long id, int qty) {
        Sweet sweet = findByIdOrThrow(id);
        validatePositiveQuantity(qty);
        validateStock(sweet, qty);

        sweet.setQuantity(sweet.getQuantity() - qty);
        repository.save(sweet);

        log.info("Purchased {} units of sweet id={} (remaining={})", qty, id, sweet.getQuantity());
    }


    @Transactional
    public void restock(Long id, int qty) {
        Sweet sweet = findByIdOrThrow(id);
        validatePositiveQuantity(qty);

        sweet.setQuantity(sweet.getQuantity() + qty);
        repository.save(sweet);

        log.info("Restocked {} units of sweet id={} (newQuantity={})", qty, id, sweet.getQuantity());
    }



    private Sweet findByIdOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(SWEET_NOT_FOUND));
    }

    private void validateStock(Sweet sweet, int qty) {
        if (sweet.getQuantity() < qty) {
            throw new IllegalStateException(INSUFFICIENT_STOCK);
        }
    }

    private void validatePositiveQuantity(int qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException(QUANTITY_MUST_BE_POSITIVE);
        }
    }
}
