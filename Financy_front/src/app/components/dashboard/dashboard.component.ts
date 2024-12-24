import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrencyPipe, CommonModule } from '@angular/common';

interface BonusRequest {
  _id: string;
  title: string;
  reason: string;
  amount: number;
  status: string;
  submissionDate: string;
  processedDate?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CurrencyPipe, CommonModule]
})
export class DashboardComponent implements OnInit {
  bonusRequests: BonusRequest[] = [];
  totalBonuses: number = 0;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const url = 'https://finance-system.koyeb.app/api/bonus/monthly?month=12&year=2024';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    
    this.http.get<BonusRequest[]>(url, { headers }).subscribe({
      next: (data) => {
        this.bonusRequests = data.filter(request => request.status !== 'pending');
        this.totalBonuses = this.bonusRequests
          .filter(request => request.status === 'approved')
          .reduce((sum, request) => sum + request.amount, 0);
      },
      error: (error) => console.error('Error:', error)
    });
  }

  initiatePayment(bonusId: string) {
    const url = 'https://finance-system.koyeb.app/api/payment/payment';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const body = { bonusRequestId: bonusId };

    this.http.post<{ redirectUrl: string }>(url, body, { headers }).subscribe({
      next: (response) => {
        window.open(response.redirectUrl, '_blank');
      },
      error: (error) => console.error('Payment error:', error)
    });
  }

  getStatusClass(status: string): string {
    return {
      approved: 'badge bg-success',
      rejected: 'badge bg-danger'
    }[status.toLowerCase()] || 'badge bg-secondary';
  }
}