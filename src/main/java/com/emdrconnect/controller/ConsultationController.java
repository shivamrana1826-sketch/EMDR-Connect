package com.emdrconnect.controller;

import com.emdrconnect.entity.Consultation;
import com.emdrconnect.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) {
        return ResponseEntity.ok(consultationService.createConsultation(consultation));
    }

    @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Consultation>> getConsultationsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(consultationService.getConsultationsByEmail(email));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Consultation>> getConsultationsByDoctorEmail(@RequestParam String email) {
        return ResponseEntity.ok(consultationService.getConsultationsByDoctorEmail(email));
    }

    @GetMapping("/verify-access")
    public ResponseEntity<Map<String, Object>> verifyAccess(@RequestParam(required = false) Long appointmentId,
                                                            @RequestParam(required = false) String email) {
        Map<String, Object> result = consultationService.verifyAccess(appointmentId, email);
        if (Boolean.TRUE.equals(result.get("authorized"))) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Consultation c = consultationService.getConsultationById(id);
        if (c != null) {
            return ResponseEntity.ok(c);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id,
                                                           @RequestBody Consultation consultation) {
        Consultation updated = consultationService.updateConsultation(id, consultation);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.ok("Consultation deleted successfully!");
    }
}