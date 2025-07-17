import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatNativeDateModule }      from '@angular/material/core';


@Component({
  selector: 'app-health-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDatepickerModule,   
    MatNativeDateModule
  ],
  templateUrl: './health-form.html',
  styleUrls: ['./health-form.scss']
})
export class HealthForm implements OnInit {
  form!: FormGroup;
  currentStep = 1;
    postalCodeOptions: string[] = [];
    
    private stepControls: Record<number, string[]> = {
    1: ['height', 'weight'],
    2: ['medication', 'medicationName', 'medicationReason', 'conditions'],
    // 3: ['allergies', 'reaction'],   // and so on…
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]],

      // Q2
      medication: [null, Validators.required],      
      medicationDetails: [''],
      medicationName: ['', Validators.required],
      medicationReason: ['', Validators.required],  
      conditions: this.fb.array([]),

      // Q3 
      hadIllness:       [null, Validators.required],    
      illnesses:        this.fb.array([]),
  });

    this.addCondition();   

    this.addIllness();

  }

  get conditionsArray(): FormArray {
    return this.form.get('conditions') as FormArray;
  }
    addCondition() {
    const group = this.fb.group({
      description: ['', Validators.required],
      startDate:   [null, Validators.required],
      endDate:     [null],
      operated:    [null, Validators.required],
      recovered:   [null, Validators.required],
      doctorName:   ['', Validators.required],
      doctorLastName:  ['', Validators.required],
      doctorStreet: ['', Validators.required],
      doctorStreetNo:  ['', Validators.required],
      doctorCity:   ['', Validators.required]
    });
    this.conditionsArray.push(group);

  }
    removeCondition(index: number) {
    this.conditionsArray.removeAt(index);
  }

  /** getter for Q3 entries */
get illnessesArray(): FormArray {
  return this.form.get('illnesses') as FormArray;
}

/** exactly like addCondition(), but pushes into illnesses */
addIllness() {
  const group = this.fb.group({
    description:     ['', Validators.required],
    startDate:       [null, Validators.required],
    endDate:         [null],
    operated:        [null, Validators.required],
    recovered:       [null, Validators.required],
    doctorName:      ['', Validators.required],
    doctorLastName:  ['', Validators.required],
    doctorStreet:    ['', Validators.required],
    doctorStreetNo:  ['', Validators.required],
    doctorCity:      ['', Validators.required]
  });
  this.illnessesArray.push(group);
}
  removeIllness(index: number) {
    this.illnessesArray.removeAt(index);
  }

goTo(step: number) {
  const controls = this.stepControls[this.currentStep] || [];
  let stepInvalid = false;

  // 1) mark only this step’s controls as touched
  for (const name of controls) {
    const ctrl = this.form.get(name);
    if (!ctrl) continue;

    if (ctrl instanceof FormArray) {
      ctrl.controls.forEach(child => {
        if (child instanceof FormGroup) {
          child.markAllAsTouched();
        }
      });
    } else {
      ctrl.markAsTouched();
    }
  }

  // 2) check validity of just this step
  for (const name of controls) {
    const ctrl = this.form.get(name);
    if (ctrl && ctrl.invalid) {
      stepInvalid = true;
      break;
    }
  }

  // 3) stop or advance
  if (stepInvalid) {
    return;
  }

  this.currentStep = step;
}


}
