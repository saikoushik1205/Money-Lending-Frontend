import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BorrowService } from "../../services/borrow.service";
import { RepaymentService } from "../../services/repayment.service";
import { AuthService } from "../../services/auth.service";
import { QrModalComponent } from "../../shared/qr-modal.component";

@Component({
  selector: "app-lender-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, QrModalComponent],
  templateUrl: "./lender-dashboard.component.html",
  styleUrls: ["./lender-dashboard.component.css"],
})
export class LenderDashboardComponent {
  pendingRequests: any[] = [];
  processedRequests: any[] = [];
  lentTransactions: any[] = [];
  pendingRepayments: any[] = [];
  loadingRequests = false;
  loadingLent = false;
  loadingRepayments = false;
  totalLent = 0;
  totalActiveLent = 0;
  activeLentTransactions: any[] = [];
  showQrModal = false;
  selectedQrCode = "";
  selectedUser: any = null;

  constructor(
    private borrowService: BorrowService,
    private repaymentService: RepaymentService,
    private authService: AuthService
  ) {
    this.loadRequests();
    this.loadLentMoney();
    this.loadRepaymentRequests();
  }

  loadRequests() {
    this.loadingRequests = true;
    this.borrowService.getReceivedRequests().subscribe({
      next: (requests: any) => {
        this.pendingRequests = requests.filter(
          (r: any) => r.status === "pending"
        );
        this.processedRequests = requests.filter(
          (r: any) => r.status !== "pending"
        );
        this.loadingRequests = false;
      },
      error: () => (this.loadingRequests = false),
    });
  }

  loadLentMoney() {
    this.loadingLent = true;
    this.borrowService.getLentMoney().subscribe({
      next: (txs: any) => {
        this.lentTransactions = txs;
        this.activeLentTransactions = txs.filter(
          (tx: any) =>
            tx.status === "active" || tx.status === "pending_approval"
        );
        this.totalLent = txs.reduce(
          (sum: number, tx: any) => sum + tx.amount,
          0
        );
        this.totalActiveLent = this.activeLentTransactions.reduce(
          (sum: number, tx: any) => sum + tx.amount,
          0
        );
        this.loadingLent = false;
      },
      error: () => (this.loadingLent = false),
    });
  }

  loadRepaymentRequests() {
    this.loadingRepayments = true;
    this.repaymentService.getPendingRepayments().subscribe({
      next: (repayments: any) => {
        this.pendingRepayments = repayments;
        this.loadingRepayments = false;
      },
      error: () => (this.loadingRepayments = false),
    });
  }

  acceptRequest(id: string) {
    this.borrowService.acceptRequest(id).subscribe({
      next: () => this.loadRequests(),
      error: (err: any) =>
        alert(err.error?.message || "Failed to accept request"),
    });
  }

  rejectRequest(id: string) {
    this.borrowService.rejectRequest(id).subscribe({
      next: () => this.loadRequests(),
      error: (err: any) =>
        alert(err.error?.message || "Failed to reject request"),
    });
  }

  approveRepayment(id: string) {
    if (!confirm("Confirm that you have received the repayment?")) {
      return;
    }
    this.repaymentService.approveRepayment(id).subscribe({
      next: () => {
        this.loadRepaymentRequests();
        this.loadLentMoney();
        alert("Repayment approved successfully!");
      },
      error: (err: any) =>
        alert(err.error?.message || "Failed to approve repayment"),
    });
  }

  rejectRepayment(id: string) {
    if (!confirm("Reject this repayment claim?")) {
      return;
    }
    this.repaymentService.rejectRepayment(id).subscribe({
      next: () => {
        this.loadRepaymentRequests();
        this.loadLentMoney();
        alert("Repayment request rejected");
      },
      error: (err: any) =>
        alert(err.error?.message || "Failed to reject repayment"),
    });
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

  getBorrowerId(request: any): string | null {
    if (!request.borrower) return null;
    // If borrower is an object with _id property
    if (typeof request.borrower === "object" && request.borrower._id) {
      return request.borrower._id;
    }
    // If borrower is just a string (ObjectId)
    if (typeof request.borrower === "string") {
      return request.borrower;
    }
    return null;
  }

  showBorrowerQR(userId: string | undefined | null) {
    if (!userId) {
      alert("Borrower information not available");
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
