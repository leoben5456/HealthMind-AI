package com.example.assistant_backend.controller;

import com.example.assistant_backend.model.Chathistory;
import com.example.assistant_backend.model.DTO.ChathistoryDTO;
import com.example.assistant_backend.model.User;
import com.example.assistant_backend.repository.ChathistoryRepository;
import com.example.assistant_backend.repository.MessageRepository;
import com.example.assistant_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chathistory")
public class ChathistoryController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChathistoryRepository chathistoryRepository;

    @Autowired
    private MessageRepository messageRepository;


    //Get all chat history names
    @GetMapping("/names")
    public List<ChathistoryDTO> getHistoryChatNames(@AuthenticationPrincipal UserDetails userDetails){
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return List.of();
        }
        return chathistoryRepository.findChathistoryNamesByUser(user);
    }
    //Create new chatHistory
    @PostMapping("/create")
    public Map<String, String> CreateHistoryChat(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Chathistory request) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        if (user == null) {
            return Map.of("error", "User not found");
        }
        Chathistory chathistory = new Chathistory();
        chathistory.setUser(user);
        chathistory.setName(request.getName());
        chathistoryRepository.save(chathistory);
        return Map.of("uuid", chathistory.getUUID());
    }
     //Delete chat history by passing uuid as url parms
     @DeleteMapping("/delete/{uuid}")
     @Transactional
     public String deleteHistoryChat(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String uuid) {
         User user = userRepository.findByUsername(userDetails.getUsername());
         if (user == null) {
             return "User not found";
         }
         Chathistory chathistory = chathistoryRepository.findByUUID(uuid);
         if (chathistory == null) {
             return "Chat history not found";
         }
         messageRepository.deleteByChathistory(chathistory);
         chathistoryRepository.delete(chathistory);
         return "Chat history deleted";
     }

     //Rename Chat history
     @PatchMapping("/rename/{uuid}")
     public String RenameChathistory(@AuthenticationPrincipal UserDetails userDetails,@PathVariable String uuid,@RequestBody Chathistory request){
         User user = userRepository.findByUsername(userDetails.getUsername());
         if (user == null) {
             return "User not found";
         }
         Chathistory chathistory = chathistoryRepository.findByUUID(uuid);
         if (chathistory == null) {
             return "Chat history not found";
         }
         if (!chathistory.getUser().equals(user)) {
             return "Unauthorized to rename this chat history";
         }
         chathistory.setName(request.getName());
         chathistoryRepository.save(chathistory);
         return "Chat history renamed";
     }

     //Get all chat history messages
      @GetMapping("/messages/{uuid}")
        public List<String> getHistoryChatMessages(@AuthenticationPrincipal UserDetails userDetails,@PathVariable String uuid){
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                return List.of();
            }
            Chathistory chathistory = chathistoryRepository.findByUUID(uuid);
            if (chathistory == null) {
                return List.of();
            }
            return chathistoryRepository.findMessagesByChathistory(chathistory);
        }

}
