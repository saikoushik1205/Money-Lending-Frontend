import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  form = this.fb.group({
    email: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });
  error = "";
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
  submit() {
    this.error = "";
    this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(["/transactions"]),
      error: (err) => (this.error = err.error?.message || "Login failed"),
    });
  }
}
