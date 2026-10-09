import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpInscriptionComponent } from './pop-up.component';

describe('PopUpComponent', () => {
  let component: PopUpInscriptionComponent;
  let fixture: ComponentFixture<PopUpInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpInscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
