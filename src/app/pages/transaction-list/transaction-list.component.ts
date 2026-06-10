import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TransactionService } from "../../services/transaction.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-transaction-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./transaction-list.component.html",
  styleUrls: ["./transaction-list.component.css"],
})
export class TransactionListComponent {
  transactions: any[] = [];
  loading = false;
  constructor(private tx: TransactionService, private router: Router) {
    this.load();
  }
  load() {
    this.loading = true;
    this.tx.getTransactions().subscribe({
      next: (res: any) => {
        this.transactions = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
  edit(transaction: any) {
    this.router.navigate(["/edit-transaction", transaction._id], {
      state: { transaction },
    });
  }
  del(id: string) {
    if (confirm("Are you sure you want to delete this transaction?")) {
      this.tx.deleteTransaction(id).subscribe({ next: () => this.load() });
    }
  }
}
