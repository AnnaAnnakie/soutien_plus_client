import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPDFComponent } from './display-pdf.component';

describe('DisplayPDFComponent', () => {
  let component: DisplayPDFComponent;
  let fixture: ComponentFixture<DisplayPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayPDFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
