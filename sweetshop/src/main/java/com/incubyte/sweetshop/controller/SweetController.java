package com.incubyte.sweetshop.controller;

import com.incubyte.sweetshop.model.Sweet;
import com.incubyte.sweetshop.repository.SweetRepository;
import com.incubyte.sweetshop.service.SweetService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sweets")
public class SweetController {

    private final SweetRepository sweetRepository;
    private final SweetService sweetService;

    public SweetController(SweetRepository sweetRepository, SweetService sweetService) {
        this.sweetRepository = sweetRepository;
        this.sweetService = sweetService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Sweet addSweet(@RequestBody Sweet sweet) {
        return sweetRepository.save(sweet);
    }

    @GetMapping
    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    @GetMapping("/search")
    public List<Sweet> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        if (name != null) return sweetRepository.findByNameContainingIgnoreCase(name);
        if (category != null) return sweetRepository.findByCategory(category);
        if (minPrice != null && maxPrice != null) return sweetRepository.findByPriceBetween(minPrice, maxPrice);
        return sweetRepository.findAll();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Sweet updateSweet(@PathVariable Long id, @RequestBody Sweet sweet) {
        Sweet existing = sweetRepository.findById(id).orElseThrow();
        existing.setName(sweet.getName());
        existing.setCategory(sweet.getCategory());
        existing.setPrice(sweet.getPrice());
        existing.setQuantity(sweet.getQuantity());
        return sweetRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteSweet(@PathVariable Long id) {
        sweetRepository.deleteById(id);
    }

    @PostMapping("/{id}/purchase")
    public void purchase(@PathVariable Long id, @RequestParam(defaultValue = "1") int qty) {
        sweetService.purchase(id, qty);
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public void restock(@PathVariable Long id, @RequestParam int qty) {
        sweetService.restock(id, qty);
    }
}
