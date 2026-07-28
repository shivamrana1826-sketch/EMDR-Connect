package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Consultation;
import com.emdrconnect.repository.ConsultationRepository;
import com.emdrconnect.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultationServiceImpl implements ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Override
    public Consultation createConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    @Override
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @Override
    public List<Consultation> getConsultationsByEmail(String email) {
        return consultationRepository.findByEmail(email);
    }

    @Override
    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    @Override
    public Consultation updateConsultation(Long id, Consultation consultation) {

        Consultation existingConsultation =
                consultationRepository.findById(id).orElse(null);

        if (existingConsultation != null) {

            existingConsultation.setPatientName(consultation.getPatientName());
            existingConsultation.setEmail(consultation.getEmail());
            existingConsultation.setDoctorName(consultation.getDoctorName());
            existingConsultation.setConsultationDate(consultation.getConsultationDate());
            existingConsultation.setConsultationTime(consultation.getConsultationTime());
            existingConsultation.setStatus(consultation.getStatus());
            existingConsultation.setNotes(consultation.getNotes());

            return consultationRepository.save(existingConsultation);
        }

        return null;
    }

    @Override
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}