import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  form = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    phone: [""],
    upiId: [""],
  });
  error = "";
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
  submit() {
    this.error = "";
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(["/login"]),
      error: (err) => (this.error = err.error?.message || "Register failed"),
    });
  }
}
