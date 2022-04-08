import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {  RouterModule, Routes } from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ShellComponent } from "./shared/shell/shell.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { CategoriesListComponent } from "./categories/categories-list/categories-list.component";

import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";
import {ColorPickerModule} from "primeng/colorpicker";

import { CategoriesService } from "@pet-shop/products";
import { CategoriesFormComponent } from "./categories/categories-form/categories-form.component";
import {  FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";

const routes : Routes = [
    {path:"", component:ShellComponent, children:
    [
        {
            path:"dashboard", component:DashboardComponent
        },
        {
            path:"categorias", component:CategoriesListComponent
        },
        {
            path:"categorias/form", component:CategoriesFormComponent
        }
    ]}
];


@NgModule({
    declarations: [AppComponent, ShellComponent, SidebarComponent, CategoriesListComponent, CategoriesFormComponent],
    imports: [
        BrowserModule,
        HttpClientModule, 
        RouterModule.forRoot(routes, {initialNavigation:"enabled"}),
        CardModule,
        ToolbarModule,
        ButtonModule,
        ToastModule,
        TableModule,
        ConfirmDialogModule,
        BrowserAnimationsModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        MessagesModule,
        MessageModule
    ],
    
    providers: [CategoriesService, MessageService, ConfirmationService],
    bootstrap: [AppComponent],
})

export class AppModule {}
