import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-qr-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./qr-modal.component.html",
  styleUrls: ["./qr-modal.component.css"],
})
export class QrModalComponent {
  @Input() isOpen = false;
  @Input() title = "Payment QR Code";
  @Input() qrCode = "";
  @Input() userData: any = null;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
