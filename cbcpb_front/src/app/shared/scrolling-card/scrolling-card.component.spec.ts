import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollingCardComponent } from './scrolling-card.component';

describe('ScrollingCardComponent', () => {
  let component: ScrollingCardComponent;
  let fixture: ComponentFixture<ScrollingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollingCardComponent]
    });
    fixture = TestBed.createComponent(ScrollingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
