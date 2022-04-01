
import { Component, OnInit } from "@angular/core";
import {  Categories, CategoriesService } from "@pet-shop/products";





@Component({
  selector: "admin-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrls: ["./categories-list.component.scss"]
})

export class CategoriesListComponent implements OnInit {

  categories : Categories[] = [];

  constructor(private categoryService : CategoriesService) { }

  ngOnInit(): void {

      this.categoryService.get().subscribe(resultado=>{
        this.categories = resultado.categorias;
      });
  }

}
