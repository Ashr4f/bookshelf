import { Component, Input, OnInit } from "@angular/core";
import { Book } from "../types";

@Component({
  selector: "hn-book-item",
  templateUrl: "./book-item.component.html",
  styleUrls: ["./book-item.component.scss"]
})
export class BookItemComponent implements OnInit {
  @Input()
  book: Book;

  constructor() {}

  ngOnInit() {}

  voteForBook = async () => {
    // ... you'll implement this in chapter 6
  };
}
