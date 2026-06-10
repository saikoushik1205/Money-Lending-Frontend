import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FriendSummaryComponent } from "./friend-summary.component";

describe("FriendSummaryComponent", () => {
  let component: FriendSummaryComponent;
  let fixture: ComponentFixture<FriendSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
