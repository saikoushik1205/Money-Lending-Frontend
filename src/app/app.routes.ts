import { Routes, Router } from "@angular/router";
import { inject } from "@angular/core";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { AddTransactionComponent } from "./pages/add-transaction/add-transaction.component";
import { EditTransactionComponent } from "./pages/edit-transaction/edit-transaction.component";
import { TransactionListComponent } from "./pages/transaction-list/transaction-list.component";
import { FriendSummaryComponent } from "./pages/friend-summary/friend-summary.component";
import { BorrowRequestComponent } from "./pages/borrow-request/borrow-request.component";
import { LenderDashboardComponent } from "./pages/lender-dashboard/lender-dashboard.component";
import { BorrowerDashboardComponent } from "./pages/borrower-dashboard/borrower-dashboard.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/auth.service";

export const appRoutes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  { path: "add", component: AddTransactionComponent, canActivate: [AuthGuard] },
  {
    path: "edit-transaction/:id",
    component: EditTransactionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "transactions",
    component: TransactionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "summary",
    component: FriendSummaryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "borrow-request",
    component: BorrowRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "lender-dashboard",
    component: LenderDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "borrower-dashboard",
    component: BorrowerDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/login" },
];
