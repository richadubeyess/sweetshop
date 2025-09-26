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

class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    private Sweet sweet;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sweet = new Sweet();
        sweet.setId(1L);
        sweet.setName("Barfi");
        sweet.setCategory("Traditional");
        sweet.setPrice(50.0);
        sweet.setQuantity(10);
    }

    @Test
    void testPurchaseSuccess() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        sweetService.purchase(1L, 2);

        assertEquals(8, sweet.getQuantity()); // Expect stock reduced
        verify(sweetRepository, times(1)).save(sweet);
    }

    @Test
    void testPurchaseFailsWhenInsufficientStock() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        Exception ex = assertThrows(IllegalStateException.class,
                () -> sweetService.purchase(1L, 20));

        assertEquals("Insufficient stock", ex.getMessage());
    }

    @Test
    void testPurchaseFailsWhenSweetNotFound() {
        when(sweetRepository.findById(99L)).thenReturn(Optional.empty());

        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> sweetService.purchase(99L, 1));

        assertEquals("Sweet not found", ex.getMessage());
    }
}
