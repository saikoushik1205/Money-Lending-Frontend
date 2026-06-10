import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

const API = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class BorrowService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  searchUsers(query: string) {
    return this.http.get(
      `${API}/users/search?q=${encodeURIComponent(query)}`,
      this.auth.getAuthHeaders(),
    );
  }

  getAllUsers() {
    return this.http.get(`${API}/users/all`, this.auth.getAuthHeaders());
  }

  createBorrowRequest(lenderId: string, amount: number, reason: string) {
    return this.http.post(
      `${API}/borrow-requests`,
      { lenderId, amount, reason },
      this.auth.getAuthHeaders(),
    );
  }

  getSentRequests() {
    return this.http.get(
      `${API}/borrow-requests/sent`,
      this.auth.getAuthHeaders(),
    );
  }

  getReceivedRequests() {
    return this.http.get(
      `${API}/borrow-requests/received`,
      this.auth.getAuthHeaders(),
    );
  }

  acceptRequest(id: string) {
    return this.http.put(
      `${API}/borrow-requests/${id}/accept`,
      {},
      this.auth.getAuthHeaders(),
    );
  }

  rejectRequest(id: string) {
    return this.http.put(
      `${API}/borrow-requests/${id}/reject`,
      {},
      this.auth.getAuthHeaders(),
    );
  }

  getLentMoney() {
    return this.http.get(
      `${API}/transactions/type/lent`,
      this.auth.getAuthHeaders(),
    );
  }

  getBorrowedMoney() {
    return this.http.get(
      `${API}/transactions/type/borrowed`,
      this.auth.getAuthHeaders(),
    );
  }
}
