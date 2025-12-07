import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVehiculeComponent } from './edit-vehicule.component';

describe('EditVehiculeComponent', () => {
  let component: EditVehiculeComponent;
  let fixture: ComponentFixture<EditVehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVehiculeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditVehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
