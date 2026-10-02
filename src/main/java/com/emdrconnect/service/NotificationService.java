package com.emdrconnect.service;

import com.emdrconnect.entity.Notification;
import java.util.List;

public interface NotificationService {

    Notification createNotification(String recipientEmail, String title, String message, String type);

    List<Notification> getNotificationsForUser(String email);

    void markAsRead(Long id);

    void markAllAsRead(String email);
}
