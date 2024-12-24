import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBonusManagementComponent } from './create_bonus-management.component';

describe('CreateBonusManagementComponent', () => {
  let component: CreateBonusManagementComponent;
  let fixture: ComponentFixture<CreateBonusManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBonusManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBonusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
