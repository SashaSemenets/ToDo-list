import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateInfoComponent } from './date-info.component';

describe('DateInfoComponent', () => {
  let component: DateInfoComponent;
  let fixture: ComponentFixture<DateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
