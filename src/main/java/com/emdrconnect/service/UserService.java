package com.emdrconnect.service;

import com.emdrconnect.entity.User;
import java.util.List;

public interface UserService {

    User registerUser(User user);

    List<User> getAllUsers();

    User getUserByEmail(String email);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

    String loginUser(String email, String password);

}