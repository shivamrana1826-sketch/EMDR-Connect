package com.emdrconnect.controller;

import com.emdrconnect.entity.Appointment;
import com.emdrconnect.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment) {
        Appointment saved = appointmentService.bookAppointment(appointment);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getAppointmentsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByEmail(email));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorEmail(@RequestParam String email) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorEmail(email));
    }

    @GetMapping("/doctor-name")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorName(@RequestParam String name) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorName(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Appointment app = appointmentService.getAppointmentById(id);
        if (app != null) {
            return ResponseEntity.ok(app);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id,
                                                         @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id,
                                                               @RequestParam String status) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok("Appointment deleted successfully!");
    }
}