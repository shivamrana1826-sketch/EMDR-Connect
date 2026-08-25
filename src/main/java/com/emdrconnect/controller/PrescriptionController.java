package com.emdrconnect.controller;

import com.emdrconnect.entity.Prescription;
import com.emdrconnect.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public Prescription addPrescription(@RequestBody Prescription prescription) {
        return prescriptionService.addPrescription(prescription);
    }

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/patient")
    public List<Prescription> getPrescriptionsByEmail(
            @RequestParam String email) {

        return prescriptionService.getPrescriptionsByEmail(email);
    }

    @GetMapping("/{id}")
    public Prescription getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }

    @PutMapping("/{id}")
    public Prescription updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescription) {

        return prescriptionService.updatePrescription(id, prescription);
    }

    @DeleteMapping("/{id}")
    public String deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return "Prescription deleted successfully!";
    }
}