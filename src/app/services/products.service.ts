import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { retry } from 'rxjs';
import { enviroment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${enviroment.API_URL}/api/products`

  constructor(private http: HttpClient) { }

  getAllProducts(limit?: number, offset? : number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, {params})
    .pipe (
      retry(3) // realiza 3 peticiones si la url esta dañada o hay poca conexion
    )
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: {limit, offset}
    })
  }

  create(dto : CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto); 
  }

  detele(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }

}
