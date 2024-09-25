import { Component, Inject, OnInit } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ChatService } from '../services/chat.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent  {
  chatuuid: string = '';

  //getting the chatuuid from the data object that passed from url in main component
  constructor(private clipboard: Clipboard,private chatService:ChatService,@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('UUID:', data.uuid);
    this.chatuuid = data.uuid;
  }

  //function to copy the link to clipboard
  copyLink() {
    const linkInput = document.getElementById('linkInput') as HTMLInputElement;
    if (linkInput) {
      this.clipboard.copy(linkInput.value);
      alert('Link copied to clipboard!');
    }
  }





}
