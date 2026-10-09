import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilSeniorComponent } from './profil-senior.component';

describe('ProfilSeniorComponent', () => {
  let component: ProfilSeniorComponent;
  let fixture: ComponentFixture<ProfilSeniorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilSeniorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilSeniorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
