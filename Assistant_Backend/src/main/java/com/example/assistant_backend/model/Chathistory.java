package com.example.assistant_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Chathistory {

    @Id
    private String UUID;

    @ManyToOne
    @JsonBackReference // Indicates that this is the back reference
    private User user;

    private String name;
    private boolean isEditing = false;
    private String newName = "";

    @OneToMany(mappedBy = "chathistory")
    @JsonManagedReference // Indicates that this is the managed reference
    private List<Message> messages;

    @PrePersist
    protected void onCreate() {
        UUID = java.util.UUID.randomUUID().toString();
    }

    @Override
    public String toString() {
        return "Chathistory{" +
                "uuid='" + UUID + '\'' +
                ", name='" + name + '\'' +
                ", user=" + user.getUsername() + // Assuming User class has getUsername method
                '}';
    }
}
