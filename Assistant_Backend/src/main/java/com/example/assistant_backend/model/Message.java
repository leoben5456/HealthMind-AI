package com.example.assistant_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 10000)
    private String messageContent;
    private Boolean isBot;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "chathistory_uuid")
    @JsonBackReference // Indicates that this is the back reference
    private Chathistory chathistory;

    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", messageContent='" + messageContent + '\'' +
                ", isBot=" + isBot +
                ", chathistory=" + chathistory.getUUID() +
                '}';
    }
}
