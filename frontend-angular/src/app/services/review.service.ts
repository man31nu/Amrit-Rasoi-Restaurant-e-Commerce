import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<any>(`${this.apiUrl}/${productId}/reviews`).pipe(
      map(res => res.data || res)
    );
  }

  addReview(productId: string, data: { rating: number; title?: string; comment: string }): Observable<Review> {
    return this.http.post<any>(`${this.apiUrl}/${productId}/reviews`, data).pipe(
      map(res => res.data || res)
    );
  }
}
