import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Categories, CategoriesService } from "@pet-shop/products";
import { Message, MessageService } from "primeng/api";

@Component({
  selector: "admin-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.scss"]
})
export class CategoriesFormComponent implements OnInit {
  
  myForm: FormGroup = new FormGroup({});
  categoria : Categories;

  constructor(private formBuilder: FormBuilder, 
              private messageService: MessageService, 
              private categoryService : CategoriesService) { }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      name: ["", Validators.required],
      icon: ["", Validators.required]
    });
    
 
  }


  submit() {

    if(this.formControl["name"].errors != null){

      this.messageService.add({severity: "warn", summary: "Atenção", detail: "O campo nome está errado"});
      return;
    }
    
    this.categoria = {name: this.formControl["name"].value,
                      icon: this.formControl["icon"].value};

    this.categoryService.addCategory(this.categoria).subscribe(retorno =>{
      this.messageService.clear();
      
      this.messageService.add({key:"success", severity:"success", summary: "Sucesso", detail: `Categoria ${retorno.retornoCategoria.name}
                              salva com sucesso!`});
    }, error=>{

    });


    
    this.myForm.reset();
  }


  get formControl(){

    return this.myForm.controls;
  }
}
