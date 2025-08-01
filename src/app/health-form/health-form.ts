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
    3: ['hadIllness', 'illnesses'],
    4: ['treatments', 'treatmentDetails'],
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

      //Q4
      treatments: [null, Validators.required],  // toggle (ja/nein)
      treatmentDetails: this.fb.array([]) ,      // FormArray if “ja”
      hospitalTreatment: [null],
      doctorTreatment: [null],
      treatmentPsychologist: [null, Validators.required],
      treatmentAlternative: [null, Validators.required],

      //Q5
      doctorInfo: this.fb.group({
      doctorName: ['', Validators.required],
      doctorLastName: ['', Validators.required],
      doctorStreet: ['', Validators.required],
      doctorStreetNo: ['', Validators.required],
      doctorCity: ['', Validators.required]
  })


  });

    this.addCondition();   
    this.addIllness();
    this.addTreatment();


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

 get treatmentDetailsArray(): FormArray {
  return this.form.get('treatmentDetails') as FormArray;
}
addTreatment() {
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
  this.treatmentDetailsArray.push(group);
}

removeTreatment(index: number) {
  this.treatmentDetailsArray.removeAt(index);
}

goTo(step: number) {
  const controls = this.stepControls[this.currentStep] || [];
  let stepInvalid = false;

  const medicationValue = this.form.get('medication')?.value;
  const hadIllnessValue = this.form.get('hadIllness')?.value;
  const treatmentsValue = this.form.get('treatments')?.value;

  for (const name of controls) {
    // Skip Q2 fields
    if (
      medicationValue === 'no' &&
      ['medicationName', 'medicationReason', 'conditions'].includes(name)
    ) continue;

    // Skip Q3 fields
    if (
      hadIllnessValue === 'no' &&
      ['illnesses'].includes(name)
    ) continue;

    // Skip Q4 fields
    if (
      treatmentsValue === 'no' &&
      ['treatmentDetails'].includes(name)
    ) continue;

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

  for (const name of controls) {
    if (
      medicationValue === 'no' &&
      ['medicationName', 'medicationReason', 'conditions'].includes(name)
    ) continue;

    if (
      hadIllnessValue === 'no' &&
      ['illnesses'].includes(name)
    ) continue;

    if (
      treatmentsValue === 'no' &&
      ['treatmentDetails'].includes(name)
    ) continue;

    const ctrl = this.form.get(name);
    if (ctrl && ctrl.invalid) {
      stepInvalid = true;
      break;
    }
  }

  if (!stepInvalid) {
    this.currentStep = step;
  }
}





}
