import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Coupon, AppliedCoupon } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/coupons`;

  getAvailableCoupons(): Observable<Coupon[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data || res)
    );
  }

  applyCoupon(code: string, subtotal: number): Observable<AppliedCoupon> {
    return this.http.post<any>(`${this.apiUrl}/apply`, { code, subtotal }).pipe(
      map(res => res.data || res)
    );
  }
}
