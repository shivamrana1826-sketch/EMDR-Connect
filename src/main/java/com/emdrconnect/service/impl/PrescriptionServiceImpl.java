package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Prescription;
import com.emdrconnect.repository.PrescriptionRepository;
import com.emdrconnect.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Override
    public Prescription addPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
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
    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    @Override
    public Prescription updatePrescription(Long id, Prescription prescription) {

        Prescription existingPrescription =
                prescriptionRepository.findById(id).orElse(null);

        if (existingPrescription != null) {

            existingPrescription.setPatientName(prescription.getPatientName());
            existingPrescription.setEmail(prescription.getEmail());
            existingPrescription.setDoctorName(prescription.getDoctorName());
            existingPrescription.setMedicine(prescription.getMedicine());
            existingPrescription.setDosage(prescription.getDosage());
            existingPrescription.setInstructions(prescription.getInstructions());
            existingPrescription.setPrescriptionDate(
                    prescription.getPrescriptionDate()
            );

            return prescriptionRepository.save(existingPrescription);
        }

        return null;
    }

    @Override
    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}