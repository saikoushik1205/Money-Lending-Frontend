import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { TransactionService } from "../../services/transaction.service";
import { BorrowService } from "../../services/borrow.service";

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  stats = {
    totalTransactions: 0,
    totalLent: 0,
    totalBorrowed: 0,
    activeLoans: 0,
    completedLoans: 0,
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private borrowService: BorrowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadUserStats();
  }

  loadUserProfile() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        this.user = {
          email: payload.email,
          userId: payload.userId,
          createdAt: new Date(),
        };
      } catch (e) {
        console.error("Error parsing token", e);
      }
    }
  }

  loadUserStats() {
    this.transactionService.getTransactions().subscribe({
      next: (transactions: any) => {
        const txArray = Array.isArray(transactions) ? transactions : [];
        this.stats.totalTransactions = txArray.length;

        txArray.forEach((tx) => {
          this.stats.totalLent += tx.amount || 0;
          if (tx.status === "active") this.stats.activeLoans++;
          if (tx.status === "repaid") this.stats.completedLoans++;
        });

        this.borrowService.getBorrowedMoney().subscribe({
          next: (borrowed: any) => {
            if (Array.isArray(borrowed)) {
              borrowed.forEach((tx) => {
                this.stats.totalBorrowed += tx.amount || 0;
              });
            }
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: (err: any) => {
        console.error("Error loading stats:", err);
        this.loading = false;
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
