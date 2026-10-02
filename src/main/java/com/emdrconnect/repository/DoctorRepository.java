package com.emdrconnect.repository;

import com.emdrconnect.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByUserId(Long userId);

    List<Doctor> findByActiveTrue();

    boolean existsByEmail(String email);
}