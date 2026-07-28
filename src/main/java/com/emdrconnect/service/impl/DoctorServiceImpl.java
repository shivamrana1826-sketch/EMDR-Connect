package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Doctor;
import com.emdrconnect.repository.DoctorRepository;
import com.emdrconnect.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctor) {

        Doctor existingDoctor = doctorRepository.findById(id).orElse(null);

        if (existingDoctor != null) {
            existingDoctor.setName(doctor.getName());
            existingDoctor.setSpecialization(doctor.getSpecialization());
            existingDoctor.setExperience(doctor.getExperience());
            existingDoctor.setQualification(doctor.getQualification());
            existingDoctor.setEmail(doctor.getEmail());
            existingDoctor.setPhone(doctor.getPhone());
            existingDoctor.setAvailable(doctor.isAvailable());

            return doctorRepository.save(existingDoctor);
        }

        return null;
    }

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}