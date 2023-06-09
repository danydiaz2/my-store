import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { catchError, map, retry, throwError } from 'rxjs';
import { enviroment } from 'src/enviroment/enviroment';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${enviroment.API_URL}/api`

  constructor(private http: HttpClient) { }

  getByCategory (categoryId: string, limit?: number, offset? : number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, {params})
  }

  getAllProducts(limit?: number, offset? : number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {params, context: checkTime()})
    .pipe (
      retry(3) // realiza 3 peticiones si la url esta dañada o hay poca conexion
    )
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
    .pipe(
      catchError((error : HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo esta fallando en el servidor')
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe')
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas permitido')
        }
        return throwError('Ups algo salió mal')
      })
    )
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: {limit, offset}
    })
    .pipe(
      map(products => products.map(item => {
        return{
          ...item,
          taxes: .19*item.price
        }
      }))
    )
  }

  create(dto : CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto); 
  }

  detele(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
  }

}
