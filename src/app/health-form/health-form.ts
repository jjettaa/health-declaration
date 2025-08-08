import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatNativeDateModule }      from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';


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
  
    private stepControls: Record<number, string[]> = {
    1: ['height', 'weight'],
    2: ['medication', 'medicationName', 'medicationReason', 'conditions'],
    3: ['hadIllness', 'illnesses'],
    4: ['treatments', 'treatmentDetails'],
    5: [
    'doctorInfo.doctorName',
    'doctorInfo.doctorLastName',
    'doctorInfo.doctorStreet',
    'doctorInfo.doctorStreetNo',
    'doctorInfo.doctorCity'],
    6: ['reportUpload'],
    7: ['gumCondition', 'gumLocation'],
    8: ['hygiene'],
    9: ['occlusion'],
    10: ['crownCondition', 'crownLocation'],
    11: ['bridgeCondition', 'bridgeLocation'],
    12: ['denturesCondition', 'denturesLocation'],
    13: ['dentalAnomaly', 'dentalAnomalyDeetz'],
    14: ['jawDeformity', 'jawDeformityDeetz'],
    15: ['toothIllness', 'toothIllnessDeetz'],
    16: ['missingTeeth', 'missingTeethList'],
    17: ['missingTeeth2', 'missingTeethList2'],
    18: ['missingTeeth3', 'missingTeethList3'],
    19: ['missingTeeth4', 'missingTeethList4'],
    20: ['dentistTreatment', 'dentistTreatmentDetails'],
    21: ['fullDate'],
    22: ['treatmentRemarks']


  };

  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
  ) {}

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
  }),

    //Q6
      reportUpload: [null, Validators.required],

      //Q7
      gumCondition: [null, Validators.required],
      gumLocation: [''],

      //Q8
      hygiene: [null, Validators.required],

      //Q9
      occlusion: [null, Validators.required],

      //Q10
      crownCondition: [null, Validators.required],
      crownLocation: [''],

      //Q11
      bridgeCondition: [null, Validators.required],
      bridgeLocation: [''],

      //Q12
      denturesCondition: [null, Validators.required],
      denturesLocation: [''],

      //Q13
      dentalAnomaly: [null, Validators.required],
      dentalAnomalyDeetz: [''],

      //Q14
      jawDeformity: [null, Validators.required],
      jawDeformityDeetz: [''],

      //Q15
      toothIllness: [null, Validators.required],
      toothIllnessDeetz: [''],

      //Q16
      missingTeeth: [null, Validators.required],
      missingTeethList: this.fb.array([]),

      //Q17
      missingTeeth2: [null, Validators.required],
      missingTeethList2: this.fb.array([]),

      // Q18
      missingTeeth3: [null, Validators.required],
      missingTeethList3: this.fb.array([]),

      // Q19
      missingTeeth4: [null, Validators.required],
      missingTeethList4: this.fb.array([]),

      //Q20
      dentistTreatment: [null, Validators.required],         
      dentistTreatmentDetails: [''],

      //Q21
      fullDate: [null, Validators.required],

      //Q22
      treatmentRemarks: [null, Validators.required]


  });

    // Always start with one condition, illness, and treatment entry
if (this.conditionsArray.length === 0) {
  this.addCondition();
}

if (this.illnessesArray.length === 0) {
  this.addIllness();
}

if (this.treatmentDetailsArray.length === 0) {
  this.addTreatment();
}

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

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('File selected:', file);
    this.form.get('reportUpload')?.setValue(file);
    this.form.get('reportUpload')?.markAsTouched();
    this.form.get('reportUpload')?.updateValueAndValidity();
    this.cd.detectChanges(); 
  }
}


isFileUploaded(): boolean {
  const file = this.form.get('reportUpload')?.value;
  return file instanceof File && !!file.name;
}

//Question 16
get missingTeethList(): FormArray {
  return this.form.get('missingTeethList') as FormArray;
}

toggleTooth(tooth: number): void {
  const existingIndex = this.missingTeethList.controls.findIndex(ctrl => ctrl.value === tooth);
  if (existingIndex > -1) {
    this.missingTeethList.removeAt(existingIndex);
  } else {
    this.missingTeethList.push(new FormControl(tooth));
  }
}

isToothSelected(tooth: number): boolean {
  return this.missingTeethList.value.includes(tooth);
}

isAnyToothSelected(): boolean {
  return this.missingTeethList.length > 0;
}


//Question 17
get missingTeethList2(): FormArray {
  return this.form.get('missingTeethList2') as FormArray;
}

toggleTooth2(tooth: number): void {
  const list = this.missingTeethList2;
  const existingIndex = list.controls.findIndex(ctrl => ctrl.value === tooth);
  if (existingIndex > -1) {
    list.removeAt(existingIndex);
  } else {
    list.push(new FormControl(tooth));
  }
}

isToothSelected2(tooth: number): boolean {
  return this.missingTeethList2.value.includes(tooth);
}

isAnyToothSelected2(): boolean {
  return this.missingTeethList2.length > 0;
}


//Question 18
get missingTeethList3(): FormArray {
  return this.form.get('missingTeethList3') as FormArray;
}
toggleTooth3(tooth: number): void {
  const list = this.form.get('missingTeethList3') as FormArray;
  const index = list.controls.findIndex(ctrl => ctrl.value === tooth);
  index > -1 ? list.removeAt(index) : list.push(new FormControl(tooth));
}
isToothSelected3(tooth: number): boolean {
  return this.missingTeethList3.value.includes(tooth);
}
isAnyToothSelected3(): boolean {
  return this.missingTeethList3.length > 0;
}


//Question 19
get missingTeethList4(): FormArray {
  return this.form.get('missingTeethList4') as FormArray;
}
toggleTooth4(tooth: number): void {
  const list = this.form.get('missingTeethList4') as FormArray;
  const index = list.controls.findIndex(ctrl => ctrl.value === tooth);
  index > -1 ? list.removeAt(index) : list.push(new FormControl(tooth));
}
isToothSelected4(tooth: number): boolean {
  return this.missingTeethList4.value.includes(tooth);
}
isAnyToothSelected4(): boolean {
  return this.missingTeethList4.length > 0;
}


goTo(step: number, markTouched: boolean = true) {
  const controls = this.stepControls[this.currentStep] || [];
  let stepInvalid = false;

  const medicationValue = this.form.get('medication')?.value;
  const hadIllnessValue = this.form.get('hadIllness')?.value;
  const treatmentsValue = this.form.get('treatments')?.value;
  const gumValue = this.form.get('gumCondition')?.value;
  const crownValue = this.form.get('crownCondition')?.value;
  const bridgeValue = this.form.get('bridgeCondition')?.value;
  const denturesValue = this.form.get('denturesCondition')?.value;
  const dentalAnomalyValue = this.form.get('dentalAnomaly')?.value;
  const jawDeformityValue = this.form.get('jawDeformity')?.value;
  const toothIllnessValue = this.form.get('toothIllness')?.value;
  const dentistTreatmentValue = this.form.get('dentistTreatment')?.value;
  const missingTeethValue = this.form.get('missingTeeth')?.value; 
  const missingTeeth2Value = this.form.get('missingTeeth2')?.value;
  const missingTeeth3Value = this.form.get('missingTeeth3')?.value;
  const missingTeeth4Value = this.form.get('missingTeeth4')?.value;

  // Set conditional validators
  this.setConditionalValidator('gumLocation', gumValue === 'mangelhaft' || gumValue === 'schlecht');
  this.setConditionalValidator('crownLocation', ['mangelhaft', 'schlecht'].includes(crownValue));
  this.setConditionalValidator('bridgeLocation', ['mangelhaft', 'schlecht'].includes(bridgeValue));
  this.setConditionalValidator('denturesLocation', ['mangelhaft', 'schlecht'].includes(denturesValue));
  this.setConditionalValidator('dentalAnomalyDeetz', dentalAnomalyValue === 'yes');
  this.setConditionalValidator('jawDeformityDeetz', jawDeformityValue === 'yes');
  this.setConditionalValidator('toothIllnessDeetz', toothIllnessValue === 'yes');
  this.setConditionalValidator('dentistTreatmentDetails', dentistTreatmentValue === 'yes');
  this.setConditionalValidator('missingTeethList', missingTeethValue === 'yes');
  this.setConditionalValidator('missingTeethList2', missingTeeth2Value === 'yes');
  this.setConditionalValidator('missingTeethList3', missingTeeth3Value === 'yes');
  this.setConditionalValidator('missingTeethList4', missingTeeth4Value === 'yes');
  // Apply conditional validators based on user input
this.setConditionalValidator('medicationName', medicationValue === 'yes');
this.setConditionalValidator('medicationReason', medicationValue === 'yes');
this.setConditionalValidator('conditions', medicationValue === 'yes');

this.setConditionalValidator('illnesses', hadIllnessValue === 'yes');

this.setConditionalValidator('treatmentDetails', treatmentsValue === 'yes');
this.setConditionalValidator('treatmentPsychologist', treatmentsValue === 'yes');
this.setConditionalValidator('treatmentAlternative', treatmentsValue === 'yes');


  if (missingTeethValue === 'yes') this.form.get('missingTeethList')?.markAsTouched();
  if (missingTeeth2Value === 'yes') this.form.get('missingTeethList2')?.markAsTouched();
  if (missingTeeth3Value === 'yes') this.form.get('missingTeethList3')?.markAsTouched();
  if (missingTeeth4Value === 'yes') this.form.get('missingTeethList4')?.markAsTouched();

  // Only mark fields as touched if instructed
  if (markTouched) {
    for (const name of controls) {
      if (medicationValue === 'no' && ['medicationName', 'medicationReason', 'conditions'].includes(name)) continue;
      if (hadIllnessValue === 'no' && ['illnesses'].includes(name)) continue;
      if (treatmentsValue === 'no' && ['treatmentDetails', 'treatmentPsychologist', 'treatmentAlternative'].includes(name)) continue;
      if (missingTeethValue === 'no' && ['missingTeethList'].includes(name)) continue;
      if (gumValue === 'gut' && name === 'gumLocation') continue;
      if (!['mangelhaft', 'schlecht'].includes(crownValue) && name === 'crownLocation') continue;
      if (!['mangelhaft', 'schlecht'].includes(bridgeValue) && name === 'bridgeLocation') continue;
      if (!['mangelhaft', 'schlecht'].includes(denturesValue) && name === 'denturesLocation') continue;
      if (dentalAnomalyValue !== 'yes' && name === 'dentalAnomalyDeetz') continue;
      if (jawDeformityValue !== 'yes' && name === 'jawDeformityDeetz') continue;
      if (toothIllnessValue !== 'yes' && name === 'toothIllnessDeetz') continue;
      if (dentistTreatmentValue !== 'yes' && name === 'dentistTreatmentDetails') continue;

      const ctrl = this.form.get(name);
      if (!ctrl) continue;

      if (ctrl instanceof FormArray) {
        ctrl.controls.forEach(child => {
          if (child instanceof FormGroup) child.markAllAsTouched();
        });
      } else {
        ctrl.markAsTouched();
      }
    }
  }

  // Check validity
  for (const name of controls) {
    if (medicationValue === 'no' && ['medicationName', 'medicationReason', 'conditions'].includes(name)) continue;
    if (hadIllnessValue === 'no' && ['illnesses'].includes(name)) continue;
    if (treatmentsValue === 'no' && ['treatmentDetails'].includes(name)) continue;
    if (gumValue === 'gut' && name === 'gumLocation') continue;
    if (!['mangelhaft', 'schlecht'].includes(crownValue) && name === 'crownLocation') continue;
    if (!['mangelhaft', 'schlecht'].includes(bridgeValue) && name === 'bridgeLocation') continue;
    if (!['mangelhaft', 'schlecht'].includes(denturesValue) && name === 'denturesLocation') continue;
    if (dentalAnomalyValue !== 'yes' && name === 'dentalAnomalyDeetz') continue;
    if (jawDeformityValue !== 'yes' && name === 'jawDeformityDeetz') continue;
    if (toothIllnessValue !== 'yes' && name === 'toothIllnessDeetz') continue;
    if (dentistTreatmentValue !== 'yes' && name === 'dentistTreatmentDetails') continue;

    const ctrl = this.form.get(name);
    if (ctrl && ctrl.invalid) {
      stepInvalid = true;
      break;
    }
  }

  if (!stepInvalid) {
    if (this.currentStep === step) {
      this.currentStep = -1;
      this.cd.detectChanges();
    }
    this.currentStep = step;
  }
}


private setConditionalValidator(controlName: string, shouldBeRequired: boolean) {
  const control = this.form.get(controlName);
  if (!control) return;

  if (shouldBeRequired) {
    if (control instanceof FormArray) {
      control.setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      control.setValidators([Validators.required]);
    }
  } else {
    control.clearValidators();
  }

  control.updateValueAndValidity();
}

private scrollToFirstInvalidControl(): void {
  const firstInvalidControl: HTMLElement = document.querySelector(
    'form .ng-invalid'
  ) as HTMLElement;

  if (firstInvalidControl) {
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalidControl.focus();
  }
}

private findFirstInvalidStep(): number | null {
  for (const step in this.stepControls) {
    const controls = this.stepControls[+step];
    for (const controlName of controls) {
      const ctrl = this.form.get(controlName);
      if (ctrl && ctrl.invalid) {
        return +step;
      }
    }
  }
  return null;
}

onSubmit() {
  this.form.markAllAsTouched();         
  
  // Find the first invalid control's step
  const firstInvalidStep = this.findFirstInvalidStep();
  
  // Jump to that step so it's rendered
  if (firstInvalidStep) {
    this.goTo(firstInvalidStep);
  }

  if (this.form.valid) {
    console.log('✅ Form submitted', this.form.value);
  } else {
    console.log('❌ Form is invalid');
    
    // Use a slight delay to ensure Angular renders the step
    setTimeout(() => this.scrollToFirstInvalidControl(), 100);
  }
}



}
