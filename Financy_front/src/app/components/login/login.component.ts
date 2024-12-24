import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface LoginResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    department: string;
    status: string;
    permissions: string[];
    createdAt: string;
    lastLogin: string;
  };
  token: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | undefined = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  navigateToSign() {
    this.router.navigate(['/sign']);
  }

  async onLogin(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const response = await this.authService.login(this.email, this.password).toPromise();
      const loginResponse = response as LoginResponse;

      // Store the token
      localStorage.setItem('token', loginResponse.token);
      
      // Store user info if needed
      localStorage.setItem('user', JSON.stringify(loginResponse.user));
      
      // يمكنك أيضًا تخزين أجزاء محددة من معلومات المستخدم بشكل منفصل إذا كنت تحتاجها بشكل متكرر
      localStorage.setItem('userId', loginResponse.user._id);
      localStorage.setItem('userRole', loginResponse.user.role);
      localStorage.setItem('userStatus', loginResponse.user.status);
      localStorage.setItem('userDepartment', loginResponse.user.department);
      // Navigate to dashboard
      this.router.navigate(['/navBar'],{replaceUrl:true});
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Login failed. Please try again.';
    } finally {
      console.log("tokeen");
      console.log(localStorage.getItem('token'));
      this.isLoading = false;
    }
  }
}