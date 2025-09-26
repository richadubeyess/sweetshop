package com.incubyte.sweetshop.service;

import com.incubyte.sweetshop.model.Sweet;
import com.incubyte.sweetshop.repository.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InventoryServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testPurchaseFailsWhenStockIsInsufficient() {
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setName("Ladoo");
        sweet.setQuantity(2);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> sweetService.purchase(1L, 5));

        assertEquals("Insufficient stock", ex.getMessage());
        verify(sweetRepository, never()).save(any(Sweet.class));
    }

    @Test
    void testPurchaseReducesStockWhenSufficient() {
        Sweet sweet = new Sweet();
        sweet.setId(1L);
        sweet.setName("Barfi");
        sweet.setQuantity(10);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        sweetService.purchase(1L, 3);

        assertEquals(7, sweet.getQuantity());
        verify(sweetRepository).save(sweet);
    }

    @Test
    void testRestockIncreasesStock() {
        Sweet sweet = new Sweet();
        sweet.setId(2L);
        sweet.setName("Jalebi");
        sweet.setQuantity(5);

        when(sweetRepository.findById(2L)).thenReturn(Optional.of(sweet));

        sweetService.restock(2L, 10);

        assertEquals(15, sweet.getQuantity());
        verify(sweetRepository).save(sweet);
    }
}

