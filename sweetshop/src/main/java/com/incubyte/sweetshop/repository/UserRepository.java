package com.incubyte.sweetshop.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.incubyte.sweetshop.model.AppUser;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByUsername(String username);
    boolean existsByUsername(String username);
}
