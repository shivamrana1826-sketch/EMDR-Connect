package com.emdrconnect.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private String role;
    private String email;
    private String fullName;
    private Long userId;
    private Long doctorId;
    private String doctorName;
    private String photo;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message, String role, String email,
                         String fullName, Long userId, Long doctorId, String doctorName, String photo) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.email = email;
        this.fullName = fullName;
        this.userId = userId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.photo = photo;
    }

    public static LoginResponse failure(String message) {
        LoginResponse res = new LoginResponse();
        res.setSuccess(false);
        res.setMessage(message);
        return res;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
}
