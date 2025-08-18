import { Component, OnInit, ElementRef, QueryList, ViewChildren, ViewChild, TemplateRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl, ReactiveFormsModule, ValidatorFn, ValidationErrors, FormGroupDirective} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map, catchError } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';
import * as moment from 'moment';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';


type ZipOption = { code: string; place: string; state?: string };


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
    MatAutocompleteModule,
    MatDialogModule,

  ],
  templateUrl: './health-form.html',
  styleUrls: ['./health-form.scss']
})

export class HealthForm implements OnInit, AfterViewInit {
  
   @ViewChildren(MatExpansionPanel, { read: ElementRef })
  private panelEls!: QueryList<ElementRef<HTMLElement>>;

  form!: FormGroup;
  
  currentStep = 1;
  maxStep = 1; 

  
    private stepControls: Record<number, string[]> = {
    1: ['height', 'weight'],
    2: ['medication', 'medicationName', 'medicationReason', 'conditions'],
    3: ['hadIllness', 'illnesses'],
    4: ['treatments', 'treatmentDetails', 'hospitalTreatment', 'doctorTreatment', 'treatmentPsychologist', 'treatmentAlternative'],
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

  @ViewChild('thxTpl') thxTpl!: TemplateRef<any>;
  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private http: HttpClient,
              private dialog: MatDialog, 
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      height: ['', [Validators.required, Validators.min(1)]],
      weight: ['', [Validators.required, Validators.min(1)]],

      // Q2
      medication: [null, Validators.required],     
      medicationDetails: [''],
      medicationName: [''],
      medicationReason: [''],  
      conditions: this.fb.array([]),

      // Q3 
      hadIllness:       [null, Validators.required],    
      illnesses:        this.fb.array([]),

      //Q4
      treatments: [null, Validators.required], 
      treatmentDetails: this.fb.array([]) ,      
      hospitalTreatment: [null],
      doctorTreatment: [null],
      treatmentPsychologist: [null],
      treatmentAlternative: [null],

      //Q5
      doctorInfo: this.fb.group({
      doctorName: ['', Validators.required],
      doctorLastName: ['', Validators.required],
      doctorStreet: ['', Validators.required],
      doctorStreetNo: ['', Validators.required],
      doctorCity: ['', [
      Validators.required,
      (ctrl: AbstractControl) => {
        const v = ctrl.value;

        if (v && typeof v === 'object' && /^\d{4}$/.test(v.code ?? '')) return null;
        if (typeof v === 'string' && /^\d{4}$/.test(v)) return null;
        return { zipInvalid: true };
      }
      ]]
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

  if (this.conditionsArray.length === 0) this.addCondition();
  if (this.illnessesArray.length === 0) this.addIllness();
  if (this.treatmentDetailsArray.length === 0) this.addTreatment();

// ---- Q2: medication
const med = this.form.get('medication') as FormControl;
  const applyMed = (v: any) => {
    const yes = v === 'yes';

    this.setConditionalValidator('medicationName', yes);
    this.setConditionalValidator('medicationReason', yes);
    this.setConditionalValidator('conditions', yes);
    this.resetVisualState(this.form.get('medicationName')!);
    this.resetVisualState(this.form.get('medicationReason')!);
    this.resetVisualState(this.conditionsArray);
    if (yes) {
      this.cd.detectChanges(); // let the *ngIf render
      setTimeout(() => this.scrollElIntoView(this.medBlock?.nativeElement), 0);
    }
  };
  applyMed(med.value);
  med.valueChanges.subscribe(applyMed);

// ---- Q3: hadIllness 
const hadIll = this.form.get('hadIllness') as FormControl;
const applyIll = (v: any) => {
  const yes = v === 'yes';
  this.setConditionalValidator('illnesses', yes);
  this.resetVisualState(this.illnessesArray);
  if (yes) {
    this.cd.detectChanges(); 
    setTimeout(() => this.scrollElIntoView(this.illBlock?.nativeElement), 0);
  }
};
applyIll(hadIll.value);
hadIll.valueChanges.subscribe(applyIll);


// ---- Q4: treatments 
const tr = this.form.get('treatments') as FormControl;
const applyTr = (v: any) => {
  const yes = v === 'yes';
  this.setConditionalValidator('treatmentDetails',      yes);
  this.setConditionalValidator('treatmentPsychologist', yes);
  this.setConditionalValidator('treatmentAlternative',  yes);
  this.setConditionalValidator('hospitalTreatment', yes);
  this.setConditionalValidator('doctorTreatment', yes);

  this.resetVisualState(this.treatmentDetailsArray);
  this.resetVisualState(this.form.get('treatmentPsychologist')!);
  this.resetVisualState(this.form.get('treatmentAlternative')!);
  this.resetVisualState(this.form.get('hospitalTreatment')!);
  this.resetVisualState(this.form.get('doctorTreatment')!);

  if (yes) {
    this.cd.detectChanges();
    setTimeout(() => this.scrollElIntoView(this.treatBlock?.nativeElement), 0);
  }
};
applyTr(tr.value);
tr.valueChanges.subscribe(applyTr);

// Question 5
const docCityCtrl = this.form.get('doctorInfo.doctorCity') as FormControl;
this.plzOptionsDoc$ = this.buildZippopotamStream(docCityCtrl, 'CH'); 


// ---- Q16–19: missing teeth lists required only on "yes"
([
  ['missingTeeth',  'missingTeethList'],
  ['missingTeeth2', 'missingTeethList2'],
  ['missingTeeth3', 'missingTeethList3'],
  ['missingTeeth4', 'missingTeethList4'],
] as const).forEach(([togglePath, listPath]) => {
  const t = this.form.get(togglePath) as FormControl;
  const apply = () => {
    const yes = t.value === 'yes';
    this.setConditionalValidator(listPath, yes);
    this.resetVisualState(this.form.get(listPath)!);

    if (yes) {
      this.cd.detectChanges(); 
      setTimeout(() => {
        const el = this.getChartEl(togglePath);
        this.scrollElIntoView(el);
      }, 0);
    }
  };
  apply();
  t.valueChanges.subscribe(apply);
});

const poor = (x: string | null) =>
  (x ?? '').toLowerCase() === 'mangelhaft' ||
  (x ?? '').toLowerCase() === 'schlecht';

// Q7 — gum
const gum = this.form.get('gumCondition') as FormControl;
const applyGum = () => {
  const req = poor(gum.value);
  this.setOptionalRequired('gumLocation', req);
  if (req) this.resetVisualState(this.form.get('gumLocation')!);
};
applyGum();
gum.valueChanges.subscribe(applyGum);

// Q10 — crown
const crown = this.form.get('crownCondition') as FormControl;
const applyCrown = () => {
  const req = poor(crown.value); 
  this.setOptionalRequired('crownLocation', req);
  if (req) {
    this.resetVisualState(this.form.get('crownLocation')!);
    this.cd.detectChanges();
    setTimeout(() => this.scrollElIntoView(this.crownBlock?.nativeElement), 0);
  }
};
applyCrown();
crown.valueChanges.subscribe(applyCrown);


// Q11 — bridge
const bridge = this.form.get('bridgeCondition') as FormControl;
const applyBridge = () => {
  const req = poor(bridge.value); 
  this.setOptionalRequired('bridgeLocation', req);
  if (req) {
    this.resetVisualState(this.form.get('bridgeLocation')!);
    this.cd.detectChanges();
    setTimeout(() => this.scrollElIntoView(this.bridgeBlock?.nativeElement), 0);
  }
};
applyBridge();
bridge.valueChanges.subscribe(applyBridge);


// Q12 — dentures
const dentures = this.form.get('denturesCondition') as FormControl;
const applyDentures = () => {
  const req = poor(dentures.value); 
  this.setOptionalRequired('denturesLocation', req);
  if (req) {
    this.resetVisualState(this.form.get('denturesLocation')!);
    this.cd.detectChanges();
    setTimeout(() => this.scrollElIntoView(this.denturesBlock?.nativeElement), 0);
  }
};
applyDentures();
dentures.valueChanges.subscribe(applyDentures);


// Q13–Q15 + Q20: toggle -> details (required only when YES; never disabled)
([
  ['dentalAnomaly',    'dentalAnomalyDeetz'],
  ['jawDeformity',     'jawDeformityDeetz'],
  ['toothIllness',     'toothIllnessDeetz'],
  ['dentistTreatment', 'dentistTreatmentDetails'],
] as const).forEach(([togglePath, detailsPath]) => {
  const t = this.form.get(togglePath) as FormControl;

  const blockElFor = (name: typeof togglePath): HTMLElement | undefined => {
    switch (name) {
      case 'dentalAnomaly':    return this.dentalAnomalyBlock?.nativeElement;
      case 'jawDeformity':     return this.jawBlock?.nativeElement;
      case 'toothIllness':     return this.toothIllnessBlock?.nativeElement;
      case 'dentistTreatment': return this.dentistTreatmentBlock?.nativeElement;
    }
  };

  const apply = () => {
    const yes = t.value === 'yes';

    this.setOptionalRequired(detailsPath, yes);

    if (yes) {
      this.resetVisualState(this.form.get(detailsPath)!);

      this.cd.detectChanges();
      setTimeout(() => this.scrollElIntoView(blockElFor(togglePath)), 0);
    }
  };

  apply();
  t.valueChanges.subscribe(apply);
});

  }

plzOptionsCond$:   Observable<ZipOption[]>[] = [];
plzOptionsIll$:    Observable<ZipOption[]>[] = [];
plzOptionsTreat$:  Observable<ZipOption[]>[] = [];
plzOptionsDoc$?: Observable<ZipOption[]>;

plzDisplay = (v: any): string => {
  if (!v) return '';
  if (typeof v === 'string') return v;         
  const state = v.state ? ` (${v.state})` : '';
  return `${v.code} — ${v.place}${state}`;    
};

// builder for the autocomplete stream
private buildZippopotamStream(ctrl: FormControl, country: 'CH'|'DE'|'AT' = 'CH'): Observable<ZipOption[]> {
  const minLen = country === 'DE' ? 5 : 4;
  return ctrl.valueChanges.pipe(
    filter(v => typeof v === 'string'),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(raw => {
      const term = (raw as string).trim();
      if (term.length < minLen) return of([]);
      const url = `https://api.zippopotam.us/${country}/${encodeURIComponent(term)}`;
      return this.http.get<any>(url).pipe(
        map(res => (res?.places ?? []).map((p: any) => ({
          code: res['post code'] ?? term,
          place: p['place name'],
          state: p['state'],
        })) as ZipOption[]),
        catchError(() => of([]))
      );
    }),
  );
}

  get conditionsArray(): FormArray {
    return this.form.get('conditions') as FormArray;
  }

addCondition() {
  const group = this.fb.group({
    description: ['', Validators.required],
    startDate:   [null, Validators.required],
    endDate:     [null, Validators.required],
    operated:    [null, Validators.required],
    recovered:   [null, Validators.required],
    doctorName:   ['', Validators.required],
    doctorLastName:  ['', Validators.required],
    doctorStreet: ['', Validators.required],
    doctorStreetNo:  ['', Validators.required],
    doctorCity: ['', [
    Validators.required,
    (ctrl: AbstractControl) => {
      const v = ctrl.value;
      // valid if object with 4-digit code
      if (v && typeof v === 'object' && /^\d{4}$/.test(v.code ?? '')) return null;
      // optional: allow plain 4-digit string too
      if (typeof v === 'string' && /^\d{4}$/.test(v)) return null;
      return { zipInvalid: true };
    }
  ]]
  }, { validators: this.dateRangeValidator('startDate','endDate') }); // ← ADD

  // Keep endDate revalidated if startDate changes
  group.get('startDate')!.valueChanges.subscribe(() => {
    group.get('endDate')!.updateValueAndValidity({ onlySelf: true });
  });

  this.conditionsArray.push(group);

  const idx = this.conditionsArray.length - 1;
  const plzCtrl = group.get('doctorCity') as FormControl;
  this.plzOptionsCond$[idx] = this.buildZippopotamStream(plzCtrl, 'CH');

    this.cd.detectChanges();
  setTimeout(() => {
    const target = this.condEntryEls?.last?.nativeElement ?? this.medBlock?.nativeElement;
    this.scrollElIntoView(target);
  }, 0);
}

removeCondition(index: number) {
  if (this.conditionsArray.length <= 1) return;
  this.conditionsArray.removeAt(index);

  this.plzOptionsCond$?.splice(index, 1);
  this.cd.detectChanges();
}

  /** getter for Q3 entries */
get illnessesArray(): FormArray {
  return this.form.get('illnesses') as FormArray;
}

addIllness() {
  const group = this.fb.group({
    description:     ['', Validators.required],
    startDate:       [null, Validators.required],
    endDate:         [null, Validators.required],
    operated:        [null, Validators.required],
    recovered:       [null, Validators.required],
    doctorName:      ['', Validators.required],
    doctorLastName:  ['', Validators.required],
    doctorStreet:    ['', Validators.required],
    doctorStreetNo:  ['', Validators.required],
    doctorCity: ['', [
    Validators.required,
    (ctrl: AbstractControl) => {
      const v = ctrl.value;
      if (v && typeof v === 'object' && /^\d{4}$/.test(v.code ?? '')) return null;
      if (typeof v === 'string' && /^\d{4}$/.test(v)) return null;
      return { zipInvalid: true };
    }
  ]]
  }, { validators: this.dateRangeValidator('startDate','endDate') }); // ← ADD

  group.get('startDate')!.valueChanges.subscribe(() => {
    group.get('endDate')!.updateValueAndValidity({ onlySelf: true });
  });

  this.illnessesArray.push(group);
  const idx = this.illnessesArray.length - 1;
  const plzCtrl = group.get('doctorCity') as FormControl;
  this.plzOptionsIll$[idx] = this.buildZippopotamStream(plzCtrl, 'CH');

  this.cd.detectChanges();
setTimeout(() => {
  this.scrollElIntoView(this.illEntryEls?.last?.nativeElement ?? this.illBlock?.nativeElement);
}, 0);
}

 removeIllness(index: number) {
  if (this.illnessesArray.length <= 1) return;
  this.illnessesArray.removeAt(index);

  this.plzOptionsIll$?.splice(index, 1);
  this.cd.detectChanges();
}

 get treatmentDetailsArray(): FormArray {
  return this.form.get('treatmentDetails') as FormArray;
}

addTreatment() {
  const group = this.fb.group({
    description:     ['', Validators.required],
    startDate:       [null, Validators.required],
    endDate:         [null, Validators.required],
    operated:        [null, Validators.required],
    recovered:       [null, Validators.required],
    doctorName:      ['', Validators.required],
    doctorLastName:  ['', Validators.required],
    doctorStreet:    ['', Validators.required],
    doctorStreetNo:  ['', Validators.required],
    doctorCity: ['', [
    Validators.required,
    (ctrl: AbstractControl) => {
      const v = ctrl.value;
      // valid if object with 4-digit code
      if (v && typeof v === 'object' && /^\d{4}$/.test(v.code ?? '')) return null;
      // optional: allow plain 4-digit string too
      if (typeof v === 'string' && /^\d{4}$/.test(v)) return null;
      return { zipInvalid: true };
    }
  ]]
  }, { validators: this.dateRangeValidator('startDate','endDate') }); // ← ADD

  group.get('startDate')!.valueChanges.subscribe(() => {
    group.get('endDate')!.updateValueAndValidity({ onlySelf: true });
  });

  this.treatmentDetailsArray.push(group);

  const idx = this.treatmentDetailsArray.length - 1;
  const plzCtrl = group.get('doctorCity') as FormControl;
  this.plzOptionsTreat$[idx] = this.buildZippopotamStream(plzCtrl, 'CH');

  this.cd.detectChanges();
setTimeout(() => {
  this.scrollElIntoView(this.treatEntryEls?.last?.nativeElement ?? this.treatBlock?.nativeElement);
}, 0);

}

removeTreatment(index: number) {
  if (this.treatmentDetailsArray.length <= 1) return;
  this.treatmentDetailsArray.removeAt(index);

  this.plzOptionsTreat$?.splice(index, 1);
  this.cd.detectChanges();
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

pair1A = [55,54,53,52,51];  pair1B = [85,84,83,82,81];
pair2A = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
pair2B = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
pair3A = [61,62,63,64,65];  pair3B = [71,72,73,74,75];

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

isAnySelectedInPair(a: number[], b: number[]): boolean {
  const sel: number[] = (this.missingTeethList?.value ?? []) as number[];
  return a.some(t => sel.includes(t)) || b.some(t => sel.includes(t));
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

isAnySelectedInPair2(a: number[], b: number[]): boolean {
  const sel: number[] = (this.missingTeethList2?.value ?? []) as number[];
  return a.some(t => sel.includes(t)) || b.some(t => sel.includes(t));
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

isAnySelectedInPair3(a: number[], b: number[]): boolean {
  const sel: number[] = (this.missingTeethList3?.value ?? []) as number[];
  return a.some(t => sel.includes(t)) || b.some(t => sel.includes(t));
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

isAnySelectedInPair4(a: number[], b: number[]): boolean {
  const sel: number[] = (this.missingTeethList4?.value ?? []) as number[];
  return a.some(t => sel.includes(t)) || b.some(t => sel.includes(t));
}


get totalSteps(): number {
  return Object.keys(this.stepControls).length;
}

nextFrom(step: number) {
  const next = step + 1;

  if (step === this.totalSteps) {
    const ctrl = this.form.get('treatmentRemarks');
    ctrl?.markAsTouched();
    ctrl?.updateValueAndValidity();

if (ctrl?.invalid) {
  this.currentStep = 22;
  this.cd.detectChanges();

  this.openStepThen(22, () => {
    const panel = this.panelEls?.toArray()[21]?.nativeElement;
    this.scrollToFirstInvalidControl(panel);
  });
  return;
}
    this.completedSteps.add(step); 

  }

  if (next > this.totalSteps) return;
  this.goTo(next, true, step);
}

private scrollToStep(step: number) {
  const el = this.panelEls?.toArray()[step - 1]?.nativeElement;
  this.scrollElIntoView(el); 
}


@ViewChildren(MatExpansionPanel) private panels!: QueryList<MatExpansionPanel>;
@ViewChild('chart16') chart16?: ElementRef<HTMLElement>;
@ViewChild('chart17') chart17?: ElementRef<HTMLElement>;
@ViewChild('chart18') chart18?: ElementRef<HTMLElement>;
@ViewChild('chart19') chart19?: ElementRef<HTMLElement>;
@ViewChild('medBlock') medBlock?: ElementRef<HTMLElement>;
@ViewChildren('condEntry') condEntryEls?: QueryList<ElementRef<HTMLElement>>;
@ViewChild('illBlock') illBlock?: ElementRef<HTMLElement>;
@ViewChildren('illEntry') illEntryEls?: QueryList<ElementRef<HTMLElement>>;
@ViewChild('treatBlock') treatBlock?: ElementRef<HTMLElement>;
@ViewChildren('treatEntry') treatEntryEls?: QueryList<ElementRef<HTMLElement>>;
@ViewChild('crownBlock') crownBlock?: ElementRef<HTMLElement>;
@ViewChild('bridgeBlock') bridgeBlock?: ElementRef<HTMLElement>;
@ViewChild('denturesBlock') denturesBlock?: ElementRef<HTMLElement>;
@ViewChild('dentalAnomalyBlock') dentalAnomalyBlock?: ElementRef<HTMLElement>;
@ViewChild('jawBlock')           jawBlock?: ElementRef<HTMLElement>;
@ViewChild('dentistTreatmentBlock') dentistTreatmentBlock?: ElementRef<HTMLElement>;
@ViewChild('toothIllnessBlock') toothIllnessBlock?: ElementRef<HTMLElement>;


private completedSteps = new Set<number>();
isStepDone = (s: number) => this.completedSteps.has(s);

goTo(step: number, markTouched: boolean = true, fromStep?: number) {
  const validateStep = fromStep ?? this.currentStep;     
  const controls = this.stepControls[validateStep] || []; 
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


  this.setConditionalValidator('dentalAnomalyDeetz', dentalAnomalyValue === 'yes');
  this.setConditionalValidator('jawDeformityDeetz', jawDeformityValue === 'yes');
  this.setConditionalValidator('toothIllnessDeetz', toothIllnessValue === 'yes');
  this.setConditionalValidator('dentistTreatmentDetails', dentistTreatmentValue === 'yes');
  this.setConditionalValidator('missingTeethList', missingTeethValue === 'yes');
  this.setConditionalValidator('missingTeethList2', missingTeeth2Value === 'yes');
  this.setConditionalValidator('missingTeethList3', missingTeeth3Value === 'yes');
  this.setConditionalValidator('missingTeethList4', missingTeeth4Value === 'yes');
  this.setConditionalValidator('medicationName', medicationValue === 'yes');
  this.setConditionalValidator('medicationReason', medicationValue === 'yes');
  this.setConditionalValidator('conditions', medicationValue === 'yes');
  this.setConditionalValidator('illnesses', hadIllnessValue === 'yes');
  this.setConditionalValidator('hospitalTreatment', treatmentsValue === 'yes');
  this.setConditionalValidator('doctorTreatment',  treatmentsValue === 'yes');
  this.setConditionalValidator('treatmentDetails', treatmentsValue === 'yes');
  this.setConditionalValidator('treatmentPsychologist', treatmentsValue === 'yes');
  this.setConditionalValidator('treatmentAlternative', treatmentsValue === 'yes');

  if (missingTeethValue === 'yes') this.form.get('missingTeethList')?.markAsTouched();
  if (missingTeeth2Value === 'yes') this.form.get('missingTeethList2')?.markAsTouched();
  if (missingTeeth3Value === 'yes') this.form.get('missingTeethList3')?.markAsTouched();
  if (missingTeeth4Value === 'yes') this.form.get('missingTeethList4')?.markAsTouched();

  if (markTouched) {
    for (const name of controls) {
      if (medicationValue === 'no' && ['medicationName', 'medicationReason', 'conditions'].includes(name)) continue;
      if (hadIllnessValue === 'no' && ['illnesses'].includes(name)) continue;
      if (treatmentsValue === 'no' && ['hospitalTreatment', 'doctorTreatment', 'treatmentDetails', 'treatmentPsychologist', 'treatmentAlternative'].includes(name)) continue;
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
    if (treatmentsValue === 'no' && ['hospitalTreatment', 'doctorTreatment', 'treatmentDetails', 'treatmentPsychologist', 'treatmentAlternative'].includes(name)) continue;
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

    if (stepInvalid) {
    if (this.currentStep !== validateStep) this.currentStep = validateStep;

    this.cd.detectChanges();
    setTimeout(() => {

      this.scrollToStep(validateStep);
      const panel = this.panelEls?.toArray()[validateStep - 1]?.nativeElement;
      this.scrollToFirstInvalidControl(panel);
    }, 0);

    return; 
  }


if (!stepInvalid) {
  this.completedSteps.add(validateStep);

  if (this.currentStep === step) {
    this.currentStep = -1;
    this.cd.detectChanges();
  }
  this.currentStep = step;
  if (step > this.maxStep) this.maxStep = step;

  this.cd.detectChanges();
  setTimeout(() => {
    if (this.currentStep === step) this.scrollToStep(step);
  }, 0);
}

}

private setConditionalValidator(controlName: string, shouldBeRequired: boolean) {
  const control = this.form.get(controlName);
  if (!control) return;

  if (shouldBeRequired) {
    control.enable({ emitEvent: false }); 
    if (control instanceof FormArray) {
      control.setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      control.setValidators([Validators.required]);
    }
  } else {
    // KEY: make it inert when NO
    control.clearValidators();
    control.setErrors(null);
    control.disable({ emitEvent: false });
  }

  control.updateValueAndValidity({ emitEvent: false });
}

private resetVisualState(ctrl: AbstractControl) {
  ctrl.markAsPristine({ onlySelf: true });
  ctrl.markAsUntouched({ onlySelf: true });

  const any: any = ctrl as any;
  if (any.controls) {
    (Array.isArray(any.controls) ? any.controls : Object.values(any.controls))
      .forEach((c: AbstractControl) => this.resetVisualState(c));
  }
}

private setOptionalRequired(path: string, required: boolean) {
  const c = this.form.get(path);
  if (!c) return;

  c.enable({ emitEvent: false });

  if (required) {
    c.setValidators([Validators.required]);
  } else {
    c.clearValidators();
  }
  c.setErrors(null);
  c.updateValueAndValidity({ emitEvent: false });
}

private scrollToFirstInvalidControl(root?: HTMLElement): void {
  // If a panel root is provided, search inside it; else fall back to the whole form.
  const container: HTMLElement | null =
    root ?? (document.querySelector('form') as HTMLElement | null);
  if (!container) return;

  const selector = [
    'mat-form-field.ng-invalid input.mat-input-element:not([disabled])',
    'mat-form-field.ng-invalid textarea.mat-input-element:not([disabled])',
    'input.ng-invalid:not([disabled])',
    'textarea.ng-invalid:not([disabled])',
    'select.ng-invalid:not([disabled])',
    'mat-select.ng-invalid .mat-select-trigger',
    'mat-button-toggle-group.ng-invalid .mat-button-toggle-button'
  ].join(',');

  const target = container.querySelector<HTMLElement>(selector);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => target.focus({ preventScroll: true } as FocusOptions), 0);
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

  const firstInvalidStep = this.findFirstInvalidStep();

if (firstInvalidStep !== null) {
  this.goTo(firstInvalidStep, false);

  this.openStepThen(firstInvalidStep, () => {
    const panelEl = this.panelEls?.toArray()[firstInvalidStep - 1]?.nativeElement;
    this.scrollToFirstInvalidControl(panelEl);
  });

  console.log('❌ Form is invalid');
  return;
}


  console.log('✅ Form submitted', this.form.value);

const ref = this.dialog.open(this.thxTpl, {
    disableClose: true,
    autoFocus: true,     
    restoreFocus: false, 
    width: '420px',
    panelClass: 'thx-dialog'
  });

  ref.afterClosed().subscribe(() => {
    this.resetFormToStart();        
    this.cd.detectChanges();
    setTimeout(() => {
      this.currentStep = 1;
      this.maxStep = 1;
      this.cd.detectChanges();
      this.scrollToStep(1);

      const first = document.querySelector('input[name="height"]') as HTMLElement;
      first?.focus();
    }, 0);
  });


}


blockBadKeys(e: KeyboardEvent) {
  const blocked = ['-', '+', 'e', 'E'];

  if (blocked.includes(e.key)) e.preventDefault();
}

blockBadPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') ?? '';

  if (!/^\d+$/.test(text)) e.preventDefault();
}

private dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) return null;

    const start = group.get(startKey)?.value as moment.Moment | null;
    const end   = group.get(endKey)?.value   as moment.Moment | null;


    if (!start || !end || !start.isValid?.() || !end.isValid?.()) return null;

    const ok = start.isSameOrBefore(end, 'day');

    const endCtrl = group.get(endKey)!;
    if (!ok) {
      endCtrl.setErrors({ ...(endCtrl.errors ?? {}), dateOrder: true });
    } else if (endCtrl.errors && endCtrl.errors['dateOrder']) {
      const { dateOrder, ...rest } = endCtrl.errors;
      endCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }

    return ok ? null : { dateOrderGroup: true };
  };
}


ngAfterViewInit(): void {

  const nav = (performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined);
  const isReload = nav ? nav.type === 'reload' : (performance as any).navigation?.type === 1;

  if (isReload) {
    const prev = (history as any).scrollRestoration;
    try { (history as any).scrollRestoration = 'manual'; } catch {}

    // Start at the very top so the sticky header doesn't cover Q1
    setTimeout(() => {
      (document.scrollingElement || document.documentElement)
        .scrollTo({ top: 0, left: 0, behavior: 'auto' });

      try { (history as any).scrollRestoration = prev ?? 'auto'; } catch {}
    }, 0);
  }

  const header = document.querySelector('.health-form-header') as HTMLElement | null;
  if (header) {
    document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
  }
}

private scrollElIntoView(el?: HTMLElement) {
  if (!el) return;
  const header = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-offset')
  ) || 0;
  const y = el.getBoundingClientRect().top + window.scrollY - header - 8;
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
}

private getChartEl(togglePath: string): HTMLElement | undefined {
  switch (togglePath) {
    case 'missingTeeth':  return this.chart16?.nativeElement;
    case 'missingTeeth2': return this.chart17?.nativeElement;
    case 'missingTeeth3': return this.chart18?.nativeElement;
    case 'missingTeeth4': return this.chart19?.nativeElement;
    default: return undefined;
  }
}

@ViewChild('doneBtn') doneBtn!: ElementRef<HTMLButtonElement>;

goToDone(): void {
  this.cd.detectChanges();
  setTimeout(() => {
    const el = this.doneBtn?.nativeElement;
    if (el) {
      this.scrollElIntoView(el); 
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }, 0);
}


@ViewChild(FormGroupDirective) private formDir?: FormGroupDirective;

private resetFormToStart() {
  this.formDir?.resetForm();

  this.form.enable({ emitEvent: false });

  this.form.reset({}, { emitEvent: false });

  this.conditionsArray.clear();
  this.illnessesArray.clear();
  this.treatmentDetailsArray.clear();
  (this.form.get('missingTeethList')  as FormArray).clear();
  (this.form.get('missingTeethList2') as FormArray).clear();
  (this.form.get('missingTeethList3') as FormArray).clear();
  (this.form.get('missingTeethList4') as FormArray).clear();

  if (this.conditionsArray.length === 0) this.addCondition();
  if (this.illnessesArray.length === 0) this.addIllness();
  if (this.treatmentDetailsArray.length === 0) this.addTreatment();

  [
    'medicationName','medicationReason','conditions','illnesses',
    'treatmentDetails','treatmentPsychologist','treatmentAlternative',
    'dentalAnomalyDeetz','jawDeformityDeetz','toothIllnessDeetz',
    'dentistTreatmentDetails',
    'missingTeethList','missingTeethList2','missingTeethList3','missingTeethList4',
  ].forEach(p => this.setOptionalRequired(p, false));

  ['gumLocation','crownLocation','bridgeLocation','denturesLocation']
    .forEach(p => this.setOptionalRequired(p, false));

  this.completedSteps.clear();
  this.currentStep = 1;
  this.maxStep = 1;
}

private openStepThen(step: number, afterOpen: () => void) {

  const panel = this.panels?.toArray()[step - 1];
  if (!panel) { afterOpen(); return; }

  if (!panel.expanded) panel.open();

  this.cd.detectChanges();
  setTimeout(afterOpen, 300); 
}

}
