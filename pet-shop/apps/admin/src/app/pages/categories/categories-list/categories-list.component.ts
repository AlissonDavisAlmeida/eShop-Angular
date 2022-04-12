
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Categories, CategoriesService } from "@pet-shop/products";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "admin-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrls: ["./categories-list.component.scss"]
})

export class CategoriesListComponent implements OnInit{

  categories: Categories[] = [];
 
  
  constructor(private categoryService: CategoriesService, 
              private confirmationService: ConfirmationService, 
              private messageService: MessageService,
              private route : Router,
              private activeRoute : ActivatedRoute) { }


 

  ngOnInit(): void {

    this.getCategories();
  }

  goToEditForm(idCategoria : number): void {
    console.log(idCategoria);
    this.route.navigate(["form"], {relativeTo:this.activeRoute, queryParams:{idCategoria}});
  }

  removeCategory(idCategoria: number) {
    console.log(idCategoria);

    this.confirmationService.confirm({
      message: "Tem certeza que deseja remover essa categoria?",
      accept: () => {
       this.categoryService.removeCategory(idCategoria).subscribe(retorno => {
          this.messageService.clear();

          this.messageService.add({
            key: "success",
            severity: "success",
            summary: "Sucesso",
            detail: `${retorno.mensagem}`
          });

          this.getCategories();


        }, erro => {
          this.messageService.add({
            key: "error", severity: "error",
            summary: "Erro", detail: "Não foi possível salvar a categoria"
          }); 
        });
      }
    });
  }

  getCategories(){
    this.categoryService.get().subscribe(resultado => {
      this.categories = resultado.categorias;
    });
  }

}
