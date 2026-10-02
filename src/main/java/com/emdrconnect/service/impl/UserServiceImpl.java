package com.emdrconnect.service.impl;

import com.emdrconnect.dto.LoginRequest;
import com.emdrconnect.dto.LoginResponse;
import com.emdrconnect.entity.Doctor;
import com.emdrconnect.entity.User;
import com.emdrconnect.repository.DoctorRepository;
import com.emdrconnect.repository.UserRepository;
import com.emdrconnect.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void initDefaultAdmin() {
        try {
            // Seed default Admin if not present
            if (!userRepository.existsByEmail("admin@emdrconnect.com")) {
                User admin = new User();
                admin.setEmail("admin@emdrconnect.com");
                admin.setFullName("System Administrator");
                admin.setPassword("admin123");
                admin.setPhone("9876543210");
                admin.setRole("ADMIN");
                admin.setActive(true);
                userRepository.save(admin);
            }
        } catch (Exception ignored) {
        }
    }

    @Override
    public User registerUser(User user) {
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        String cleanEmail = user.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new IllegalArgumentException("Email is already registered. Please login.");
        }
        user.setEmail(cleanEmail);
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("PATIENT");
        }
        user.setActive(true);
        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return LoginResponse.failure("Email and password are required.");
        }

        String email = loginRequest.getEmail().trim().toLowerCase();
        String rawPassword = loginRequest.getPassword();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return LoginResponse.failure("Invalid email or password.");
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return LoginResponse.failure("Account is deactivated. Please contact administrator.");
        }

        // Verify role if specified
        if (loginRequest.getRole() != null && !loginRequest.getRole().trim().isEmpty()) {
            String requestedRole = loginRequest.getRole().trim().toUpperCase();
            if (!user.getRole().equalsIgnoreCase(requestedRole)) {
                return LoginResponse.failure("Role mismatch: This account is registered as "
                        + user.getRole() + ", not " + requestedRole + ".");
            }
        }

        boolean passwordMatches = checkPassword(rawPassword, user.getPassword());
        if (!passwordMatches) {
            return LoginResponse.failure("Invalid email or password.");
        }

        LoginResponse response = new LoginResponse();
        response.setSuccess(true);
        response.setMessage("Login successful");
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setUserId(user.getId());
        response.setRole(user.getRole().toUpperCase());
        response.setPhoto(user.getPhoto());

        if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            Optional<Doctor> docOpt = doctorRepository.findByUserId(user.getId());
            if (docOpt.isEmpty()) {
                docOpt = doctorRepository.findByEmail(user.getEmail());
            }

            if (docOpt.isPresent()) {
                Doctor doc = docOpt.get();
                response.setDoctorId(doc.getId());
                response.setDoctorName(doc.getName());
                if (doc.getImagePath() != null) {
                    response.setPhoto(doc.getImagePath());
                }
            } else {
                response.setDoctorName(user.getFullName());
            }
        }

        return response;
    }

    @Override
    public String loginUser(String email, String password) {
        LoginRequest req = new LoginRequest(email, password);
        LoginResponse res = login(req);
        if (res.isSuccess()) {
            return res.getRole();
        }
        return res.getMessage();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserByEmail(String email) {
        if (email == null) return null;
        return userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setFullName(user.getFullName());
            existingUser.setEmail(user.getEmail().trim().toLowerCase());
            if (user.getPassword() != null && !user.getPassword().trim().isEmpty()) {
                existingUser.setPassword(user.getPassword());
            }
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());
            existingUser.setActive(user.isActive());
            existingUser.setSpecialization(user.getSpecialization());
            existingUser.setExperience(user.getExperience());
            existingUser.setPhoto(user.getPhoto());

            return userRepository.save(existingUser);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private boolean checkPassword(String rawPassword, String storedPassword) {
        if (storedPassword == null || rawPassword == null) {
            return false;
        }
        if (storedPassword.equals(rawPassword)) {
            return true;
        }
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            try {
                return passwordEncoder.matches(rawPassword, storedPassword);
            } catch (Exception e) {
                return false;
            }
        }
        return false;
    }
}