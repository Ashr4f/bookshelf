import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { CreateBookComponent } from "./create-book/create-book.component";
import { BookListComponent } from "./book-list/book-list.component";
import { BookItemComponent } from "./book-item/book-item.component";
import { EditBookComponent } from "./edit-book/edit-book.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "books", component: BookListComponent },
  { path: "books/create", component: CreateBookComponent },
  { path: "books/:id", component: BookItemComponent },
  { path: "books/:id/edit", component: EditBookComponent },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
