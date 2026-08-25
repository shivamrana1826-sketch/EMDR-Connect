package com.emdrconnect.service.impl;

import com.emdrconnect.entity.Appointment;
import com.emdrconnect.repository.AppointmentRepository;
import com.emdrconnect.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    public Appointment bookAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<Appointment> getAppointmentsByEmail(String email) {
        return appointmentRepository.findByEmail(email);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    @Override
    public Appointment updateAppointment(Long id, Appointment appointment) {

        Appointment existingAppointment = appointmentRepository.findById(id).orElse(null);

        if (existingAppointment != null) {
            existingAppointment.setPatientName(appointment.getPatientName());
            existingAppointment.setDoctorName(appointment.getDoctorName());
            existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
            existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
            existingAppointment.setStatus(appointment.getStatus());
            existingAppointment.setEmail(appointment.getEmail());
            existingAppointment.setPhone(appointment.getPhone());
            existingAppointment.setReason(appointment.getReason());

            return appointmentRepository.save(existingAppointment);
        }

        return null;
    }

    @Override
    public Appointment updateAppointmentStatus(Long id, String status) {

        Appointment existingAppointment =
                appointmentRepository.findById(id).orElse(null);

        if (existingAppointment != null) {

            existingAppointment.setStatus(status);

            return appointmentRepository.save(existingAppointment);
        }

        return null;
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}