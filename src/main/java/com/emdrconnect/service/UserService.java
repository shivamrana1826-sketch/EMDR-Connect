package com.emdrconnect.service;

import com.emdrconnect.dto.LoginRequest;
import com.emdrconnect.dto.LoginResponse;
import com.emdrconnect.entity.User;
import java.util.List;

public interface UserService {

    User registerUser(User user);

    LoginResponse login(LoginRequest loginRequest);

    String loginUser(String email, String password);

    List<User> getAllUsers();

    User getUserByEmail(String email);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}