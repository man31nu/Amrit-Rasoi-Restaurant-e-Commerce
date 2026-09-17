import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  updateProduct(id: string, data: FormData | Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
