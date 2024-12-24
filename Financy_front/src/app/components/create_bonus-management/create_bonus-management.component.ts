import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-bonus-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bonus-form">
      <h2>Create Bonus</h2>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <form [formGroup]="bonusForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title:</label>
          <input id="title" type="text" formControlName="title">
          <div *ngIf="bonusForm.get('title')?.errors?.['required'] && bonusForm.get('title')?.touched">
            Title is required
          </div>
        </div>

        <div class="form-group">
          <label for="reason">Reason:</label>
          <textarea id="reason" formControlName="reason"></textarea>
          <div *ngIf="bonusForm.get('reason')?.errors?.['required'] && bonusForm.get('reason')?.touched">
            Reason is required
          </div>
        </div>

        <div class="form-group">
          <label for="amount">Amount:</label>
          <input id="amount" type="number" formControlName="amount">
          <div *ngIf="bonusForm.get('amount')?.errors?.['required'] && bonusForm.get('amount')?.touched">
            Amount is required
          </div>
        </div>

        <div class="form-group">
          <label for="userId">User ID:</label>
          <input id="userId" type="text" formControlName="userId">
          <div *ngIf="bonusForm.get('userId')?.errors?.['required'] && bonusForm.get('userId')?.touched">
            User ID is required
          </div>
        </div>

        <div class="form-group">
          <label for="file">File:</label>
          <input 
            id="file" 
            type="file" 
            (change)="onFileSelected($event)"
            accept=".pdf,.doc,.docx">
        </div>

        <button type="submit" [disabled]="!bonusForm.valid">Submit</button>
      </form>
    </div>
  `,
  styles: [`
    .bonus-form {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input, textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    textarea {
      height: 100px;
    }
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
    .alert-success {
      margin: 10px 0;
      padding: 10px;
      color: #155724;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
    }
  `]
})
export class CreateBonusManagementComponent {
  bonusForm: FormGroup;
  selectedFile: File | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.bonusForm = this.fb.group({
      title: ['', Validators.required],
      reason: ['', Validators.required],
      amount: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    if (this.bonusForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.bonusForm.get('title')?.value);
      formData.append('reason', this.bonusForm.get('reason')?.value);
      formData.append('amount', this.bonusForm.get('amount')?.value);
      formData.append('userId', this.bonusForm.get('userId')?.value);
      formData.append('file', this.selectedFile);

      this.http.post('https://finance-system.koyeb.app/api/bonus', formData, { headers })
        .subscribe({
          next: (response) => {
            this.successMessage = 'Bonus created successfully!';
            this.bonusForm.reset();
            this.selectedFile = null;

            // Clear the success message after 3 seconds
            setTimeout(() => this.successMessage = null, 3000);
          },
          error: (error) => {
            console.error('Error creating bonus:', error);
          }
        });
    }
  }
}
