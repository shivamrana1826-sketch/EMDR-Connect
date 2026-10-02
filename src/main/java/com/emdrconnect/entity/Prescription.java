package com.emdrconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescriptions")
public class Prescription {

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

    private String medicine;

    private String dosage;

    @Column(length = 1000)
    private String instructions;

    @Column(name = "prescription_date")
    private String prescriptionDate;

    public Prescription() {
    }

    public Prescription(Long id, String patientName, String email, String doctorName,
                        String doctorEmail, String medicine, String dosage,
                        String instructions, String prescriptionDate) {
        this.id = id;
        this.patientName = patientName;
        this.email = email;
        this.doctorName = doctorName;
        this.doctorEmail = doctorEmail;
        this.medicine = medicine;
        this.dosage = dosage;
        this.instructions = instructions;
        this.prescriptionDate = prescriptionDate;
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

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(String prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }
}