import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './../../filter.pipe';
import { HttpClient, HttpHeaders } from '@angular/common/http';



interface ReportData {
  _id: string;
  totalAmount: number;
  count: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  imports: [CurrencyPipe, CommonModule, FormsModule, FilterPipe]
})
export class ReportsComponent implements OnInit {
  searchTerm: string = '';
  reports: ReportData[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getReports();
  }

  getReports() {
    this.loading = true;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders().set ('Authorization', `Bearer ${token}`);

    this.http.get<ReportData[]>('https://finance-system.koyeb.app/api/bonus/report/monthly?month=12&year=2024', {headers})
      .subscribe({
        next: (data) => {
          this.reports = data;
          this.loading = false;
          console.log("sucess");
        },
        error: (err) => {
          console.log("sucess");
          this.error = 'Failed to load report data';
          this.loading = false;
          console.error('Error:', err);
        }
      });
  }
}