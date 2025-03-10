// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    // Initialize with null user (not authenticated)
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Promise<boolean> {
    // For demo purposes, we're using a mock login
    // In a real application, this would authenticate against a backend
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Mock successful login for 'user@example.com' with any password
          if (email === 'user@example.com') {
            const user: User = {
              id: '123456',
              email: email,
              name: 'John Doe',
              denomination: 'Methodist'
            };

            // Update the BehaviorSubject with the user
            this.currentUserSubject.next(user);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }

  register(email: string, password: string, name: string, denomination: string): Promise<boolean> {
    // For demo purposes, we're using a mock registration
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Mock successful registration
          const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            denomination
          };

          // In a real app, you would save this user to your backend
          // Here we just resolve the promise
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }

  logout(): Promise<void> {
    return new Promise((resolve) => {
      // Update the current user subject to null
      this.currentUserSubject.next(null);
      resolve();
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
