package com.emdrconnect.repository;

import com.emdrconnect.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByEmail(String email);

    List<Appointment> findByEmailOrderByAppointmentDateDesc(String email);

    List<Appointment> findByDoctorEmail(String doctorEmail);

    List<Appointment> findByDoctorEmailOrderByAppointmentDateDesc(String doctorEmail);

    List<Appointment> findByDoctorName(String doctorName);

    List<Appointment> findByEmailAndStatus(String email, String status);

    List<Appointment> findByDoctorEmailAndStatus(String doctorEmail, String status);
}