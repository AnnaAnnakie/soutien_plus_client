import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignementFormComponent } from './assignement-form.component';

describe('AssignementFormComponent', () => {
  let component: AssignementFormComponent;
  let fixture: ComponentFixture<AssignementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
