package com.emdrconnect.repository;

import com.emdrconnect.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    List<Consultation> findByEmail(String email);

    List<Consultation> findByDoctorEmail(String doctorEmail);

    List<Consultation> findByDoctorName(String doctorName);

    Optional<Consultation> findByAppointmentId(Long appointmentId);
}