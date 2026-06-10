import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BorrowService } from "../../services/borrow.service";
import { RepaymentService } from "../../services/repayment.service";
import { AuthService } from "../../services/auth.service";
import { QrModalComponent } from "../../shared/qr-modal.component";

@Component({
  selector: "app-borrower-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, QrModalComponent],
  templateUrl: "./borrower-dashboard.component.html",
  styleUrls: ["./borrower-dashboard.component.css"],
})
export class BorrowerDashboardComponent {
  sentRequests: any[] = [];
  borrowedTransactions: any[] = [];
  loadingRequests = false;
  loadingBorrowed = false;
  totalBorrowed = 0;
  totalActiveBorrowed = 0;
  activeBorrowedTransactions: any[] = [];
  markingPaid: { [key: string]: boolean } = {};
  showQrModal = false;
  selectedQrCode = "";
  selectedUser: any = null;

  constructor(
    private borrowService: BorrowService,
    private repaymentService: RepaymentService,
    private authService: AuthService
  ) {
    this.loadRequests();
    this.loadBorrowedMoney();
  }

  loadRequests() {
    this.loadingRequests = true;
    this.borrowService.getSentRequests().subscribe({
      next: (requests: any) => {
        this.sentRequests = requests;
        this.loadingRequests = false;
      },
      error: () => (this.loadingRequests = false),
    });
  }

  loadBorrowedMoney() {
    this.loadingBorrowed = true;
    this.borrowService.getBorrowedMoney().subscribe({
      next: (txs: any) => {
        this.borrowedTransactions = txs;
        this.activeBorrowedTransactions = txs.filter(
          (tx: any) =>
            tx.status === "active" || tx.status === "pending_approval"
        );
        this.totalBorrowed = txs.reduce(
          (sum: number, tx: any) => sum + tx.amount,
          0
        );
        this.totalActiveBorrowed = this.activeBorrowedTransactions.reduce(
          (sum: number, tx: any) => sum + tx.amount,
          0
        );
        this.loadingBorrowed = false;
      },
      error: () => (this.loadingBorrowed = false),
    });
  }

  markAsPaid(transactionId: string) {
    if (!confirm("Are you sure you have repaid this amount?")) {
      return;
    }

    this.markingPaid[transactionId] = true;
    this.repaymentService
      .requestRepayment(transactionId, "Repayment completed")
      .subscribe({
        next: () => {
          this.markingPaid[transactionId] = false;
          this.loadBorrowedMoney();
          alert("Repayment request sent to lender for approval!");
        },
        error: (err: any) => {
          this.markingPaid[transactionId] = false;
          alert(err.error?.message || "Failed to send repayment request");
        },
      });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getTransactionStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      active: "UNPAID",
      pending_approval: "PENDING APPROVAL",
      repaid: "REPAID",
    };
    return labels[status] || status.toUpperCase();
  }

  getLenderId(transaction: any): string | null {
    if (!transaction.otherUser) return null;
    // If otherUser is an object with _id property
    if (
      typeof transaction.otherUser === "object" &&
      transaction.otherUser._id
    ) {
      return transaction.otherUser._id;
    }
    // If otherUser is just a string (ObjectId)
    if (typeof transaction.otherUser === "string") {
      return transaction.otherUser;
    }
    return null;
  }

  showLenderQR(userId: string | null) {
    if (!userId) {
      alert("Lender information not available");
      return;
    }
    this.authService.getUserQrCode(userId).subscribe({
      next: (data: any) => {
        this.selectedUser = data;
        this.selectedQrCode = data.qrCode || "";
        this.showQrModal = true;
      },
      error: (err: any) => {
        alert(err.error?.message || "Failed to load QR code");
      },
    });
  }

  closeQrModal() {
    this.showQrModal = false;
    this.selectedQrCode = "";
    this.selectedUser = null;
  }
}
