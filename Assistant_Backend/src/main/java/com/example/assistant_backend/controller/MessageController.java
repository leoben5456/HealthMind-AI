package com.example.assistant_backend.controller;

import com.example.assistant_backend.model.Chathistory;
import com.example.assistant_backend.model.Message;
import com.example.assistant_backend.model.User;
import com.example.assistant_backend.repository.ChathistoryRepository;
import com.example.assistant_backend.repository.MessageRepository;
import com.example.assistant_backend.repository.UserRepository;
import com.example.assistant_backend.model.DTO.MessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChathistoryRepository chathistoryRepository;

    @Autowired
    private MessageRepository messageRepository;

    @PostMapping("/add")
    public ResponseEntity<Message> addMessage(@AuthenticationPrincipal UserDetails userDetails, @RequestBody MessageRequest request) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        System.out.println("Request payload: " + request);
        System.out.println("Message content: " + request.getMessageContent());
        System.out.println("Is bot: " + request.isBot());
        System.out.println("Chathistory: " + request.getChathistory());

        if (request.getChathistory() == null) {
            System.out.println("Chathistory part of the request is null");
        } else {
            String chathistoryUUID = request.getChathistory().getUUID();
            System.out.println("Chathistory UUID from request: " + chathistoryUUID);
            Chathistory chathistory = chathistoryRepository.findByUUID(chathistoryUUID);
            System.out.println("Fetched Chathistory: " + chathistory);

            if (chathistory == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Create a new Message entity and set its properties
            Message message = new Message();
            message.setChathistory(chathistory);
            message.setMessageContent(request.getMessageContent());
            message.setIsBot(request.isBot());
            message.setTimestamp(LocalDateTime.now());

            // Save the new message to the repository
            messageRepository.save(message);

            // Return the saved message
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }


    @GetMapping("/messages/{chathistoryUUID}")
    public Iterable<Message> getMessages(@PathVariable String chathistoryUUID) {
        Chathistory chathistory = chathistoryRepository.findByUUID(chathistoryUUID);
        if (chathistory == null) {
            return null;
        }
        return messageRepository.findByChathistoryOrderByTimestampAsc(chathistory);
    }
}
