import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyStatementsComponent } from './monthly-statements.component';

describe('MonthlyStatementsComponent', () => {
  let component: MonthlyStatementsComponent;
  let fixture: ComponentFixture<MonthlyStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
