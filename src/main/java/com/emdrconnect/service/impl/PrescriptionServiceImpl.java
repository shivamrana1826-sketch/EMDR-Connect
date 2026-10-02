package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Prescription;
import com.emdrconnect.repository.PrescriptionRepository;
import com.emdrconnect.service.NotificationService;
import com.emdrconnect.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Prescription addPrescription(Prescription prescription) {
        Prescription saved = prescriptionRepository.save(prescription);

        if (saved.getEmail() != null && !saved.getEmail().trim().isEmpty()) {
            String doctor = saved.getDoctorName() != null ? saved.getDoctorName() : "Your Doctor";
            notificationService.createNotification(
                    saved.getEmail(),
                    "New Prescription Issued",
                    doctor + " has issued a new prescription for: " + saved.getMedicine() + " (" + saved.getDosage() + ").",
                    "PRESCRIPTION"
            );
        }

        return saved;
    }

    @Override
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @Override
    public List<Prescription> getPrescriptionsByEmail(String email) {
        return prescriptionRepository.findByEmail(email);
    }

    @Override
    public List<Prescription> getPrescriptionsByDoctorEmail(String doctorEmail) {
        return prescriptionRepository.findByDoctorEmail(doctorEmail);
    }

    @Override
    public List<Prescription> getPrescriptionsByDoctorName(String doctorName) {
        return prescriptionRepository.findByDoctorName(doctorName);
    }

    @Override
    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    @Override
    public Prescription updatePrescription(Long id, Prescription prescription) {
        Prescription existing = prescriptionRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPatientName(prescription.getPatientName());
            existing.setEmail(prescription.getEmail());
            existing.setDoctorName(prescription.getDoctorName());
            if (prescription.getDoctorEmail() != null) {
                existing.setDoctorEmail(prescription.getDoctorEmail());
            }
            existing.setMedicine(prescription.getMedicine());
            existing.setDosage(prescription.getDosage());
            existing.setInstructions(prescription.getInstructions());
            existing.setPrescriptionDate(prescription.getPrescriptionDate());

            return prescriptionRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}