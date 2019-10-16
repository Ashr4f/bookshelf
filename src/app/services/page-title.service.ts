import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class PageTitleService {
  public pageTitle: string = "BookShelf";
  constructor(private titleService: Title) {}

  public setPageTitle(value: string) {
    this.pageTitle = value;
    this.titleService.setTitle(this.pageTitle);
  }

  public getPageTitle() {
    return this.pageTitle;
  }
}
