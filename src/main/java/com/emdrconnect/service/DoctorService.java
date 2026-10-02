package com.emdrconnect.service;

import com.emdrconnect.entity.Doctor;
import java.util.List;
import java.util.Optional;

public interface DoctorService {

    Doctor addDoctor(Doctor doctor, String initialPassword);

    Doctor addDoctor(Doctor doctor);

    List<Doctor> getAllDoctors();

    List<Doctor> getActiveDoctors();

    Doctor getDoctorById(Long id);

    Doctor getDoctorByEmail(String email);

    Doctor getDoctorByUserId(Long userId);

    Doctor updateDoctor(Long id, Doctor doctor);

    Doctor toggleActive(Long id, boolean active);

    Doctor toggleAvailability(Long id, boolean available);

    Doctor updateImagePath(Long id, String imagePath);

    void deleteDoctor(Long id);
}