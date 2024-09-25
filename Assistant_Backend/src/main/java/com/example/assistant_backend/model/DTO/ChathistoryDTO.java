package com.example.assistant_backend.model.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChathistoryDTO {
    @JsonProperty("UUID")
    private String UUID;

    @JsonProperty("name")
    private String name;

    @JsonProperty("isEditing")
    private boolean isEditing;

    @JsonProperty("newName")
    private String newName;

    public ChathistoryDTO() {
        // Default constructor needed for Jackson deserialization
    }

    public ChathistoryDTO(String UUID, String name, boolean isEditing, String newName) {
        this.UUID = UUID;
        this.name = name;
        this.isEditing = isEditing;
        this.newName = newName;
    }

    @Override
    public String toString() {
        return "ChathistoryDTO{" +
                "UUID='" + UUID + '\'' +
                ", name='" + name + '\'' +
                ", isEditing=" + isEditing +
                ", newName='" + newName + '\'' +
                '}';
    }
}
