package com.emdrconnect.service;

import com.emdrconnect.entity.Consultation;
import java.util.List;

public interface ConsultationService {

    Consultation createConsultation(Consultation consultation);

    List<Consultation> getAllConsultations();

    List<Consultation> getConsultationsByEmail(String email);

    Consultation getConsultationById(Long id);

    Consultation updateConsultation(Long id, Consultation consultation);

    void deleteConsultation(Long id);
}