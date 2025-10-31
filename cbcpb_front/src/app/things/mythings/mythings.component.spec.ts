import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MythingsComponent } from './mythings.component';

describe('MythingsComponent', () => {
  let component: MythingsComponent;
  let fixture: ComponentFixture<MythingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MythingsComponent]
    });
    fixture = TestBed.createComponent(MythingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
