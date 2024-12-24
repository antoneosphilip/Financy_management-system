import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface SignupResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    department: string;
    status: string;
    permissions: string[];
    createdAt: string;
  };
  token: string;
}

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css',
  standalone: true
})
export class SignupComponent implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';
  department: string = '';
  role: string = '';
  errorMessage: string | undefined = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onSignup(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';
  
      const response = await this.authService.register(
        this.email, 
        this.password,
        this.username,
        this.department,
        this.role
      ).toPromise();
      
      const signupResponse = response as SignupResponse;
  
      // تخزين التوكن
      localStorage.setItem('token', signupResponse.token);
      
      // تخزين معلومات المستخدم
      localStorage.setItem('user', JSON.stringify(signupResponse.user));
      
      // يمكنك أيضًا تخزين أجزاء محددة من معلومات المستخدم بشكل منفصل إذا كنت تحتاجها بشكل متكرر
      localStorage.setItem('userId', signupResponse.user._id);
      localStorage.setItem('userRole', signupResponse.user.role);
      localStorage.setItem('userStatus', signupResponse.user.status);
      localStorage.setItem('userDepartment', signupResponse.user.department);
  
      // التوجيه إلى لوحة التحكم
      this.router.navigate(['/navBar'],{replaceUrl:true});
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
    } finally {
      console.log("tokeen");
      console.log(localStorage.getItem('token'));
      this.isLoading = false;
    }
  }
}