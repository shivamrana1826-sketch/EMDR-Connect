package com.emdrconnect.service;

import com.emdrconnect.entity.Consultation;
import java.util.List;
import java.util.Map;

public interface ConsultationService {

    Consultation createConsultation(Consultation consultation);

    List<Consultation> getAllConsultations();

    List<Consultation> getConsultationsByEmail(String email);

    List<Consultation> getConsultationsByDoctorEmail(String doctorEmail);

    Consultation getConsultationById(Long id);

    Consultation getConsultationByAppointmentId(Long appointmentId);

    Map<String, Object> verifyAccess(Long appointmentId, String userEmail);

    Consultation updateConsultation(Long id, Consultation consultation);

    void deleteConsultation(Long id);
}