package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Doctor;
import com.emdrconnect.entity.User;
import com.emdrconnect.repository.DoctorRepository;
import com.emdrconnect.repository.UserRepository;
import com.emdrconnect.service.DoctorService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void initDefaultDoctors() {
        try {
            seedDoctorIfMissing(
                    "Dr. Raj Patil",
                    "raj@emdrconnect.com",
                    "9876543201",
                    "Senior EMDR Therapist",
                    "MBBS, MD (Psychiatry)",
                    10,
                    "Senior EMDR therapist specializing in trauma, PTSD and anxiety recovery with over a decade of clinical excellence.",
                    "images/doctor1.jpg",
                    1500.0
            );

            seedDoctorIfMissing(
                    "Dr. Rekha Gupta",
                    "rekha@emdrconnect.com",
                    "9876543202",
                    "Clinical Psychologist",
                    "Ph.D. in Clinical Psychology",
                    8,
                    "Specialized in eye movement desensitization and reprocessing therapy with compassionate individual care.",
                    "images/doctor2.jpg",
                    1400.0
            );

            seedDoctorIfMissing(
                    "Dr. Arjun Mehta",
                    "arjun@emdrconnect.com",
                    "9876543203",
                    "Trauma Specialist",
                    "MBBS, DPM",
                    7,
                    "Dedicated to guiding patients through trauma healing, acute stress and emotional wellness.",
                    "images/doctor3.jpg",
                    1200.0
            );

            seedDoctorIfMissing(
                    "Dr. Shivam Rana",
                    "shivam@emdrconnect.com",
                    "9876543204",
                    "EMDR Consultant",
                    "MS, Clinical Psychology",
                    6,
                    "Experienced consultant helping clients manage acute stress, panic disorders and depressive symptoms.",
                    "images/doctor4.jpg",
                    1100.0
            );
        } catch (Exception e) {
            System.err.println("Notice: Doctor seeding skipped or completed: " + e.getMessage());
        }
    }

    private void seedDoctorIfMissing(String name, String email, String phone, String specialization,
                                     String qualification, int experience, String biography,
                                     String imagePath, Double fee) {
        String cleanEmail = email.toLowerCase().trim();
        Optional<Doctor> existingDoc = doctorRepository.findByEmail(cleanEmail);

        if (existingDoc.isEmpty()) {
            // Check if there is an unlinked doctor row (e.g. from previous manual migration)
            List<Doctor> allDocs = doctorRepository.findAll();
            for (Doctor d : allDocs) {
                if (d.getEmail() == null || d.getName() == null || d.getName().trim().isEmpty()) {
                    if (d.getUserId() != null) {
                        Optional<User> uOpt = userRepository.findById(d.getUserId());
                        if (uOpt.isPresent() && cleanEmail.equalsIgnoreCase(uOpt.get().getEmail())) {
                            d.setName(name);
                            d.setEmail(cleanEmail);
                            d.setPhone(phone);
                            d.setSpecialization(specialization);
                            d.setQualification(qualification);
                            d.setExperience(experience);
                            d.setBiography(biography);
                            d.setImagePath(imagePath);
                            d.setConsultationFee(fee);
                            d.setActive(true);
                            d.setAvailable(true);
                            doctorRepository.save(d);
                            return;
                        }
                    }
                }
            }

            Doctor newDoc = new Doctor();
            newDoc.setName(name);
            newDoc.setEmail(cleanEmail);
            newDoc.setPhone(phone);
            newDoc.setSpecialization(specialization);
            newDoc.setQualification(qualification);
            newDoc.setExperience(experience);
            newDoc.setBiography(biography);
            newDoc.setImagePath(imagePath);
            newDoc.setConsultationFee(fee);
            newDoc.setActive(true);
            newDoc.setAvailable(true);

            addDoctor(newDoc, "password123");
        } else {
            // Ensure fields like name, active, available are not null
            Doctor d = existingDoc.get();
            boolean changed = false;
            if (d.getName() == null || d.getName().trim().isEmpty()) {
                d.setName(name);
                changed = true;
            }
            if (d.getImagePath() == null || d.getImagePath().trim().isEmpty()) {
                d.setImagePath(imagePath);
                changed = true;
            }
            if (changed) {
                doctorRepository.save(d);
            }
        }
    }

    @Override
    @Transactional
    public Doctor addDoctor(Doctor doctor, String initialPassword) {
        String docEmail = doctor.getEmail();
        if (docEmail != null) {
            docEmail = docEmail.trim().toLowerCase();
            doctor.setEmail(docEmail);
        }

        // Synchronize or create user login account for Doctor
        User user = null;
        if (docEmail != null) {
            Optional<User> existingUserOpt = userRepository.findByEmail(docEmail);
            if (existingUserOpt.isPresent()) {
                user = existingUserOpt.get();
                user.setRole("DOCTOR");
                user.setFullName(doctor.getName());
                user.setPhone(doctor.getPhone());
                user.setActive(doctor.isActive());
                if (initialPassword != null && !initialPassword.trim().isEmpty()) {
                    user.setPassword(initialPassword);
                }
            } else {
                user = new User();
                user.setEmail(docEmail);
                user.setFullName(doctor.getName());
                user.setPhone(doctor.getPhone() != null ? doctor.getPhone() : "");
                user.setRole("DOCTOR");
                user.setActive(doctor.isActive());
                user.setPassword(initialPassword != null && !initialPassword.trim().isEmpty() ? initialPassword : "password123");
            }
            user.setSpecialization(doctor.getSpecialization());
            user.setExperience(String.valueOf(doctor.getExperience()));
            if (doctor.getImagePath() != null) {
                user.setPhoto(doctor.getImagePath());
            }
            user = userRepository.save(user);
            doctor.setUserId(user.getId());
        }

        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor addDoctor(Doctor doctor) {
        return addDoctor(doctor, "password123");
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public List<Doctor> getActiveDoctors() {
        return doctorRepository.findByActiveTrue();
    }

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    @Override
    public Doctor getDoctorByEmail(String email) {
        if (email == null) return null;
        return doctorRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
    }

    @Override
    public Doctor getDoctorByUserId(Long userId) {
        if (userId == null) return null;
        return doctorRepository.findByUserId(userId).orElse(null);
    }

    @Override
    @Transactional
    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        existing.setName(doctor.getName());
        existing.setSpecialization(doctor.getSpecialization());
        existing.setExperience(doctor.getExperience());
        existing.setQualification(doctor.getQualification());
        existing.setPhone(doctor.getPhone());
        existing.setBiography(doctor.getBiography());
        existing.setAvailable(doctor.isAvailable());
        existing.setActive(doctor.isActive());
        if (doctor.getConsultationFee() != null) {
            existing.setConsultationFee(doctor.getConsultationFee());
        }
        if (doctor.getImagePath() != null && !doctor.getImagePath().trim().isEmpty()) {
            existing.setImagePath(doctor.getImagePath());
        }

        String updatedEmail = doctor.getEmail() != null ? doctor.getEmail().trim().toLowerCase() : existing.getEmail();
        existing.setEmail(updatedEmail);

        // Keep linked User account in sync
        Long userId = existing.getUserId();
        if (userId != null) {
            userRepository.findById(userId).ifPresent(u -> {
                u.setFullName(existing.getName());
                u.setEmail(existing.getEmail());
                u.setPhone(existing.getPhone());
                u.setActive(existing.isActive());
                u.setSpecialization(existing.getSpecialization());
                u.setExperience(String.valueOf(existing.getExperience()));
                if (existing.getImagePath() != null) {
                    u.setPhoto(existing.getImagePath());
                }
                userRepository.save(u);
            });
        }

        return doctorRepository.save(existing);
    }

    @Override
    @Transactional
    public Doctor toggleActive(Long id, boolean active) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setActive(active);
            if (existing.getUserId() != null) {
                userRepository.findById(existing.getUserId()).ifPresent(u -> {
                    u.setActive(active);
                    userRepository.save(u);
                });
            }
            return doctorRepository.save(existing);
        }
        return null;
    }

    @Override
    public Doctor toggleAvailability(Long id, boolean available) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setAvailable(available);
            return doctorRepository.save(existing);
        }
        return null;
    }

    @Override
    public Doctor updateImagePath(Long id, String imagePath) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setImagePath(imagePath);
            if (existing.getUserId() != null) {
                userRepository.findById(existing.getUserId()).ifPresent(u -> {
                    u.setPhoto(imagePath);
                    userRepository.save(u);
                });
            }
            return doctorRepository.save(existing);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor existing = doctorRepository.findById(id).orElse(null);
        if (existing != null) {
            if (existing.getUserId() != null) {
                userRepository.deleteById(existing.getUserId());
            }
            doctorRepository.deleteById(id);
        }
    }
}