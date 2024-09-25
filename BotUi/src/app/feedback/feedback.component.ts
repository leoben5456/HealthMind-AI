import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  value!: number;

  constructor(public dialogRef: MatDialogRef<FeedbackComponent>) { } // Adjusted here

  cancel() { 
    this.dialogRef.close();
  }

}
