import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { TransactionService } from "../../services/transaction.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-edit-transaction",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./edit-transaction.component.html",
  styleUrls: ["./edit-transaction.component.css"],
})
export class EditTransactionComponent {
  form = this.fb.group({
    friendName: ["", [Validators.required]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    date: [""],
    note: [""],
  });
  error = "";
  transactionId = "";

  constructor(
    private fb: FormBuilder,
    private tx: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transactionId = this.route.snapshot.params["id"];
    this.loadTransaction();
  }

  loadTransaction() {
    const txData = history.state.transaction;
    if (txData) {
      this.form.patchValue({
        friendName: txData.friendName,
        amount: txData.amount,
        date: txData.date
          ? new Date(txData.date).toISOString().split("T")[0]
          : "",
        note: txData.note || "",
      });
    }
  }

  submit() {
    this.error = "";
    this.tx.updateTransaction(this.transactionId, this.form.value).subscribe({
      next: () => this.router.navigate(["/transactions"]),
      error: (err) => (this.error = err.error?.message || "Update failed"),
    });
  }

  cancel() {
    this.router.navigate(["/transactions"]);
  }
}
