package com.emdrconnect.controller;

import com.emdrconnect.entity.Doctor;
import com.emdrconnect.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Doctor>> getActiveDoctors() {
        return ResponseEntity.ok(doctorService.getActiveDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Doctor doc = doctorService.getDoctorById(id);
        if (doc != null) {
            return ResponseEntity.ok(doc);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/by-email")
    public ResponseEntity<Doctor> getDoctorByEmail(@RequestParam String email) {
        Doctor doc = doctorService.getDoctorByEmail(email);
        if (doc != null) {
            return ResponseEntity.ok(doc);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor,
                                           @RequestParam(required = false) String password) {
        Doctor saved = doctorService.addDoctor(doctor, password != null ? password : "password123");
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Doctor> addDoctorWithImage(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam("specialization") String specialization,
            @RequestParam("qualification") String qualification,
            @RequestParam(value = "experience", defaultValue = "0") int experience,
            @RequestParam(value = "biography", required = false) String biography,
            @RequestParam(value = "consultationFee", required = false) Double consultationFee,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "available", defaultValue = "true") boolean available,
            @RequestParam(value = "active", defaultValue = "true") boolean active,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws IOException {

        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(specialization);
        doctor.setQualification(qualification);
        doctor.setExperience(experience);
        doctor.setBiography(biography);
        doctor.setConsultationFee(consultationFee);
        doctor.setAvailable(available);
        doctor.setActive(active);

        if (photo != null && !photo.isEmpty()) {
            String savedPath = saveUploadedImage(photo);
            doctor.setImagePath(savedPath);
        } else {
            // Default placeholder image
            doctor.setImagePath("images/doctor1.jpg");
        }

        Doctor saved = doctorService.addDoctor(doctor, password != null ? password : "password123");
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/{id}/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Doctor> uploadDoctorImage(@PathVariable Long id,
                                                    @RequestParam("photo") MultipartFile photo) throws IOException {
        if (photo.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String savedPath = saveUploadedImage(photo);
        Doctor updated = doctorService.updateImagePath(id, savedPath);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        Doctor updated = doctorService.updateDoctor(id, doctor);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<Doctor> toggleActive(@PathVariable Long id, @RequestParam boolean active) {
        Doctor updated = doctorService.toggleActive(id, active);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/toggle-availability")
    public ResponseEntity<Doctor> toggleAvailability(@PathVariable Long id, @RequestParam boolean available) {
        Doctor updated = doctorService.toggleAvailability(id, available);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully!");
    }

    private String saveUploadedImage(MultipartFile photo) throws IOException {
        Path uploadPath = Paths.get("uploads", "doctors");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = photo.getOriginalFilename();
        String extension = ".jpg";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String fileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(photo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/doctors/" + fileName;
    }
}