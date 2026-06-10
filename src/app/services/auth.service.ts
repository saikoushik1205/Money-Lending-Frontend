import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { environment } from "../../environments/environment";

const API = `${environment.apiUrl}/auth`;

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private hasValidToken(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  }

  register(data: any) {
    return this.http.post(`${API}/register`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          if (res.user) {
            localStorage.setItem("userData", JSON.stringify(res.user));
          }
        }
      }),
    );
  }

  login(data: any) {
    return this.http.post(`${API}/login`, data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          if (res.user) {
            localStorage.setItem("userData", JSON.stringify(res.user));
          }
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    this.router.navigate(["/login"]);
  }

  isLoggedIn() {
    return this.hasValidToken();
  }

  getToken(): string | null {
    return this.isLoggedIn() ? localStorage.getItem("token") : null;
  }

  getUserData(): any {
    if (!this.isLoggedIn()) return null;
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  getAuthHeaders() {
    const token = this.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getProfile() {
    return this.http.get(`${API}/profile`, this.getAuthHeaders());
  }

  updateUpiDetails(data: any) {
    return this.http.put(`${API}/profile/upi`, data, this.getAuthHeaders());
  }

  getUserQrCode(userId: string) {
    return this.http.get(`${API}/user/${userId}/qr`, this.getAuthHeaders());
  }
}
