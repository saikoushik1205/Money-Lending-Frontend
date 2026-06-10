import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { BorrowService } from "../../services/borrow.service";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-borrow-request",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./borrow-request.component.html",
  styleUrls: ["./borrow-request.component.css"],
})
export class BorrowRequestComponent {
  searchControl = this.fb.control("");
  form = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    reason: ["", [Validators.required, Validators.minLength(10)]],
  });

  users: any[] = [];
  allUsers: any[] = [];
  selectedUser: any = null;
  searching = false;
  loadingAllUsers = true;
  submitting = false;
  error = "";
  success = "";

  constructor(private fb: FormBuilder, private borrowService: BorrowService) {
    // Load all users on component init
    this.loadAllUsers();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.length < 2) {
            this.users = [];
            return of([]);
          }
          this.searching = true;
          return this.borrowService.searchUsers(query);
        })
      )
      .subscribe({
        next: (results: any) => {
          this.users = results;
          this.searching = false;
        },
        error: () => {
          this.searching = false;
        },
      });
  }

  loadAllUsers() {
    this.loadingAllUsers = true;
    this.borrowService.getAllUsers().subscribe({
      next: (users: any) => {
        this.allUsers = users;
        this.loadingAllUsers = false;
      },
      error: (err) => {
        console.error("Failed to load users:", err);
        this.loadingAllUsers = false;
      },
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  submit() {
    if (!this.selectedUser) return;

    this.error = "";
    this.success = "";
    this.submitting = true;

    this.borrowService
      .createBorrowRequest(
        this.selectedUser._id,
        this.form.value.amount!,
        this.form.value.reason!
      )
      .subscribe({
        next: () => {
          this.success = "Borrow request sent successfully!";
          this.submitting = false;
          this.form.reset();
          this.selectedUser = null;
          this.searchControl.setValue("");
        },
        error: (err) => {
          this.error = err.error?.message || "Failed to send request";
          this.submitting = false;
        },
      });
  }
}
