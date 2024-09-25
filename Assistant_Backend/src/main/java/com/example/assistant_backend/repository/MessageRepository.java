package com.example.assistant_backend.repository;

import com.example.assistant_backend.model.Chathistory;
import com.example.assistant_backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    void deleteByChathistory(Chathistory chathistory);
    List<Message> findByChathistoryOrderByTimestampAsc(Chathistory chathistory);


}
