package com.emdrconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    private int experience;

    @Column(length = 1000)
    private String biography;

    @Column(name = "image_path")
    private String imagePath;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "user_id", unique = true)
    private Long userId;

    private Double consultationFee;

    public Doctor() {
    }

    public Doctor(Long id, String name, String email, String phone, String specialization,
                  String qualification, int experience, String biography, String imagePath,
                  Boolean available, Boolean active, Long userId, Double consultationFee) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.biography = biography;
        this.imagePath = imagePath;
        this.available = (available != null) ? available : true;
        this.active = (active != null) ? active : true;
        this.userId = userId;
        this.consultationFee = consultationFee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Boolean getAvailable() {
        return available != null ? available : true;
    }

    public boolean isAvailable() {
        return available != null && available;
    }

    public void setAvailable(Boolean available) {
        this.available = (available != null) ? available : true;
    }

    public Boolean getActive() {
        return active != null ? active : true;
    }

    public boolean isActive() {
        return active != null && active;
    }

    public void setActive(Boolean active) {
        this.active = (active != null) ? active : true;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }
}