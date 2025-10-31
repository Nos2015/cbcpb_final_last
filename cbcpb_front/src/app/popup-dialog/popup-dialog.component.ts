import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule],
  templateUrl: './popup-dialog.component.html',
  styleUrl: './popup-dialog.component.scss'
})

export class PopupDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      title: string,
      message: string,
      hasLeftButton:boolean,
      textLeftButton:string,
      hasRightButton:boolean,
      textRightButton:string
    }
  ) { 
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
