package com.example.assistant_backend.model.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    @JsonProperty("messageContent")
    private String messageContent;

    @JsonProperty("isBot")
    private boolean isBot;

    @JsonProperty("chathistory")
    private ChathistoryDTO chathistory;

    @Override
    public String toString() {
        return "MessageRequest{" +
                "messageContent='" + messageContent + '\'' +
                ", isBot=" + isBot +
                ", chathistory=" + chathistory +
                '}';
    }
}
