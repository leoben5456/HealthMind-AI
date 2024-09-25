package com.example.assistant_backend.repository;

import com.example.assistant_backend.model.Chathistory;
import com.example.assistant_backend.model.DTO.ChathistoryDTO;
import com.example.assistant_backend.model.Message;
import com.example.assistant_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChathistoryRepository extends JpaRepository<Chathistory, String> {

    List<Chathistory> findByUser(User user);


    @Query("SELECT new com.example.assistant_backend.model.DTO.ChathistoryDTO(ch.UUID, ch.name, ch.isEditing, ch.newName) FROM Chathistory ch WHERE ch.user = :user")
    List<ChathistoryDTO> findChathistoryNamesByUser(User user);

    Chathistory findByUUID(String UUID);

    @Query("SELECT m.messageContent FROM Message m WHERE m.chathistory = :chathistory")
    List<String> findMessagesByChathistory(Chathistory chathistory);
}
