import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardsService } from "./guards/auth-guards.service";

import { ProfileComponent } from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { CreateBookComponent } from "./create-book/create-book.component";
import { BookListComponent } from "./book-list/book-list.component";
import { BookItemComponent } from "./book-item/book-item.component";
import { EditBookComponent } from "./edit-book/edit-book.component";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuardsService]
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "books",
    component: BookListComponent,
    canActivate: [AuthGuardsService]
  },
  {
    path: "books/create",
    component: CreateBookComponent,
    canActivate: [AuthGuardsService]
  },
  {
    path: "books/:id",
    component: BookItemComponent,
    canActivate: [AuthGuardsService]
  },
  {
    path: "books/:id/edit",
    component: EditBookComponent,
    canActivate: [AuthGuardsService]
  },
  {
    path: "**",
    component: NotFoundComponent,
    canActivate: [AuthGuardsService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
