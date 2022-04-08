import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Categories, CategoriesService } from "@pet-shop/products";
import { ConfirmationService, MessageService } from "primeng/api";

@Component({
  selector: "admin-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.scss"]
})
export class CategoriesFormComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});
  idCategoria : number;
  editMode  = false;

  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoriesService,
    private route: Router,
    private active: ActivatedRoute,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: ["", Validators.required],
      icon: ["", Validators.required],
      color: ["", Validators.required]
    });

    this.active.queryParams.subscribe(params=>{
      this.idCategoria = params["idCategoria"];
      if(this.idCategoria){
        this.editMode = true;

        this.categoryService.getCategory(this.idCategoria).subscribe((retorno)=>{
          const categoria = retorno.categoria;

          this.myForm.setValue({
            name : categoria.name,
            icon : categoria.icon,
            color: categoria.color
          });
        });
      }
    });

  }


  submit() {

    if (this.formControl["name"].errors != null) {

      this.messageService.add({ severity: "warn", summary: "Atenção", detail: "O campo nome está errado" });
      return;
    }

    

      this.confirmationService.confirm({
        message: !this.editMode? "Tem certeza que deseja salvar essa categoria?" : "Tem certeza que deseja atualizar essa categoria?",
        accept: () => {
          const categoria: Categories = {
            name: this.formControl["name"].value,
            icon: this.formControl["icon"].value,
            color: this.formControl["color"].value
          };
          
          this.messageService.clear();

          this.editMode? 
          this.categoryService.updateCategory(this.idCategoria, categoria).subscribe(retorno =>{
            
            this.configureMessage(retorno);
            
            }, error => {
              console.log(error);
              this.messageService.add({
                key: "error", severity: "error",
                summary: "Erro", detail: "Não foi possível atualizar a categoria"
              });
            }
          )
          : 
          this.categoryService.addCategory(categoria).subscribe(retorno => {
            
            
            this.configureMessage(retorno);

          }, error => {
            console.log(error);
            this.messageService.add({
              key: "error", severity: "error",
              summary: "Erro", detail: "Não foi possível salvar a categoria"
            });
          });
        }
      });
    



  }

  private configureMessage(retorno :any){
    this.messageService.add({
      key: "success",
      severity: "success",
      summary: "Sucesso",
      detail: `Categoria ${this.editMode? retorno.retorno.name : retorno.retornoCategoria.name} 
              ${this.editMode?" Atualizada":" Salva"} com sucesso!`
    });
    
    setTimeout(() => {
      this.route.navigate(["../"], { relativeTo: this.active });
    }, 800);
    this.myForm.reset();

  }

  get formControl() {

    return this.myForm.controls;
  }
}
