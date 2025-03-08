// src/app/services/user.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';


export interface Activity {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: Date;
  iconClass: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // Update with your API URL

  constructor(private http: HttpClient) {
  }

  getUserActivities(userId: string): Observable<Activity[]> {
    // For initial testing without a backend
    if (this.apiUrl === 'http://localhost:8000/api') {
      console.log('API not available, using mock activities data');
      return of(this.getMockActivities(userId));
    }

    return this.http.get<Activity[]>(`${this.apiUrl}/users/${userId}/activities`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user activities', error);
          return of([]);
        })
      );
  }

  // Mock data for testing
  private getMockActivities(userId: string): Activity[] {
    return [
      {
        id: '1',
        userId: userId,
        title: 'Account Created',
        description: 'User account was created',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        iconClass: 'fa-user-plus',
        type: 'account'
      },
      {
        id: '2',
        userId: userId,
        title: 'Profile Updated',
        description: 'User profile information was updated',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        iconClass: 'fa-user-edit',
        type: 'profile'
      },
      {
        id: '3',
        userId: userId,
        title: 'Logged In',
        description: 'User logged into the application',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        iconClass: 'fa-sign-in-alt',
        type: 'auth'
      }
    ];
  }
}
