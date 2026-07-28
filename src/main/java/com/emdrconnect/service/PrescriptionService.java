package com.emdrconnect.service;

import com.emdrconnect.entity.Prescription;
import java.util.List;

public interface PrescriptionService {

    Prescription addPrescription(Prescription prescription);

    List<Prescription> getAllPrescriptions();

    List<Prescription> getPrescriptionsByEmail(String email);

    Prescription getPrescriptionById(Long id);

    Prescription updatePrescription(Long id, Prescription prescription);

    void deletePrescription(Long id);
}