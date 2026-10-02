package com.emdrconnect.controller;

import com.emdrconnect.entity.Prescription;
import com.emdrconnect.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<Prescription> addPrescription(@RequestBody Prescription prescription) {
        Prescription saved = prescriptionService.addPrescription(prescription);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Prescription>> getPrescriptionsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByEmail(email));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctorEmail(@RequestParam String email) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctorEmail(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        Prescription p = prescriptionService.getPrescriptionById(id);
        if (p != null) {
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id,
                                                           @RequestBody Prescription prescription) {
        Prescription updated = prescriptionService.updatePrescription(id, prescription);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok("Prescription deleted successfully!");
    }
}