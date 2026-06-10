import { Component } from "@angular/core";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NavComponent } from "./shared/nav.component";
import { AuthService } from "./services/auth.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  currentRoute = "";

  constructor(public auth: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  isAuthPage(): boolean {
    return (
      this.currentRoute === "/login" ||
      this.currentRoute === "/register" ||
      this.currentRoute === "/"
    );
  }
}
