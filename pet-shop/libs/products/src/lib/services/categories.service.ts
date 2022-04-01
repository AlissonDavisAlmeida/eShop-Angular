import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categories } from '../../interfaces/Category';
import {HttpClient} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http : HttpClient) { }

  get() : Observable<{categorias: Categories[]}>{
    return this.http.get<{categorias : Categories[]}>("http://localhost:3000/api/v1/categorias")
  }

  addCategory(categoria : Categories):Observable<{mensagem:string, retornoCategoria:Categories}> {
   return  this.http.post<{mensagem:string, retornoCategoria:Categories}>("http://localhost:3000/api/v1/categorias",{
      ...categoria
    })
  } 
}
