package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Appointment;
import com.emdrconnect.entity.Doctor;
import com.emdrconnect.repository.AppointmentRepository;
import com.emdrconnect.repository.DoctorRepository;
import com.emdrconnect.service.AppointmentService;
import com.emdrconnect.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getStatus() == null || appointment.getStatus().trim().isEmpty()) {
            appointment.setStatus("PENDING");
        }

        // If doctorEmail is missing, attempt to resolve from DoctorRepository
        if ((appointment.getDoctorEmail() == null || appointment.getDoctorEmail().trim().isEmpty())
                && appointment.getDoctorName() != null) {
            List<Doctor> doctors = doctorRepository.findAll();
            for (Doctor d : doctors) {
                if (d.getName() != null && d.getName().equalsIgnoreCase(appointment.getDoctorName())) {
                    appointment.setDoctorEmail(d.getEmail());
                    break;
                }
            }
        }

        Appointment saved = appointmentRepository.save(appointment);

        // Notify patient that appointment has been booked
        if (saved.getEmail() != null) {
            notificationService.createNotification(
                    saved.getEmail(),
                    "Appointment Requested",
                    "Your appointment request with " + (saved.getDoctorName() != null ? saved.getDoctorName() : "Doctor")
                            + " on " + saved.getAppointmentDate() + " at " + saved.getAppointmentTime()
                            + " has been received and is pending confirmation.",
                    "APPOINTMENT_REQUESTED"
            );
        }

        return saved;
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getAppointmentsByEmail(String email) {
        return appointmentRepository.findByEmailOrderByAppointmentDateDesc(email);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorEmail(String doctorEmail) {
        return appointmentRepository.findByDoctorEmailOrderByAppointmentDateDesc(doctorEmail);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorName(String doctorName) {
        return appointmentRepository.findByDoctorName(doctorName);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existing = appointmentRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPatientName(appointment.getPatientName());
            existing.setDoctorName(appointment.getDoctorName());
            if (appointment.getDoctorEmail() != null) {
                existing.setDoctorEmail(appointment.getDoctorEmail());
            }
            existing.setAppointmentDate(appointment.getAppointmentDate());
            existing.setAppointmentTime(appointment.getAppointmentTime());
            existing.setStatus(appointment.getStatus());
            existing.setEmail(appointment.getEmail());
            existing.setPhone(appointment.getPhone());
            existing.setReason(appointment.getReason());

            return appointmentRepository.save(existing);
        }
        return null;
    }

    @Override
    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment existing = appointmentRepository.findById(id).orElse(null);
        if (existing != null) {
            String oldStatus = existing.getStatus();
            existing.setStatus(status.toUpperCase());
            Appointment updated = appointmentRepository.save(existing);

            // Trigger notification to patient when status transitions
            if (updated.getEmail() != null && !status.equalsIgnoreCase(oldStatus)) {
                String docName = updated.getDoctorName() != null ? updated.getDoctorName() : "Doctor";
                String upperStatus = status.toUpperCase();

                if ("CONFIRMED".equalsIgnoreCase(upperStatus)) {
                    notificationService.createNotification(
                            updated.getEmail(),
                            "Appointment Confirmed",
                            "Your appointment with " + docName + " on " + updated.getAppointmentDate()
                                    + " at " + updated.getAppointmentTime() + " has been confirmed.",
                            "APPOINTMENT_CONFIRMED"
                    );
                } else if ("REJECTED".equalsIgnoreCase(upperStatus)) {
                    notificationService.createNotification(
                            updated.getEmail(),
                            "Appointment Rejected",
                            "Your appointment with " + docName + " on " + updated.getAppointmentDate()
                                    + " at " + updated.getAppointmentTime() + " has been rejected.",
                            "APPOINTMENT_REJECTED"
                    );
                } else if ("COMPLETED".equalsIgnoreCase(upperStatus)) {
                    notificationService.createNotification(
                            updated.getEmail(),
                            "Appointment Completed",
                            "Your appointment session with " + docName + " has been marked as completed.",
                            "APPOINTMENT_COMPLETED"
                    );
                }
            }

            return updated;
        }
        return null;
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}