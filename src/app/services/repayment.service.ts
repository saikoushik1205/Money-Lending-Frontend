import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

const API = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class RepaymentService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  requestRepayment(transactionId: string, note?: string) {
    return this.http.post(
      `${API}/repayments/request`,
      { transactionId, note },
      this.auth.getAuthHeaders(),
    );
  }

  getPendingRepayments() {
    return this.http.get(
      `${API}/repayments/pending`,
      this.auth.getAuthHeaders(),
    );
  }

  getRepaymentHistory() {
    return this.http.get(
      `${API}/repayments/history`,
      this.auth.getAuthHeaders(),
    );
  }

  approveRepayment(id: string) {
    return this.http.put(
      `${API}/repayments/${id}/approve`,
      {},
      this.auth.getAuthHeaders(),
    );
  }

  rejectRepayment(id: string) {
    return this.http.put(
      `${API}/repayments/${id}/reject`,
      {},
      this.auth.getAuthHeaders(),
    );
  }
}
