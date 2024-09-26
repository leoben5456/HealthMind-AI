import { ChangeDetectorRef, Component, input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FeedbackComponent } from '../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { ShareComponent } from '../share/share.component';
import { ChatService } from '../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DarkmodeService } from '../services/darkmode.service';
import { AuthService } from '../services/auth.service';
interface Message {
  content: string;
  isBot: boolean;
}

declare var webkitSpeechRecognition: any;

export interface ChatMessage {
  id: number;
  messageContent: string;
  isBot: boolean;
}


export interface ChatHistoryItem {
  UUID: string;
  name: string;
  isEditing: boolean;
  newName: string;

}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  items: MenuItem[] | undefined;
  sidebarVisible: boolean = false;
  sidebar: boolean = true;
  isHandset: boolean = false;
  inputImg:string='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA+UlEQVR4nO2VQUsDMRCFU5QKgoeCFATBg1AQhEJRT4WCIFZELIVIK+3e9xD2zTx2r/npK4Et7EV0xempD94tmS+8mSTOHfRbkXwNIVzXdd1zFhKRLJnkkuSt975vAthZVdck72OMpyaAljciMlPVcytA1vK8qqpLS0DWxLcoiuLGe39kApDGAD5EZBxCOPkRAOBOVaeq+gzgXUQ+O8DS2oeyLM86xZYiSJtIDklepVgATJqDPDUHWbVGfAvgEcCFKYDkcP8RiXWTpVvhN1UdWYzp3OKibVJv8jwf/Knw3h87kss0jjHG438pvBPJlzTrzjmbD+cg942+AIoyPSk6DPyQAAAAAElFTkSuQmCC';
  isInputEmpty: boolean = true;
  chatHistory!:ChatHistoryItem[];
  ChatMessages!:ChatMessage[];
  uuid!:string;
  isLoggedIn: boolean = false;
  hideSidebar: boolean = false;
  inputValue: string='';
  recognizedText: string = '';
  recognition: any;
  isWaitingForResponse: boolean = false;
  isDarkMode: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver,private messageService: MessageService,private confirmationService: ConfirmationService,public dialog: MatDialog,private chatService:ChatService,private route: ActivatedRoute,private darkModeService:DarkmodeService,private router: Router,private authService:AuthService,private cdr: ChangeDetectorRef) {

  }


ngOnInit() {
  this.initSpeechRecognition();
  this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
    this.isHandset = result.matches;
  });
  this.getChatHistoryNames();
  // Subscribe to route params to get UUID and fetch initial messages
  this.route.params.subscribe(params => {
    this.uuid = params['uuid'];
    this.chatService.getChatMessages(this.uuid);
  });
  // Subscribe to chat messages to receive live updates
  this.chatService.getChatMessagesObservable().subscribe((data: ChatMessage[]) => {
    this.ChatMessages = data;
    console.log(this.ChatMessages);

  });

  //check if url contains share/chat/uiid
  this.router.events.subscribe(() => {
    const url = this.router.url;
    this.hideSidebar = url.includes('/share/chat/');
  });

   this.isDarkMode=localStorage.getItem('darkmode') === 'true';
}



//open feedback dialog
openFeedbackDialog() {
  this.dialog.open(FeedbackComponent, {
      width: '400px',
      height: '500px',
  });
}

//open share dialog
openShareDialog() {
  this.dialog.open(ShareComponent, {
      width: '600px',
      height: '300px',
      data: { uuid: this.uuid }
  });
}




//rename chat history item functions
startEditing(chat: any) {
  chat.isEditing = true;
  chat.newName = chat.name; // Correct assignment
  console.log("chat new name:" + chat.newName);
}

finishEditing(chat: any, newName: string) {
  chat.isEditing = false;
  console.log("Editing chat with UUID:", chat.UUID);
  if (!chat.UUID) {
    console.error("Chat UUID is missing:", chat);
    return;
  }

  // Update the name immediately in the local state
  chat.name = newName;

  // Then make the API call
  this.renamechathistory(chat.UUID, newName);
}

renamechathistory(UUID: string, newName: string) {
  this.chatService.renamechathistory(UUID, newName).subscribe(() => {
    const index = this.chatHistory.findIndex(item => item.UUID === UUID);
    if (index !== -1) {
      this.chatHistory[index].name = newName;
      this.chatHistory[index].isEditing = false;
    }
    console.log("Updated chat history:", this.chatHistory);
  }, error => {
    console.error("Error updating chat history:", error);
  });
}


//delete chat history item function
deleteHistoryItem(itemuuid: string): void {
    const index = this.chatHistory.findIndex(item => String(item.UUID) === itemuuid);
    if (index !== -1) {
      this.chatHistory.splice(index, 1);
    }
}





clearHistory() {
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'History Deleted Successfully' });
}




    //clear all conversations  confirmation
  clearConversaitons(event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Do you want to delete all conversations?",
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
        accept: () => {
            this.chatHistory= [];
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Conversations deleted' });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
  }

  //delete conversation item confirmation
  deleteConversation(event: Event, itemuuid: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: "Do you want to delete this conversations?",
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",

        accept: () => {
           this.deleteHistoryItem(itemuuid);
            this.deleteChatHistory(itemuuid);
            this.getChatHistoryNames();
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Conversation deleted' });
            this.router.navigate(['/']);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        }
    });
}

updateImageSource(inputValue: string): void {
  this.isInputEmpty = !inputValue.trim();
  if (!this.isInputEmpty) {
    // Input is not empty
    this.inputImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4klEQVR4nO3WoU5DQRCF4S8BKnBcicHX1hDeAdMEgUHiCK9wDQm2Ekd4BQxJbWWTCiToK4qrwlwWM4LgaNPZkPQkR6z6d2d3zww7VVCjkloscIWDbHAJd7E+ygaX8AoTnGSDS7jHM06zweWHZ7jAXja4hN9xi8NscAkvcY/jbHAJf+IJw2xwCX9hivO/JNcZxrjBHR7xgld8rLGJOS6xb0MN4i5HcaLrqNRDfLd5hE//awPdpoG0FXBTq9RtrcfV/rfvtMwOkLfsyJxlNok+uy2usgeBLnv0WdQY9ppM2E6y9A1xTPXuUU3N4AAAAABJRU5ErkJggg==';
  } else {
    // Input is empty
    this.inputImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA+UlEQVR4nO2VQUsDMRCFU5QKgoeCFATBg1AQhEJRT4WCIFZELIVIK+3e9xD2zTx2r/npK4Et7EV0xempD94tmS+8mSTOHfRbkXwNIVzXdd1zFhKRLJnkkuSt975vAthZVdck72OMpyaAljciMlPVcytA1vK8qqpLS0DWxLcoiuLGe39kApDGAD5EZBxCOPkRAOBOVaeq+gzgXUQ+O8DS2oeyLM86xZYiSJtIDklepVgATJqDPDUHWbVGfAvgEcCFKYDkcP8RiXWTpVvhN1UdWYzp3OKibVJv8jwf/Knw3h87kss0jjHG438pvBPJlzTrzjmbD+cg942+AIoyPSk6DPyQAAAAAElFTkSuQmCC';
  }
}


closeSidebar() {
  this.sidebar = false;
}

getChatHistoryNames() {
  this.chatService.getChatHistoryNames().subscribe((data:ChatHistoryItem[]) => {
    this.chatHistory=data;
    console.log(this.chatHistory);
  });
}

deleteChatHistory(uuid: string) {
  this.chatService.deleteChatHistory(uuid).subscribe(() => {
    this.deleteHistoryItem(uuid);
  });
}



setChatuuid(uuid: string): void {
  console.log('uuid', uuid);
  this.chatService.setChatuuid(uuid);
}

getMessages(uuid: string) {
  this.chatService.getChatMessages(uuid);
}


darkModeToggle() {
  this.darkModeService.setDarkmode(!this.darkModeService.getDarkmode());
  localStorage.setItem('darkmode', this.darkModeService.getDarkmode().toString());
  this.isDarkMode = this.darkModeService.getDarkmode();
  console.log(this.isDarkMode);
}


onCreateChat(inputValue: string, uuid: string) {
  this.inputValue = inputValue;
  this.isWaitingForResponse = true;

  this.chatService.getChatuuid(uuid).subscribe(uuid => {
    if (this.router.url === '/') {
      this.createChat();
    }

    this.chatService.sendMessage(this.inputValue, uuid, false).subscribe(
      response => {
        console.log('Message sent successfully:', response);
        this.isWaitingForResponse = false;

      },
      error => {
        console.error('Error sending message:', error);

      }
    );
  });
}

createChat() {
  this.chatService.createChatHistory("New Chat").subscribe((response: any) => {
    const chatId = response.uuid;
    this.router.navigate([`/chat/${chatId}`]);

    // After navigating, send the message using the stored inputValue
    this.chatService.sendMessage(this.inputValue, chatId, false).subscribe(
      response => {
        console.log('Message sent successfully:', response);
      },
      error => {
        console.error('Error sending message:', error);
      }
    );
  });
}





navigateToHome() {
  this.router.navigate(['/']);
}






logout() {
  this.authService.logout();
  this.router.navigate(['/auth']);
}



confirm1(event: Event) {
  this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to logout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.logout();
      },
      reject: () => {

      }
  });
}


initSpeechRecognition() {
  // Check if the browser supports SpeechRecognition
  if ('webkitSpeechRecognition' in window) {
    this.recognition = new webkitSpeechRecognition();

    // Speech recognition settings
    this.recognition.continuous = false; // Set to true if you want continuous speech recognition
    this.recognition.interimResults = false; // Set to true for interim results
    this.recognition.lang = 'en-US'; // Set language if necessary

    // Event triggered when speech recognition service returns result
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.recognizedText = transcript.trim(); // Trim whitespace from recognized text

      this.updateImageSource(this.recognizedText); // Update image based on recognized text

      this.cdr.detectChanges(); // Trigger change detection manually if needed
    };

    // Optional error handling
    this.recognition.onerror = (event: any) => {
      console.error(event.error);
    };
  } else {
    alert("Speech Recognition not supported in this browser.");
  }
}

// Method to start speech recognition
startSpeechRecognition() {
  if (this.recognition) {
    this.recognition.start();
  }
}


}
