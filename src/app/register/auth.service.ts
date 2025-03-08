// src/app/services/auth.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  email: string;
  name: string;
  denomination: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:8000/api'; // Update with your API URL
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Initialize with null value as default
    let storedUser = null;

    // Only access localStorage in browser environment
    if (this.isBrowser) {
      const storedUserString = localStorage.getItem('currentUser');
      if (storedUserString) {
        try {
          storedUser = JSON.parse(storedUserString);
        } catch (e) {
          console.error('Error parsing stored user', e);
        }
      }
    }

    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Simplified mock login method
  async login(email: string, password: string): Promise<boolean> {
    try {
      // In a real app, this would verify credentials with a backend
      console.log('Mock login attempt with:', email);

      // For testing, accept any login and create a mock user
      const mockUser: User = {
        id: '123',
        email: email,
        name: 'Test User',
        denomination: 'Not specified'
      };

      // Only store in localStorage in browser environment
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      }

      this.currentUserSubject.next(mockUser);

      // Log activity (just for demonstration)
      console.log('Activity logging: User logged in');

      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  }

  // Simplified mock register method
  async register(email: string, password: string, name: string, denomination: string): Promise<boolean> {
    try {
      console.log('Mock registration with:', { email, name, denomination });

      // Create a mock user with a generated ID
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        denomination: denomination
      };

      // Store user locally only in browser environment
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      }

      this.currentUserSubject.next(mockUser);

      // Log activity (just for demonstration)
      console.log('Activity logging: User registered');

      return true;
    } catch (error) {
      console.error('Registration error', error);
      return false;
    }
  }

  // Mock user details retrieval
  async fetchUserDetails(userId: string): Promise<User | null> {
    try {
      console.log('Fetching user details for:', userId);

      // Check if we have a user in localStorage (only in browser)
      if (this.isBrowser) {
        const storedUserString = localStorage.getItem('currentUser');
        if (storedUserString) {
          try {
            const user = JSON.parse(storedUserString);
            if (user.id === userId) {
              return user;
            }
          } catch (e) {
            console.error('Error parsing stored user', e);
          }
        }
      }

      // If we don't have a matching user, return null
      return null;
    } catch (error) {
      console.error('Error fetching user details', error);
      return null;
    }
  }

  // Simplified logout without Firebase
  async logout(): Promise<void> {
    try {
      // Log the logout activity (just for demonstration)
      console.log('Activity logging: User logged out');

      // Clear local user data
      if (this.isBrowser) {
        localStorage.removeItem('currentUser');
      }

      this.currentUserSubject.next(null);

      // Navigate to home
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  // Authentication check
  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  // Mock password reset
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    console.log('Password reset requested for:', email);
    return true;
  }

  // Simplified activity logging
  private logActivity(userId: string, title: string, description: string, type: string): void {
    console.log('Activity logging:', { userId, title, description, type });
  }
}
