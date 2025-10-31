import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeValidatePopupComponent } from './code-validate-popup.component';

describe('CodeValidatePopupComponent', () => {
  let component: CodeValidatePopupComponent;
  let fixture: ComponentFixture<CodeValidatePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeValidatePopupComponent]
    });
    fixture = TestBed.createComponent(CodeValidatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
