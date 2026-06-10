import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { TransactionService } from "../../services/transaction.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-add-transaction",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./add-transaction.component.html",
  styleUrls: ["./add-transaction.component.css"],
})
export class AddTransactionComponent {
  form = this.fb.group({
    friendName: ["", [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [""],
    note: [""],
  });
  error = "";
  constructor(
    private fb: FormBuilder,
    private tx: TransactionService,
    private router: Router
  ) {}
  submit() {
    this.error = "";
    this.tx.addTransaction(this.form.value).subscribe({
      next: () => this.router.navigate(["/transactions"]),
      error: (err) => (this.error = err.error?.message || "Failed"),
    });
  }
}
