package com.emdrconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "consultations")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name")
    private String patientName;

    private String email; // Patient's email

    @Column(name = "doctor_name")
    private String doctorName;

    @Column(name = "doctor_email")
    private String doctorEmail;

    @Column(name = "consultation_date")
    private String consultationDate;

    @Column(name = "consultation_time")
    private String consultationTime;

    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(length = 2000)
    private String notes;

    @Column(name = "appointment_id")
    private Long appointmentId;

    public Consultation() {
    }

    public Consultation(Long id, String patientName, String email, String doctorName,
                        String doctorEmail, String consultationDate, String consultationTime,
                        String status, String notes, Long appointmentId) {
        this.id = id;
        this.patientName = patientName;
        this.email = email;
        this.doctorName = doctorName;
        this.doctorEmail = doctorEmail;
        this.consultationDate = consultationDate;
        this.consultationTime = consultationTime;
        this.status = status;
        this.notes = notes;
        this.appointmentId = appointmentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorEmail() {
        return doctorEmail;
    }

    public void setDoctorEmail(String doctorEmail) {
        this.doctorEmail = doctorEmail;
    }

    public String getConsultationDate() {
        return consultationDate;
    }

    public void setConsultationDate(String consultationDate) {
        this.consultationDate = consultationDate;
    }

    public String getConsultationTime() {
        return consultationTime;
    }

    public void setConsultationTime(String consultationTime) {
        this.consultationTime = consultationTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }
}