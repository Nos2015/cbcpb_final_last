import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrormessageComponent } from './errormessage.component';

describe('ErrormessageComponent', () => {
  let component: ErrormessageComponent;
  let fixture: ComponentFixture<ErrormessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrormessageComponent]
    });
    fixture = TestBed.createComponent(ErrormessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
