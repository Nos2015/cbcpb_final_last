import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllthingsComponent } from './allthings.component';

describe('AllthingsComponent', () => {
  let component: AllthingsComponent;
  let fixture: ComponentFixture<AllthingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllthingsComponent]
    });
    fixture = TestBed.createComponent(AllthingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
