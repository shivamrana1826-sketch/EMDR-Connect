package com.emdrconnect.controller;

import com.emdrconnect.dto.LoginRequest;
import com.emdrconnect.entity.User;
import com.emdrconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping(
            value = "/register-doctor",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public User registerDoctor(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String phone,
            @RequestParam String role,
            @RequestParam String specialization,
            @RequestParam String experience,
            @RequestParam("photo") MultipartFile photo
    ) throws IOException {

        String uploadDirectory = "uploads/doctors";

        Path uploadPath = Paths.get(uploadDirectory);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = photo.getOriginalFilename();

        String extension = "";

        if (originalFileName != null &&
                originalFileName.contains(".")) {

            extension =
                    originalFileName.substring(
                            originalFileName.lastIndexOf(".")
                    );
        }

        String fileName =
                UUID.randomUUID() + extension;

        Path filePath =
                uploadPath.resolve(fileName);

        Files.copy(
                photo.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        User doctor = new User();

        doctor.setFullName(fullName);
        doctor.setEmail(email);
        doctor.setPassword(password);
        doctor.setPhone(phone);
        doctor.setRole("DOCTOR");
        doctor.setSpecialization(specialization);
        doctor.setExperience(experience);
        doctor.setPhoto("/uploads/doctors/" + fileName);

        return userService.registerUser(doctor);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    @GetMapping("/doctors")
    public List<User> getAllDoctors() {

        return userService.getAllUsers()
                .stream()
                .filter(user -> "DOCTOR".equalsIgnoreCase(user.getRole()))
                .toList();
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully!";
    }

    @PostMapping("/login")
    public String loginUser(
            @RequestBody LoginRequest loginRequest
    ) {
        return userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
    }
}