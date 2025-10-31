import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValiduserComponent } from './validuser.component';

describe('ValiduserComponent', () => {
  let component: ValiduserComponent;
  let fixture: ComponentFixture<ValiduserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValiduserComponent]
    });
    fixture = TestBed.createComponent(ValiduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
