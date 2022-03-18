import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {  RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { ProductListComponent } from "./pages/product-list/product-list.component";

//Componentes do diretório shared
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";

//Módulos compartilhados na biblioteca
import { UiModule } from "@pet-shop/ui";

//PrimeNg Components
import {AccordionModule} from "primeng/accordion";
import {MegaMenuModule} from "primeng/megamenu";

const routes : Routes = [
  {path: "", component: HomePageComponent},
  {path:"product", component: ProductListComponent}
];

@NgModule({
  declarations: [AppComponent, HomePageComponent, ProductListComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule,
            BrowserAnimationsModule, 
            RouterModule.forRoot(routes),
            UiModule,
            AccordionModule,
            MegaMenuModule
          ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
