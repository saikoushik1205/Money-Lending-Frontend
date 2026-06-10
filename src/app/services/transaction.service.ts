import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

const API = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class TransactionService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  addTransaction(payload: any) {
    return this.http.post(
      `${API}/transactions`,
      payload,
      this.auth.getAuthHeaders(),
    );
  }

  getTransactions() {
    return this.http.get(`${API}/transactions`, this.auth.getAuthHeaders());
  }

  getTransactionsByFriend(friendName: string) {
    return this.http.get(
      `${API}/transactions/${encodeURIComponent(friendName)}`,
      this.auth.getAuthHeaders(),
    );
  }

  getFriendSummary() {
    return this.http.get(`${API}/friends/summary`, this.auth.getAuthHeaders());
  }

  deleteTransaction(id: string) {
    return this.http.delete(
      `${API}/transactions/${id}`,
      this.auth.getAuthHeaders(),
    );
  }

  updateTransaction(id: string, payload: any) {
    return this.http.put(
      `${API}/transactions/${id}`,
      payload,
      this.auth.getAuthHeaders(),
    );
  }
}
