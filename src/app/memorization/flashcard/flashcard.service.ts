// src/app/memorization/flashcards/flashcards.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

export interface Flashcard {
  id?: number;
  front_content: string;
  back_content: string;
  difficulty: number;
  verses: ScriptureReference[];
  tags: string[];
  lastReviewed?: Date;
  nextReviewDate?: Date;
}

export interface ScriptureReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface StudySession {
  date: Date;
  cardsStudied: number;
  timeSpent: number; // in seconds
}

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {
  private apiUrl = '/api/flashcards'; // Replace with your API endpoint
  private mockDelay = 300; // Milliseconds delay for mock data

  // Sample data for testing when no backend is available
  private sampleFlashcards: Flashcard[] = [
    {
      id: 1,
      front_content: "What does John 3:16 say?",
      back_content: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      difficulty: 2,
      verses: [{ book: "John", chapter: 3, verse: 16 }],
      tags: ["Gospel", "Salvation"],
      lastReviewed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
      id: 2,
      front_content: "Recite the beginning of Psalm 23",
      back_content: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
      difficulty: 3,
      verses: [
        { book: "Psalms", chapter: 23, verse: 1 },
        { book: "Psalms", chapter: 23, verse: 2 },
        { book: "Psalms", chapter: 23, verse: 3 }
      ],
      tags: ["Psalms", "Comfort"],
      lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      id: 3,
      front_content: "What is the fruit of the Spirit according to Galatians 5:22-23?",
      back_content: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
      difficulty: 4,
      verses: [
        { book: "Galatians", chapter: 5, verse: 22 },
        { book: "Galatians", chapter: 5, verse: 23 }
      ],
      tags: ["Fruit of the Spirit", "Christian Life"],
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: 4,
      front_content: "What did Jesus say is the greatest commandment?",
      back_content: "Love the Lord your God with all your heart and with all your soul and with all your mind. This is the first and greatest commandment. And the second is like it: Love your neighbor as yourself.",
      difficulty: 2,
      verses: [
        { book: "Matthew", chapter: 22, verse: 37 },
        { book: "Matthew", chapter: 22, verse: 38 },
        { book: "Matthew", chapter: 22, verse: 39 }
      ],
      tags: ["Commandments", "Love"],
      lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get all flashcards
   */
  getFlashcards(): Observable<Flashcard[]> {
    // When connecting to a real backend:
    // return this.http.get<Flashcard[]>(this.apiUrl)
    //   .pipe(
    //     catchError(this.handleError<Flashcard[]>('getFlashcards', []))
    //   );

    // For now, return mock data with simulated delay
    return of(this.sampleFlashcards).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Get a specific flashcard by ID
   */
  getFlashcard(id: number): Observable<Flashcard> {
    // When connecting to a real backend:
    // return this.http.get<Flashcard>(`${this.apiUrl}/${id}`)
    //   .pipe(
    //     catchError(this.handleError<Flashcard>(`getFlashcard id=${id}`))
    //   );

    // For now, return mock data with simulated delay
    const card = this.sampleFlashcards.find(c => c.id === id);
    return of(card as Flashcard).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Create a new flashcard
   */
  createFlashcard(flashcard: Flashcard): Observable<Flashcard> {
    // When connecting to a real backend:
    // return this.http.post<Flashcard>(this.apiUrl, flashcard)
    //   .pipe(
    //     catchError(this.handleError<Flashcard>('createFlashcard'))
    //   );

    // For now, simulate creating in mock data
    const newId = Math.max(0, ...this.sampleFlashcards.map(c => c.id || 0)) + 1;
    const newCard = { ...flashcard, id: newId };
    this.sampleFlashcards.push(newCard);

    return of(newCard).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Update an existing flashcard
   */
  updateFlashcard(flashcard: Flashcard): Observable<Flashcard> {
    // When connecting to a real backend:
    // return this.http.put<Flashcard>(`${this.apiUrl}/${flashcard.id}`, flashcard)
    //   .pipe(
    //     catchError(this.handleError<Flashcard>('updateFlashcard'))
    //   );

    // For now, simulate updating in mock data
    const index = this.sampleFlashcards.findIndex(c => c.id === flashcard.id);
    if (index !== -1) {
      this.sampleFlashcards[index] = flashcard;
    }

    return of(flashcard).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Delete a flashcard
   */
  deleteFlashcard(id: number): Observable<void> {
    // When connecting to a real backend:
    // return this.http.delete<void>(`${this.apiUrl}/${id}`)
    //   .pipe(
    //     catchError(this.handleError<void>('deleteFlashcard'))
    //   );

    // For now, simulate deleting from mock data
    const index = this.sampleFlashcards.findIndex(c => c.id === id);
    if (index !== -1) {
      this.sampleFlashcards.splice(index, 1);
    }

    return of(void 0).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Get study history
   */
  getStudyHistory(): Observable<StudySession[]> {
    // When connecting to a real backend:
    // return this.http.get<StudySession[]>(`${this.apiUrl}/study-history`)
    //   .pipe(
    //     catchError(this.handleError<StudySession[]>('getStudyHistory', []))
    //   );

    // For now, return mock data with simulated delay
    const mockSessions: StudySession[] = [
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        cardsStudied: 10,
        timeSpent: 450 // 7.5 minutes
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        cardsStudied: 15,
        timeSpent: 600 // 10 minutes
      }
    ];

    return of(mockSessions).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Save a study session
   */
  saveStudySession(session: StudySession): Observable<StudySession> {
    // When connecting to a real backend:
    // return this.http.post<StudySession>(`${this.apiUrl}/study-history`, session)
    //   .pipe(
    //     catchError(this.handleError<StudySession>('saveStudySession'))
    //   );

    // For now, just return the session with simulated delay
    return of(session).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Get cards due for review today
   */
  getCardsForDailyReview(): Observable<Flashcard[]> {
    // When connecting to a real backend:
    // return this.http.get<Flashcard[]>(`${this.apiUrl}/daily-review`)
    //   .pipe(
    //     catchError(this.handleError<Flashcard[]>('getCardsForDailyReview', []))
    //   );

    // For now, simulate spaced repetition logic
    const today = new Date();
    const dueCards = this.sampleFlashcards.filter(card => {
      // Include cards that don't have a next review date
      if (!card.nextReviewDate) return true;

      // Include cards due today or earlier
      return card.nextReviewDate <= today;
    });

    // Sort by difficulty (hardest first)
    const sortedCards = [...dueCards].sort((a, b) => b.difficulty - a.difficulty);

    return of(sortedCards).pipe(
      delay(this.mockDelay)
    );
  }

  /**
   * Error handler for HTTP requests
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
