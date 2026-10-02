package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Appointment;
import com.emdrconnect.entity.Consultation;
import com.emdrconnect.repository.AppointmentRepository;
import com.emdrconnect.repository.ConsultationRepository;
import com.emdrconnect.service.ConsultationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ConsultationServiceImpl implements ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

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
    public List<Consultation> getConsultationsByDoctorEmail(String doctorEmail) {
        return consultationRepository.findByDoctorEmail(doctorEmail);
    }

    @Override
    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    @Override
    public Consultation getConsultationByAppointmentId(Long appointmentId) {
        return consultationRepository.findByAppointmentId(appointmentId).orElse(null);
    }

    @Override
    public Map<String, Object> verifyAccess(Long appointmentId, String userEmail) {
        Map<String, Object> result = new HashMap<>();

        if (appointmentId == null) {
            result.put("authorized", false);
            result.put("message", "No appointment ID specified. Consultation requires a confirmed appointment.");
            return result;
        }

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            result.put("authorized", false);
            result.put("message", "Appointment not found.");
            return result;
        }

        Appointment appointment = appointmentOpt.get();

        if (!"CONFIRMED".equalsIgnoreCase(appointment.getStatus())) {
            result.put("authorized", false);
            result.put("message", "Consultation cannot be accessed. Current appointment status is "
                    + appointment.getStatus() + ". Only CONFIRMED appointments can join consultation.");
            return result;
        }

        if (userEmail != null) {
            String normEmail = userEmail.trim().toLowerCase();
            boolean isPatient = appointment.getEmail() != null && appointment.getEmail().trim().equalsIgnoreCase(normEmail);
            boolean isDoctor = appointment.getDoctorEmail() != null && appointment.getDoctorEmail().trim().equalsIgnoreCase(normEmail);

            if (!isPatient && !isDoctor) {
                result.put("authorized", false);
                result.put("message", "You are not authorized for this consultation session.");
                return result;
            }
        }

        result.put("authorized", true);
        result.put("appointment", appointment);
        return result;
    }

    @Override
    public Consultation updateConsultation(Long id, Consultation consultation) {
        Consultation existing = consultationRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPatientName(consultation.getPatientName());
            existing.setEmail(consultation.getEmail());
            existing.setDoctorName(consultation.getDoctorName());
            if (consultation.getDoctorEmail() != null) {
                existing.setDoctorEmail(consultation.getDoctorEmail());
            }
            existing.setConsultationDate(consultation.getConsultationDate());
            existing.setConsultationTime(consultation.getConsultationTime());
            existing.setStatus(consultation.getStatus());
            existing.setNotes(consultation.getNotes());
            if (consultation.getAppointmentId() != null) {
                existing.setAppointmentId(consultation.getAppointmentId());
            }

            return consultationRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}