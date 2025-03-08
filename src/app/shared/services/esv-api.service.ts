// src/app/services/esv-api.service.ts
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

export interface ESVPassageOptions {
  'include-passage-references'?: boolean;
  'include-verse-numbers'?: boolean;
  'include-first-verse-numbers'?: boolean;
  'include-footnotes'?: boolean;
  'include-footnote-body'?: boolean;
  'include-headings'?: boolean;
  'include-short-copyright'?: boolean;
  'include-copyright'?: boolean;
  'include-passage-horizontal-lines'?: boolean;
  'include-heading-horizontal-lines'?: boolean;
  'horizontal-line-length'?: number;
  'indent-using'?: 'space' | 'tab';
  'indent-paragraphs'?: number;
  'indent-poetry'?: boolean;
  'indent-poetry-lines'?: number;
  'indent-declares'?: number;
  'indent-psalm-doxology'?: number;
  'line-length'?: number;
  'include-selahs'?: boolean;
}

export interface ESVPassageResponse {
  query: string;
  canonical: string;
  parsed: number[][];
  passage_meta: {
    canonical: string;
    chapter_start: number[];
    chapter_end: number[];
    prev_verse: number;
    next_verse: number;
    prev_chapter: number[];
    next_chapter: number[];
  }[];
  passages: string[];
}

export interface PassageData {
  reference: string;
  rawText: string;
  cleanText: string;
  verseRange?: number[][];
  meta?: any;
}

interface CacheEntry {
  data: ESVPassageResponse;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class EsvApiService {
  private apiUrl = 'https://api.esv.org/v3/passage/text/';
  private apiKey = ''; // Will be set via setApiKey method
  private cache = new Map<string, CacheEntry>();
  private cacheExpirationMs = 24 * 60 * 60 * 1000; // 24 hours
  // Default options for ESV API
  private defaultOptions: ESVPassageOptions = {
    'include-passage-references': true,
    'include-verse-numbers': true,
    'include-first-verse-numbers': true,
    'include-footnotes': false,
    'include-footnote-body': false,
    'include-headings': true,
    'include-short-copyright': true,
    'include-copyright': false,
    'include-passage-horizontal-lines': false,
    'include-heading-horizontal-lines': false,
    'indent-paragraphs': 2,
    'indent-poetry': true,
    'line-length': 0
  };

  constructor(private http: HttpClient) {
  }

  /**
   * Set the API key for the ESV API
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Configure cache expiration time
   */
  setCacheExpiration(milliseconds: number): void {
    this.cacheExpirationMs = milliseconds;
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Fetch a passage from the ESV API
   * @param passage - The Bible reference to fetch (e.g., "John 3:16", "Psalm 23")
   * @param options - Optional parameters to customize the passage formatting
   * @returns Observable with the ESV API response
   */
  fetchPassage(passage: string, options: ESVPassageOptions = {}): Observable<ESVPassageResponse> {
    if (!this.apiKey) {
      return this.handleError<ESVPassageResponse>('fetchPassage')('API key not set');
    }

    const cacheKey = this.createCacheKey(passage, options);
    const cachedResponse = this.getFromCache(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Merge default options with provided options
    const mergedOptions = {...this.defaultOptions, ...options};

    // Build HTTP params
    let params = new HttpParams().set('q', passage);

    // Add all options to params
    Object.entries(mergedOptions).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });

    // Set up headers with authorization
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.apiKey}`
    });

    return this.http.get<ESVPassageResponse>(this.apiUrl, {headers, params}).pipe(
      tap(response => this.addToCache(cacheKey, response)),
      catchError(this.handleError<ESVPassageResponse>('fetchPassage', 'Error fetching passage'))
    );
  }

  /**
   * Process the passage for memorization by extracting just verse text
   */
  processPassageForMemorization(passage: ESVPassageResponse): PassageData {
    if (!passage || !passage.passages || passage.passages.length === 0) {
      return {
        reference: '',
        rawText: '',
        cleanText: ''
      };
    }

    const rawText = passage.passages[0];
    let cleanText = rawText;

    // Remove the reference header line
    cleanText = cleanText.split('\n\n').slice(1).join('\n\n');

    // Remove verse numbers
    cleanText = cleanText.replace(/\[\d+]/g, '');

    // Remove ESV copyright
    cleanText = cleanText.replace(/\(ESV\)$/, '');

    // Clean up extra whitespace
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    return {
      reference: passage.canonical,
      rawText,
      cleanText,
      verseRange: passage.parsed,
      meta: passage.passage_meta
    };
  }

  /**
   * Create a presets for various use cases
   */
  getPresets(): { [key: string]: ESVPassageOptions } {
    return {
      memorization: {
        'include-passage-references': false,
        'include-verse-numbers': false,
        'include-first-verse-numbers': false,
        'include-footnotes': false,
        'include-headings': false,
        'include-short-copyright': false
      },
      study: {
        'include-passage-references': true,
        'include-verse-numbers': true,
        'include-first-verse-numbers': true,
        'include-footnotes': true,
        'include-footnote-body': true,
        'include-headings': true,
        'include-short-copyright': true
      },
      reading: {
        'include-passage-references': true,
        'include-verse-numbers': false,
        'include-first-verse-numbers': false,
        'include-footnotes': false,
        'include-headings': true,
        'include-short-copyright': true
      }
    };
  }

  // PRIVATE HELPER METHODS

  /**
   * Create a cache key based on the passage and options
   */
  private createCacheKey(passage: string, options: ESVPassageOptions): string {
    return `${passage}|${JSON.stringify(options)}`;
  }

  /**
   * Get response from cache if available and not expired
   */
  private getFromCache(key: string): ESVPassageResponse | null {
    if (!this.cache.has(key)) {
      return null;
    }

    const entry = this.cache.get(key)!;
    const now = Date.now();

    // Check if entry has expired
    if (now - entry.timestamp > this.cacheExpirationMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Add response to cache
   */
  private addToCache(key: string, data: ESVPassageResponse): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now()
    };

    this.cache.set(key, entry);

    // Optional: Implement cache size limits if needed
    this.limitCacheSize(100); // Limit to 100 entries
  }

  /**
   * Limit cache size by removing oldest entries
   */
  private limitCacheSize(maxSize: number): void {
    if (this.cache.size <= maxSize) {
      return;
    }

    // Sort entries by timestamp (oldest first)
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest entries
    const toRemove = entries.slice(0, this.cache.size - maxSize);
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  /**
   * Handle HTTP operation failures
   */
  private handleError<T>(operation = 'operation', message?: string) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      // Return custom error message or the actual error
      const errorMessage = message || error.message || 'Unknown error';

      // Let the app keep running by returning an empty result
      return new Observable(subscriber => {
        subscriber.error(new Error(errorMessage));
      });
    };
  }
}
