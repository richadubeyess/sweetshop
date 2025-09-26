package com.incubyte.sweetshop.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.incubyte.sweetshop.model.Sweet;
import java.util.List;

public interface SweetRepository extends JpaRepository<Sweet, Long> {
    List<Sweet> findByNameContainingIgnoreCase(String name);
    List<Sweet> findByCategory(String category);
    List<Sweet> findByPriceBetween(double min, double max);
}
