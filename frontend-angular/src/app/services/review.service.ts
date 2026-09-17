import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getReviews(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}/reviews`);
  }

  addReview(productId: string, data: { rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${productId}/reviews`, data);
  }
}
