import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsV1Component } from './appointments-v1.component';

describe('AppointmentsV1Component', () => {
  let component: AppointmentsV1Component;
  let fixture: ComponentFixture<AppointmentsV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
