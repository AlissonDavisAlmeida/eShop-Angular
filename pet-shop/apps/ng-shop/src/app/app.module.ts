import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {  RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ProductListComponent } from "./pages/product-list/product-list.component";

//Componentes do diretório shared
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";

//Módulos compartilhados na biblioteca
import { UiModule } from "@pet-shop/ui";

const routes : Routes = [
  {path: "", component: HomePageComponent},
  {path:"product", component: ProductListComponent}
];

@NgModule({
  declarations: [AppComponent, HomePageComponent, ProductListComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, 
            RouterModule.forRoot(routes),
            UiModule
          ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
