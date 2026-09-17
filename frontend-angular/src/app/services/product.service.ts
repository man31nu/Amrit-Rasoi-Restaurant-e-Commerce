import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '@models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(filters?: {
    search?: string;
    category?: string;
    sortBy?: string;
    order?: string;
    isVeg?: string;
    spiceLevel?: string;
  }): Observable<Product[]> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category && filters.category !== 'All') params = params.set('category', filters.category);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);
    if (filters?.isVeg && filters.isVeg !== 'all') params = params.set('isVeg', filters.isVeg);
    if (filters?.spiceLevel && filters.spiceLevel !== 'all') params = params.set('spiceLevel', filters.spiceLevel);

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => res.data || res)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res)
    );
  }

  createProduct(data: FormData): Observable<Product> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      map(res => res.data || res)
    );
  }

  updateProduct(id: string, data: FormData | Partial<Product>): Observable<Product> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      map(res => res.data || res)
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res)
    );
  }
}
