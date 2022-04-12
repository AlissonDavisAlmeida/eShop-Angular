import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories } from '../../interfaces/Category';
import { HttpClient } from "@angular/common/http"

import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  get(): Observable<{ categorias: Categories[] }> {
    return this.http.get<{ categorias: Categories[] }>(`${environment.apiUrlCategory}categorias`)
  }

  getCategory(idCategoria: number): Observable<{ categoria: Categories }> {
    return this.http.get<{ categoria: Categories }>(`${environment.apiUrlCategory}categorias/${idCategoria}`)
  }

  addCategory(categoria: Categories): Observable<{ mensagem: string, retornoCategoria: Categories }> {
    return this.http.post<{ mensagem: string, retornoCategoria: Categories }>(`${environment.apiUrlCategory}categorias`, {
      ...categoria
    })
  }

  updateCategory(idCategoria: number, categoria: Categories): Observable<{ mensagem: string, retorno: Categories }> {
    return this.http.put<{ mensagem: string, retorno: Categories }>(`${environment.apiUrlCategory}categorias/${idCategoria}`, { ...categoria })
  }

  removeCategory(id: number): Observable<{ mensagem: string, categoria: Categories }> {

    return this.http.delete<{ mensagem: string, categoria: Categories }>(`${environment.apiUrlCategory}categorias/${id}`)
  }
}
