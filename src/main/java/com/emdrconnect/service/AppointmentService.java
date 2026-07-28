package com.emdrconnect.service;

import com.emdrconnect.entity.Appointment;
import java.util.List;

public interface AppointmentService {

    Appointment bookAppointment(Appointment appointment);

    List<Appointment> getAllAppointments();

    List<Appointment> getAppointmentsByEmail(String email);

    Appointment getAppointmentById(Long id);

    Appointment updateAppointment(Long id, Appointment appointment);

    Appointment updateAppointmentStatus(Long id, String status);

    void deleteAppointment(Long id);
}