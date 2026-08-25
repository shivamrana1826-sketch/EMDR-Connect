package com.emdrconnect.controller;

import com.emdrconnect.entity.Consultation;
import com.emdrconnect.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

    @PostMapping
    public Consultation createConsultation(
            @RequestBody Consultation consultation) {
        return consultationService.createConsultation(consultation);
    }

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.getAllConsultations();
    }

    @GetMapping("/patient")
    public List<Consultation> getConsultationsByEmail(
            @RequestParam String email) {

        return consultationService.getConsultationsByEmail(email);
    }

    @GetMapping("/{id}")
    public Consultation getConsultationById(@PathVariable Long id) {
        return consultationService.getConsultationById(id);
    }

    @PutMapping("/{id}")
    public Consultation updateConsultation(
            @PathVariable Long id,
            @RequestBody Consultation consultation) {
        return consultationService.updateConsultation(id, consultation);
    }

    @DeleteMapping("/{id}")
    public String deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return "Consultation deleted successfully!";
    }
}