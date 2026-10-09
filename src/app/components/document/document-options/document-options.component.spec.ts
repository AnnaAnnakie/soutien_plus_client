import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentOptionsComponent } from './document-options.component';

describe('DocumentOptionsComponent', () => {
  let component: DocumentOptionsComponent;
  let fixture: ComponentFixture<DocumentOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
