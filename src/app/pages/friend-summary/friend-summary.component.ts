import { Component } from "@angular/core";
import { TransactionService } from "../../services/transaction.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-friend-summary",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./friend-summary.component.html",
  styleUrls: ["./friend-summary.component.css"],
})
export class FriendSummaryComponent {
  friends: any[] = [];
  loading = false;
  constructor(private tx: TransactionService) {
    this.load();
  }
  load() {
    this.loading = true;
    this.tx.getFriendSummary().subscribe({
      next: (res: any) => {
        this.friends = res;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
