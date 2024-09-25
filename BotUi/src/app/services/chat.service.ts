import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ChatHistoryItem, ChatMessage } from '../main/main.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://cfa3-35-240-192-41.ngrok-free.app/ask';
  uiid: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private chatMessagesSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private chatMessages: ChatMessage[] = [];

  constructor(private http: HttpClient) { }
  private apiURL = 'http://localhost:8081/api/chathistory/names';

  // Function to get chat history names (chat history items)
  getChatHistoryNames(): Observable<ChatHistoryItem[]> {
    const username = 'test';
    const password = 'test';
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get<ChatHistoryItem[]>(this.apiURL, { headers });
  }

  // Function to delete chat history (delete chat history item)
  deleteChatHistory(uuid: string): Observable<any> {
    const username = 'test';
    const password = 'test';
    const url = `http://localhost:8081/api/chathistory/delete/${uuid}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });
    return this.http.delete<any>(url, { headers });
  }

  // Function to rename chat history (rename chat history item)
  renamechathistory(uuid: string, newname: string): Observable<any> {
    const username = 'test';
    const password = 'test';
    const url = `http://localhost:8081/api/chathistory/rename/${uuid}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });
    const body = { name: newname };

    return this.http.patch<any>(url, body, { headers });
  }

  // Function to get chat history UUID used in share chat history feature
  getChatuuid(uuid: string): Observable<string> {
    return new Observable(subscriber => {
      subscriber.next(uuid);
      console.log('uuid', uuid);
      subscriber.complete();
    });
  }

  setChatuuid(uuid: string): void {
    this.uiid.next(uuid);
  }

  // Function to get chat messages of specific chat history
  getChatMessages(uuid: string): void {
    const username = 'test';
    const password = 'test';
    const url = `http://localhost:8081/api/message/messages/${uuid}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    this.http.get<ChatMessage[]>(url, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching chat messages:', error);
          return of([]); // Return an observable using 'of'
        })
      )
      .subscribe((data: ChatMessage[]) => {
        this.chatMessages = data;
        this.chatMessagesSubject.next(this.chatMessages);  // Push the data to the subject
      });
  }

  getChatMessagesObservable(): Observable<ChatMessage[]> {
    return this.chatMessagesSubject.asObservable();
  }



  // Function to create a new chat
  createChatHistory(conversationName: string): Observable<any> {
    const username = 'test';
    const password = 'test';
    const baseUrl = `http://localhost:8081/api/chathistory/create`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    const body = { name: conversationName };

    return this.http.post<any>(baseUrl, body, { headers });
  }

// Function to save a message in chat history
// Function to save a message in chat history
sendMessage(inputValue: string, uuid: string, isBot: boolean): Observable<ChatMessage | null> {
  const username = 'test';
  const password = 'test';
  const url = `http://localhost:8081/api/message/add`;
  const headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(username + ':' + password),
    'Content-Type': 'application/json'
  });
  const body = {
    messageContent: inputValue,
    isBot: isBot,
    chathistory: { UUID: uuid }
  };

  // First, send the user’s message to the backend
  return this.http.post<ChatMessage>(url, body, { headers }).pipe(
    catchError(error => {
      console.error('Error sending message:', error);
      return of(null);
    }),
    switchMap((newMessage: ChatMessage | null) => {
      if (newMessage) {
        // Update the local chatMessages array with the user's message
        this.chatMessages.push(newMessage);
        this.chatMessagesSubject.next([...this.chatMessages]); // Emit the updated array

        // Now, ask the question to the bot and handle the response
        return this.askQuestion(inputValue).pipe(
          switchMap((response: any) => {
            if (response && response.answer) {
              // Save the bot's response to the backend
              const botMessageBody = {
                messageContent: response.answer,
                isBot: true,
                chathistory: { UUID: uuid }
              };

              return this.http.post<ChatMessage>(url, botMessageBody, { headers }).pipe(
                tap((savedBotMessage: ChatMessage) => {
                  // Add the saved bot message to the chat history
                  this.chatMessages.push(savedBotMessage);
                  this.chatMessagesSubject.next([...this.chatMessages]); // Emit the updated array
                }),
                catchError(error => {
                  console.error('Error saving bot message:', error);
                  return of(null);
                })
              );
            }
            return of(null);
          })
        );
      }
      return of(null);
    })
  );
}

// Function to ask a question and receive a response
askQuestion(question: string): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { question: question };

  return this.http.post<any>(this.apiUrl, body, { headers });
}


}
