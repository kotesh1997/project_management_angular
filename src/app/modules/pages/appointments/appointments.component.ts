import { ViewEncapsulation, Component, ViewChild, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientsService } from '../patients/patients.service';
import { MedicineService } from '../medicine/medicine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators, FormArray
} from '@angular/forms';
import { GeneralService } from '../../../Services/general.service';
import { UtilitiesService } from 'app/Services/utilities.service';
import { ToastService } from 'app/Services/toastservice';
import { LoaderService } from '../../../Services/loader.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component'
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { DateAdapter } from '@angular/material/core';
// import { debug } from 'console';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class AppointmentsComponent implements OnInit,OnDestroy {

    patientHistorys: any = [];

    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    tabWay = "vert";

    private API_URL: any = environment.API_URL;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: any = [];
    allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
    frequencyList: any = [];

    medicine: any = [];
    frequencyListMedication: any = [];
    dose: any = [];
    when: any = [];
    duration: any = [];

    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild("myNameElem") myNameElem: ElementRef;
    @ViewChild('appointmentDrawer') appointmentDrawer: ElementRef;

    @ViewChild('editCompanyModal') editCompanyModal: TemplateRef<any>;
    @ViewChild('presecptionModal') presecptionModal: TemplateRef<any>;
    private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;
    private presecptionModalDialogRef: MatDialogRef<TemplateRef<any>>;


    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;


    durationInSeconds = 5;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';


    actionName: string = 'New Appointment'
    appointmentButton: string = 'Create Appointment';
    btnText: string;
    errorMessage: any;
    appt: any = {};
    appointmentModel: any = {};
    horizontalStepperForm: FormGroup;
    vitalsForm: FormGroup;
    date: any;
    doctors: any = [];
    action: string = 'Save';
    appointmentId: any;
    services: any = [];
    status: any = [];
    slots: any = [];
    discounts: any = [];
    prices: any = [];
    genders: any = [];
    upcomingBookings: any = [];
    todayBookings: any = [];

    todayDataSourceBookings: any = [];
    todayDataSourcePrintBookings: any = [];
    upcomingDataSourceBookings: any = [];

filename:any=[];

    patientsappointments: any = [];
    filterPatientappointments: any = [];
    searchKey1: string;
    searchKey2: string;
    searchKey3: string;
    allAppointments: any;
    patientID: number = 0;
    appointID: number = 0;
    mobNoAlreadyExists: boolean = false;
    patients: any = [];
    selection: any = [];
    panelOpenState = false;
    flag: string;
    complaintsList: any = [];
    complaints: any = [];
    patientName: string;
    visitReasonList: any = [];
    visitReason: any = [];

    docs: any = [];
    docsList: any = [];
    slotsArr: any = [];
    vitalsList: any = [];
    vitals: any = [];
    PatientID: any;
    AppointmentID: any;
    vitalsID: any;
    complaintsXML: any = [];
    items: FormArray;
    medicationitems: FormArray;
    ImageData: any;
    image: any;
    loginDetails: any;
    roleID: any;
    registrationID: any;

    advice: any;
    nextvisit: any;


    docsXml: any = [];
    medicineXml: any = [];
    selectedDate: any;

    attachementsArr: FormArray;
    form: any;
    fileName: any;
    patientHistory: any = [];
    patientsappointment = new MatTableDataSource(this.todayDataSourceBookings);
    patientHistoryList: any = [];
    filteredAppointments: any = [];
    isChecked: boolean = false;
    isPriceTag: boolean = true;
    isDuePay: boolean = false;
    isNoSlot: boolean = false;
    nextDisabled: boolean = true;
    Screen: any = 1;
    detailData: any = [];
    apptList: any = {};
    complaintsXMLList: any = [];
    medicineList: any = [];
    medicinePrescepList: any = [];
    afterSaveVitalId: any = 0;
    actualPrice: any = 0;
    // rowClickedData:any=[];
    Mode: any = [];
    BloodGroup:any=[];
    receiptToken: any = 0;
    showHideDiv = false;
    filterValues = {};
    filterSelectObj = [];
    labreportfiles = [];
    dataSource = new MatTableDataSource();
    fileUrl: string;
    constructor(
        public patientsService: PatientsService,
        public medicineService: MedicineService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        public datepipe: DatePipe,
        private toastService: ToastService,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        private http: HttpClient,
        public spinner: LoaderService,
        private _liveAnnouncer: LiveAnnouncer,
        private _router: Router,
        private dialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
    ) {

        // Object to create Filter for
        this.filterSelectObj = [
            // {
            //   name: 'ID',
            //   columnProp: 'patientARCID',
            //   options: []
            // }, 
            {
                name: 'Patient NAME',
                columnProp: 'patient',
                options: []
            },
            //{
            //   name: 'USERNAME',
            //   columnProp: 'username',
            //   options: []
            // }, {
            //   name: 'EMAIL',
            //   columnProp: 'email',
            //   options: []
            // }, 
            {
                name: 'STATUS',
                columnProp: 'status',
                options: []
            }
        ]

        this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
        // this.date = new FormControl(new Date());
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.complaints.slice())),
        );

        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID = this.loginDetails.registrationID;
        }

        this.myControl = new FormControl();
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
            );


    }
    filterStates(name: string) {

        return this.filterPatientappointments.filter(state =>
            state.mobile.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }


   

    displayedColumns: string[] = [
        'SL',
        'Patient',
        'Service',
        'Doctor',
        'Time',
        'WaitingTime',
        'Status',       
        'VisitCount',
        'ReceiptToken',
        'Billing',
        'Actions',
        'Vitals',
        'View'
    ];
    displayedColumnsHistory: string[] = [
        'SL',
        'Patient',
        'Service',
        'Doctor',
        'Time',
        'VisitCount',
        'View'
    ];
    displayedColumnsUpcoming: string[] = [
        'SL',
        'Patient',
        'Service',
        'Doctor',
        'Time',
        'WaitingTime',
        'VisitCount',
        'Billing',
        'Actions'
    ];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // @ViewChild(MatPaginator) HistoryPaginator: MatPaginator;
    //@ViewChild('MatPaginator1') upcomingPaginator: MatPaginator;
    @ViewChild('HistoryPaginator') HistoryPaginator: MatPaginator;

    // @ViewChild('paginator', {static: true}) paginator: MatPaginator;
    @ViewChild('upcomingPaginator', { static: true }) upcomingPaginator: MatPaginator;

    @ViewChild('appointmentForm') myForm: NgForm;
    searchKey: string;


    add(event: MatChipInputEvent): void {

        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            if (!this.fruits.some(e => e.toLowerCase() === value.toLowerCase())) {
                this.fruits.push(value);
                this.addComplaints(value);
            }
        }

        // Clear the input value
        event.chipInput!.clear();

        this.fruitCtrl.setValue(null);
    }
    addComplaints(val) {
        let arr = [];
        arr.push({ flag: Number(1), ComplaintName: val })
        var url = 'PatientsAppointments/ComplaintsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.complaints = data;
                    this.complaintsList = data;
                    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
                        startWith(null),
                        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.complaints.slice())),
                    );
                } else {
                }
            },

            () => { }
        );
    }
    applyFilters() {
        
        this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }


    selected(event: MatAutocompleteSelectedEvent): void {

        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }

    // private _filter(value: string): string[] {
    //   
    //     const filterValue = value.toLowerCase();
    //     return this.complaints.filter(fruit => fruit.complaintName.toLowerCase().includes(filterValue));
    // }

    ngOnInit(): void {



        
        this.addStaticData();
        this.getDocs();
        this.getComplaints();
        this.getVisitReason();
        this.vitalsCrud();


        this.getAllAppointments();
        this.getAllDoctors();
        this.getServices();
        //  this.getStatuses();
        this.getSlots();
        this.getGenders();
        this.getAllAppointmentBills();
        this.getDiscounts();
        this.getAllPatients();
        this.GetMedicineData();
        this.btnText = 'Register';
        this.detailData = [];
        // this.isChecked=false;

        // Horizontal stepper form
        if (this.roleID == '1') {
            this.horizontalStepperForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    appDate: new FormControl(new Date()),
                    slot: ['', Validators.required],
                    docName: ['', Validators.required],
                    firstName: ['', Validators.required],
                   // lastName: [''],
                    mobNum: ['', Validators.required],
                    gender: ['', Validators.required],
                    age: ['', Validators.required],
                    status: [''],

                }),
                step2: this._formBuilder.group({
                    serviceName: ['', Validators.required],
                    price: ['', Validators.required],
                    discount: [''],
                    amountPaid: ['', Validators.required],
                    skipPayment: [''],
                    netPrice: [''],
                    duePayment: [''],
                    modeOfPayment: ['']

                }),
            });
        }
        else {
            this.horizontalStepperForm = this._formBuilder.group({
                step1: this._formBuilder.group({
                    appDate: new FormControl(new Date()),
                    slot: ['', Validators.required],
                    docName: ['', Validators.required],
                    firstName: ['', Validators.required],
                   // lastName: [''],
                    mobNum: ['', Validators.required],
                    gender: ['', Validators.required],
                    age: ['', Validators.required],
                    status: [''],

                }),
                step2: this._formBuilder.group({
                    serviceName: ['', Validators.required],
                    price: ['', Validators.required],
                    discount: [''],
                    amountPaid: [''],
                    skipPayment: [''],
                    netPrice: [''],
                    duePayment: [''],
                    modeOfPayment: ['']

                }),
            });
        }
        
        this.vitalsForm = this._formBuilder.group({
            weight: [''],
            bloodGroup: [''],
            temp: [''],
            serumCreatinine: [''],
            bloodPressure: [''],
            pulse: [''],
            SpO2: [''],
            BMI: [''],

            visitReason: [''],
            advice: [''],
            nextVisit: [''],
            frequency: [''],
            pickADate: null,

            items: this._formBuilder.array([this.createItem()]),
            medicationitems: this._formBuilder.array([this.createMedicationItem()]),
        });

        if (this.roleID == '1') {
            this.displayedColumns = [
                'SL', 'Patient', 'Service','Doctor', 'Time', 'WaitingTime', 'Status', 'VisitCount', 'ReceiptToken','Billing','DuePayment',
                 'Actions', 'View'
            ];
        }
        else if (this.roleID == '2') {
            this.displayedColumns = [
                'SL', 'Patient', 'Service','Doctor', 'Time', 'WaitingTime', 'Status', 'VisitCount',
                 'Vitals', 'View'
            ];
            this.displayedColumnsUpcoming = [
                'SL',
                'Patient',
                'Service',
                //'Doctor',
                'Time',
                'WaitingTime',
                'VisitCount',
                'Billing',
                'Vitals',
            ];
        }
        else if (this.roleID == '3') {
            this.displayedColumns = [
                'SL', 'Patient', 'Service', 'Time', 'WaitingTime', 'Status', 'VisitCount',
                 'Actions',
            ];
        }
        else if (this.roleID == '5') {
            this.displayedColumns = [
                'SL', 'Patient', 'Service', 'Time', 'WaitingTime', 'Status', 'VisitCount',
                 'Vitals', 'View'
            ];
        }

        // this.filteredOptions = this.myControl.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filter(value)),
        //   );



    }


    ngOnDestroy(): void {
        localStorage.removeItem('accessToken');

        
        localStorage.removeItem('loginDetails');
    }
    filterChange(filter, event) {
        //let filterValues = {}
        // this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
        this.filterValues[filter.columnProp] = event.value.toLowerCase()
        this.todayBookings.filter = JSON.stringify(this.filterValues)
    }


    getFilterObject(fullObj, key) {
        const uniqChk = [];
        fullObj.filter((obj) => {
            if (!uniqChk.includes(obj[key])) {
                uniqChk.push(obj[key]);
            }
            return obj;
        });
        return uniqChk;
    }

    createFilter() {
        let filterFunction = function (data: any, filter: string): boolean {
            let searchTerms = JSON.parse(filter);
            let isFilterSet = false;
            for (const col in searchTerms) {
                if (searchTerms[col].toString() !== '') {
                    isFilterSet = true;
                } else {
                    delete searchTerms[col];
                }
            }

            console.log(searchTerms);

            let nameSearch = () => {
                let found = false;
                if (isFilterSet) {
                    for (const col in searchTerms) {
                        searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
                            if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
                                found = true
                            }
                        });
                    }
                    return found
                } else {
                    return true;
                }
            }
            return nameSearch()
        }
        return filterFunction
    }


    addStaticData() {

        this.frequencyList = [];
        this.frequencyList.push({ ID: 1, frequency: 'Day' })
        this.frequencyList.push({ ID: 2, frequency: 'Month' })


        this.frequencyListMedication = [];
        this.frequencyListMedication.push({ ID: 1, label: 'Daily' })
        this.frequencyListMedication.push({ ID: 2, label: 'Weekly' })
        this.frequencyListMedication.push({ ID: 1, label: 'Monthly' })
        this.frequencyListMedication.push({ ID: 2, label: '2 days' })
        this.frequencyListMedication.push({ ID: 2, label: '3 days' })
        this.frequencyListMedication.push({ ID: 2, label: '4 days' })

        // this.medicine.push({ ID: 1, label: 'AV UTI Suspension' })
        // this.medicine.push({ ID: 2, label: 'Cartiva Forte Tablet' })
        // this.medicine.push({ ID: 1, label: 'Rtist 300MG Tablet' })
        // this.medicine.push({ ID: 2, label: 'Nise Suspension' })


        this.dose = [];
        this.dose.push({ ID: 2, label: '1-1-1' })
        this.dose.push({ ID: 2, label: '1-0-1' })
        this.dose.push({ ID: 2, label: '1-0-0' })
        this.dose.push({ ID: 2, label: '0-0-1' })
        this.dose.push({ ID: 2, label: '1/2-0-0 ' })
        this.dose.push({ ID: 2, label: '0-1/2-0' })
        this.dose.push({ ID: 2, label: '0-0-1/2' })
        this.dose.push({ ID: 2, label: '1/2-1/2-1/2' })

        this.when = [];
        this.when.push({ ID: 2, label: 'After Food' })
        this.when.push({ ID: 2, label: 'Before Food' })
        this.when.push({ ID: 2, label: 'Night' })

        this.duration = [];
        this.duration.push({ ID: 2, label: '4 Days' })
        this.duration.push({ ID: 2, label: '10 Days' })
        this.duration.push({ ID: 2, label: '1 Week' })
        this.duration.push({ ID: 2, label: '2 Weeks' })
        this.duration.push({ ID: 2, label: '1 Months' })
        this.duration.push({ ID: 2, label: '2 Months' })
        this.duration.push({ ID: 2, label: '3 Months' })

        this.Mode = [];
        this.Mode.push({ ID: 1, label: 'Cash' })
        this.Mode.push({ ID: 2, label: 'Card' })
        this.Mode.push({ ID: 3, label: 'UPI' })
        this.Mode.push({ ID: 4, label: 'NetBanking' })

        this.BloodGroup =[];
        this.BloodGroup.push({ ID: 'A+', label: 'A+' })
        this.BloodGroup.push({ ID: 'A-', label: 'A-' })
        this.BloodGroup.push({ ID: 'B+', label: 'B+' })
        this.BloodGroup.push({ ID: 'B-', label: 'B-' })
        this.BloodGroup.push({ ID: 'O+', label: 'O+' })
        this.BloodGroup.push({ ID: 'O-', label: 'O-' })
        this.BloodGroup.push({ ID: 'AB+', label: 'AB+' })
        this.BloodGroup.push({ ID: 'AB-', label: 'AB-' })

    }

    onRowClicked(row) {
        
        // this.rowClickedData=row;
        this.Screen = 2;
        this.detailData = row;
        this.viewHistory(row);
        this.fruits = [];
        this.vitalsForm.reset();
        if (row.vitalsID) {
            this.setValues(row);

        }
        else {
            
            this.patientName = row.patient + " " + "(" + row.gender + ", Age " + row.age + ")"
            // this.vitalsForm.reset();
            // this.fruits = [];
            this.flag = '1'
            this.PatientID = row.patientID;
            this.AppointmentID = row.appointmentID;
            this.vitalsID = 0;
            this.items = this.vitalsForm.get('items') as FormArray;
            this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
            // const arr = <FormArray>this.vitalsForm.controls.items;
            // arr.controls = [];
            // this.addItem();

            // console.log('Row clicked: ', row);
        }
    }

    onRowPrintPresecptionClicked(row) {
        
        if (row.vitalsID) {
            
            this.detailData = row;
            this.setValues(row);
            this.ViewPrescption();
        }
    }

    private _filter(value: string): string[] {

        //const filterValue = value.toLowerCase();

        //return this.patientsappointments.data.filter(option => option.mobile.toLowerCase().includes(filterValue));
        return this.filterPatientappointments.filter(option => option.mobile.includes(value));
    }
    filterAppointemnts(event) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < this.allAppointments.length; i++) {
            let country = this.allAppointments[i];
            if (country.mobile.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredAppointments = filtered;
    }


    getAllAppointments() {
        this.spinner.show();
        this.utilitiesService.getAllAppointments().subscribe(
            (data) => {
                if (data) {
                    
                    this.allAppointments = data;
                    this.date = new Date();
                    this.date.setHours(0, 0, 0, 0);
                    let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
                    const dateforToday = new Date();
                    if (this.roleID != 2) {
                        this.patientsappointments = data;
                        //Today Bookings
                        this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate);
                        

                        this.selection = new Set < this.todayDataSourceBookings > (true);
                        //Future Bookings
                        this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
                        //All Bookings
                        // this.patientsappointments = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday));

                        // this.filterPatientappointments =data.filter((v, i, a) => a.indexOf(v) === i); 
                    }
                    else {
                        // this.registrationID=this.loginDetails.registrationID;

                        this.todayDataSourceBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
                        this.selection = new Set < this.todayDataSourceBookings > (true);
                        //Future Bookings
                        this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
                        //All Bookings
                        this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
                    }

                    this.filterPatientappointments = data.filter(
                        (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                    );
                }
                this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
                this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
                this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
                this.patientsappointments = new MatTableDataSource(this.patientsappointments);


                this.todayBookings.paginator = this.paginator;
                this.upcomingBookings.paginator = this.upcomingPaginator;
                this.patientsappointments.paginator = this.HistoryPaginator;

                if (this.receiptToken > 0) {
                    this.date = new Date();
                    this.date.setHours(0, 0, 0, 0);
                    let todayDate1 = this.datepipe.transform(this.date, 'dd MMM yyyy');
                    this.todayDataSourcePrintBookings = data.filter((a) => a.receiptToken == this.receiptToken && a.serviceDate == todayDate1);
                    if(this.todayDataSourcePrintBookings.length>0)
                    {
                    if (this.todayDataSourcePrintBookings[0].modeofPaymentID != 5 && (this.todayDataSourcePrintBookings[0].duePayment == null ||
                        this.todayDataSourcePrintBookings[0].duePayment == '0.00')) {
                        //(element.modeofPaymentID != 5) && (element.duePayment == null || element.duePayment == '0.00')"

                        this.openCompanyDetailsDialog();
                    }
                }
                    //this.printSingle();
                }

                this.todayBookings.filterPredicate = this.createFilter();

                this.filterSelectObj.filter((o) => {
                    o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
                });

                this.spinner.hide();
            },

            () => {
                this.spinner.hide();
            }
        );
    }

    // Reset table filters
    resetFilters() {
        this.filterValues = {}
        this.filterSelectObj.forEach((value, key) => {
            value.modelValue = undefined;
        })
        this.todayBookings.filter = "";
    }


    sortData(sort: MatSort) {
        

        if (sort.active == "patientARCID") {
            if (sort.direction == "asc")
                this.todayDataSourceBookings.sort((a, b) => (a.patientARCID < b.patientARCID ? -1 : 1));
            else
                this.todayDataSourceBookings.sort((a, b) => (a.patientARCID > b.patientARCID ? -1 : 1));
        }
        if (sort.active == "status") {
            if (sort.direction == "asc")
                this.todayDataSourceBookings.sort((a, b) => (a.status < b.status ? -1 : 1));
            else
                this.todayDataSourceBookings.sort((a, b) => (a.status > b.status ? -1 : 1));
        }
        if (sort.active == "visitCount") {
            if (sort.direction == "asc")
                this.todayDataSourceBookings.sort((a, b) => (a.visitCount < b.visitCount ? -1 : 1));
            else
                this.todayDataSourceBookings.sort((a, b) => (a.visitCount > b.visitCount ? -1 : 1));
        }



        this.todayBookings = new MatTableDataSource(this.todayDataSourceBookings);
        this.todayBookings.paginator = this.paginator;

    }

    getAllDoctors() {
        this.utilitiesService.getAllDoctors().subscribe(
            (data) => {
                if (data) {

                    this.doctors = data;
                } else {
                }
            },

            () => { }
        );
    }
    getAllPatients() {
        this.patientsService.GetAllPatients().subscribe(
            (data) => {
                if (data) {
                    ;
                    this.patients = data;
                } else {
                }
            },

            () => { }
        );
    }

    getServices() {
        this.utilitiesService.getServices().subscribe(
            (data) => {
                if (data) {
                    ;
                    this.services = data;
                } else {
                }
            },

            () => { }
        );
    }

    getStatuses() {
        this.utilitiesService.getStatuses().subscribe(
            (data) => {
                if (data) {
                    this.status = data;
                } else {
                }
            },

            () => { }
        );
    }
    getSlots() {
        this.utilitiesService.getSlots().subscribe(
            (data) => {
                if (data) {
                    this.slots = data;
                } else {
                }
            },

            () => { }
        );
    }
    getGenders() {
        this.utilitiesService.getAllGenders().subscribe(
            (data) => {
                if (data) {
                    this.genders = data;
                } else {
                }
            },

            () => { }
        );
    }
    getAllAppointmentBills() {
        this.utilitiesService.getAllAppointmentBills().subscribe(
            (data) => {
                if (data) {
                    this.prices = data;
                    // this.prices.splice(0, 1);
                } else {
                }
            },

            () => { }
        );
    }
    getDiscounts() {
        this.utilitiesService.getDiscounts().subscribe(
            (data) => {
                if (data) {
                    this.discounts = data;
                    // this.discounts.splice(0, 1);
                } else {
                }
            },

            () => { }
        );
    }
    onSearchClear() {

        this.searchKey3 = '';
        // this.applyFilter();
    }

    onAppointmentClear() {

        this.step1.reset();
        this.step2.reset();
        this.onSearchClear();
        // this.applyFilter();
    }

    onCheckboxChange(val) {  // 
        if (val.checked == true) {
            this.isPriceTag = false;
        }
        else {
            this.isPriceTag = true;
        }



    }

    actionFormName(val) {

        this.isDuePay = false;
        this.slotsArr = [];
        this.step1.reset();
        this.step2.reset();
        this.onSearchClear();
        this.actionName = val;
        this.action = val;
        this.isPriceTag = true;
        this.horizontalStepper.selectedIndex = 0;
        this.step1.controls['mobNum'].enable();
        this.step1.controls['appDate'].setValue(new Date());
        this.appointmentButton = 'Create Appointment';
        // this.horizontalStepperForm = this._formBuilder.group({
        //     step1: this._formBuilder.group({
        //         appDate: new FormControl(new Date()),
        //  this.step2.controls['netPrice'].disable();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

    }
    applyNetPrice(val) {

        if (this.roleID == '1') {
            if (val.modeofPaymentID != 5) {
                var pricList = [];
                var discList = [];
                if (this.horizontalStepperForm.value.step2.price != "") {
                    pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);
                    this.step2.controls['netPrice'].setValue(pricList[0].price);
                }
                if (this.horizontalStepperForm.value.step2.discount != "") {
                    discList = this.discounts.filter(a => a.discountID === this.horizontalStepperForm.value.step2.discount);
                }
                
                if (this.horizontalStepperForm.value.step2.price != "" && this.horizontalStepperForm.value.step2.discount != "") {
                    //   
                    if (discList.length > 0 && pricList.length > 0) {
                        var disco = ((pricList[0].price * discList[0].discount) / 100);
                        this.step2.controls['netPrice'].setValue(pricList[0].price - disco);
                    }
                }
            }

        }
        else {
            if (this.horizontalStepperForm.value.step2.price != "") {
                pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);
                //this.step2.controls['netPrice'].setValue(pricList[0].price);
                this.actualPrice = pricList[0].price;
            }

        }

        // Number(this.horizontalStepperForm.value.step2.price);
    }
    displayFn(user): string {
        return user && user.mobile ? user.mobile : '';
    }
    applyFilter(val) {
        
        val = val.trim(); // Remove whitespace
        val = val.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = val;
        // this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
        let details = this.patients.filter(
            (a) => a.mobile.trim() == val.value.mobile.trim() && a.patient.trim().toLowerCase() == val.value.patient.trim().toLowerCase()
        );
        if (details.length > 0) {
            this.action = 'Patient Exists save new appointment';
            this.appointID = 0;
            this.patientID = details[0].patientID;
            this.step1.controls['firstName'].setValue(details[0].patient);
           // this.step1.controls['lastName'].setValue(details[0].patient);
            this.step1.controls['mobNum'].setValue(details[0].mobile);
            if (this.actionName == 'Update Existing Appointment') {
                this.step1.controls['mobNum'].disable();
            }
            this.step1.controls['age'].setValue(details[0].age);
            this.step1.controls['gender'].setValue(details[0].genderID);
        }
        else {
            this.action = 'New Appointment';
            this.step1.controls['mobNum'].enable();

        }
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this.filterStates(state) : this.filterPatientappointments.slice())
            );
    }
    public doFilter = (value, state) => {
        if (state == 1) {
            this.todayBookings.filter = value.trim().toLocaleLowerCase();
            this.upcomingBookings.filter = '';
            this.patientsappointments.filter = '';
            this.searchKey1 = '';
            this.searchKey2 = '';
        } else if (state == 2) {
            this.upcomingBookings.filter = value.trim().toLocaleLowerCase();
            this.todayBookings.filter = '';
            this.patientsappointments.filter = '';
            this.searchKey = '';
            this.searchKey2 = '';
        } else if (state == 3) {
            this.patientsappointments.filter = value.trim().toLocaleLowerCase();
            this.todayBookings.filter = '';
            this.upcomingBookings.filter = '';
            this.searchKey1 = '';
            this.searchKey = '';
        }
    };
    addUpdateAppointments(val) {
        ;
        let arr = [];
        arr.push({
            AppointmentDate: val.step1.appDate,
            AppointmentTime: val.step1.appTime,
            Doctor: val.step1.docName,
            FirstName: val.step1.firstName,
          //  LastName: val.step1.lastName,
            Mobile: val.step1.mobNum,
            gender: val.step1.gender,
            Age: val.step1.age,
            Status: 7,
            ServiceName: val.step2.serviceName,
            Qty: val.step2.qty,
            Price: val.step2.serviceName,
            Discount: val.step2.disc,
            Tax: val.step2.tax,
            Action: this.action,
        });
        var UploadFile = new FormData();
        UploadFile.append('UserId', JSON.stringify(arr));
        this.patientsService.PostData(UploadFile).then(
            (data: any) => {
                ;
                if (data == 'SUCCESS') {
                } else {
                }
            },
            (err) => { }
        );
    }
    get step1(): any {
        return this.horizontalStepperForm.get('step1');
    }

    get step2(): any {
        return this.horizontalStepperForm.get('step2');
    }

    updateSelect(val) {
        this.horizontalStepper.selectedIndex = 0;
        
        if (val.duePayment != null && val.duePayment != '0.00') {
            this.updateSelectDuePay(val)
        }
        else {
            // 
            this.isDuePay = false;
            this.spinner.show();
            this.action = 'Update Existing Appointment';
            this.actionName = 'Update Appointment';
            this.appointmentButton = 'Update Appointment';
            this.appointID = val.appointmentID;
            this.patientID = val.patientID;
            this.appointmentId = val.appointmentID;

            this.step1.controls['appDate'].setValue(new Date(val.appointmentDate));

            this.getSlotsWithDocIDEdit(val.doctorID, val.slotTime);


            this.step1.controls['docName'].setValue(val.doctorID);
            this.step1.controls['firstName'].setValue(val.patientName);
           // this.step1.controls['lastName'].setValue(val.patientLastName);
            this.step1.controls['mobNum'].setValue(val.mobile);
            this.step1.controls['age'].setValue(val.age);
            // this.step1.controls['status'].setValue(val.statusID);
            this.step1.controls['gender'].setValue(val.genderID);
            this.step2.controls['serviceName'].setValue(val.serviceID);
            this.step2.controls['price'].setValue(val.priceID);
            this.step2.controls['discount'].setValue(val.discountID);
            this.step2.controls['amountPaid'].setValue(val.payment);
            this.step2.controls['modeOfPayment'].setValue(val.modeofPaymentID);
            this.step1.controls['mobNum'].disable();
            // this.step2.controls['netPrice'].disable();
            this.nextDisabled = false;
            if (this.roleID == '1') {
                this.applyNetPrice(val);
            }
            this.spinner.hide();
        }
    }

    updateSelectDuePay(val) {
        // 
        this.isDuePay = true;
        this.isPriceTag = true;
        this.spinner.show();
        this.action = 'Update Existing Appointment';
        this.actionName = 'Update Appointment';
        this.appointmentButton = 'Update Appointment';
        this.appointID = val.appointmentID;
        this.patientID = val.patientID;
        this.appointmentId = val.appointmentID;

        this.step1.controls['appDate'].setValue(new Date(val.appointmentDate));

        this.getSlotsWithDocIDEdit(val.doctorID, val.slotTime);

        
        this.step1.controls['docName'].setValue(val.doctorID);
        this.step1.controls['firstName'].setValue(val.patient);
       // this.step1.controls['lastName'].setValue(val.patient);
        this.step1.controls['mobNum'].setValue(val.mobile);
        this.step1.controls['age'].setValue(val.age);
        // this.step1.controls['status'].setValue(val.statusID);
        this.step1.controls['gender'].setValue(val.genderID);
        this.step2.controls['serviceName'].setValue(val.serviceID);
        this.step2.controls['price'].setValue(val.priceID);
        this.step2.controls['discount'].setValue(val.discountID);
        this.step2.controls['amountPaid'].setValue(val.payment);
        this.step1.controls['mobNum'].disable();
        // this.step2.controls['netPrice'].disable();
        this.step2.controls['modeOfPayment'].setValue(val.modeofPaymentID);
        this.step2.controls['duePayment'].setValue(val.duePayment);
        this.nextDisabled = false;
        if (this.roleID == '1') {
            this.applyNetPrice(val);
        }
        this.spinner.hide();

    }

    // next(val)
    // {
    //     
    //     var slot =val.step1.slot;
    //     if(slot == 0)
    //     {
    //         alert("text");
    //     }
    // }



    addRegisterPatientAppointment(val) {
        
        this.appt.AppointmentID = Number(this.appointID);
        this.appt.registrationID = Number(val.step1.docName);  //
        this.appt.PatientID = Number(this.patientID);  //
        this.appt.ServiceID = Number(val.step2.serviceName);
        //this.appt.SlotID = Number(val.step1.slot.slotID);
        this.appt.Slot = (val.step1.slot.slot);
        //this.appt.StatusID = Number(val.step1.status);
        this.appt.StatusID = Number(7);
        this.appt.ServiceDate = this.datepipe.transform(val.step1.appDate, 'd MMM yyyy');

        this.appt.AppointmentBill = ('Test');  //

        //var disco= ((val.step2.price * discList[0].discount)/100);
        // this.step2.controls['netPrice'].setValue(pricList[0].price - disco);
        if (this.isPriceTag == true) //SkipBilling
        {
            this.appt.modeofPaymentID = val.step2.modeOfPayment;
            this.appt.PriceID = Number(val.step2.price);

            if (this.roleID == '1') {
                this.appt.DiscountID = Number(val.step2.discount);
                if (this.appt.DiscountID == 0) {
                    this.appt.DiscountID = 6;
                }
                this.appt.Payment = (val.step2.amountPaid);  //
            }
            else {
                this.appt.DiscountID = 6;
                var pricList = this.prices.filter(a => a.priceID === this.horizontalStepperForm.value.step2.price);

                this.actualPrice = pricList[0].price;
                this.appt.Payment = this.actualPrice;  //
                this.appt.DuePayment = "0";
            }
            if (this.roleID == '1') {
                var due = Number(this.horizontalStepperForm.value.step2.netPrice) - Number(Number(val.step2.amountPaid) + Number(this.horizontalStepperForm.value.step2.duePayment));
                if (this.isDuePay == true) {
                    //if (Number(due) == Number(this.horizontalStepperForm.value.step2.duePayment)) {
                    if (due == 0) {
                        this.appt.DuePayment = "0";
                    }
                    // }
                    else {
                        this.appt.DuePayment = this.horizontalStepperForm.value.step2.duePayment;
                    }
                    this.appt.Payment = Number(val.step2.amountPaid) + Number(this.horizontalStepperForm.value.step2.duePayment);
                }
                else {

                    if (due > 0) {
                        this.appt.DuePayment = due.toString();
                    }
                    else {
                        this.appt.DuePayment = "0";
                    }
                }
            }

        }
        else {
            this.appt.modeofPaymentID = 5;
            this.appt.PriceID = 6;
            this.appt.Payment = "0";  //
            this.appt.DuePayment = "0";
            this.appt.DiscountID = 6;
        }

        this.appt.Action = this.action;
        this.appt.PatientName = (val.step1.firstName);  //
       // this.appt.PatientLastName = (val.step1.lastName);  //
        this.appt.Mobile = (val.step1.mobNum); //
        this.appt.GenderID = Number(val.step1.gender);
        this.appt.Age = Number(val.step1.age);
        this.appt.PatientStatus = 'Booked'
        let arr = [];
        arr.push(this.appt);
        this.receiptToken = 0;
        this.utilitiesService.addRegisterPatientAppointment(this.appt).subscribe((data) => {

            if (data) {
                
                if (data > 0) {
                    this.receiptToken = data;
                    this._snackBar.open('Appointment Added Successfully...!!', 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        "duration": 2000
                    });

                    this.ngOnInit();
                    this.appt = {};
                    // const dialogRef = this.dialog.open({
                    //     width: '600px',
                    //   });
                } else {
                    this.showError(
                        'Your query is not sent, Please try after some time'
                    );
                    console.log('DB Exception');
                }
            }
        },
            (error) => {
                this.errorMessage = error;
            },
            () => { }
        );
    }

    //Receipt Print
    openCompanyDetailsDialog(): void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.restoreFocus = false;
        dialogConfig.autoFocus = false;
        dialogConfig.role = 'dialog';
        dialogConfig.disableClose = true;

        this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal, dialogConfig);

        this.editCompanyDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed...');
        });

        // let printContents = document.getElementById("component1").innerHTML;
        //     let originalContents = document.body.innerHTML;

        //     document.body.innerHTML = printContents;

        //     window.print();
        //    // window.close();

        //     document.body.innerHTML = originalContents;

    }

    //Receipt Print preception
    ViewPrescption(): void {
        
        const dialogConfig = new MatDialogConfig();
        dialogConfig.restoreFocus = false;
        dialogConfig.autoFocus = false;
        dialogConfig.role = 'dialog';
        dialogConfig.disableClose = true;

        this.presecptionModalDialogRef = this.dialog.open(this.presecptionModal, dialogConfig);

        this.presecptionModalDialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed...');
        });

    }

    closeCompanyDetailsDialog() {
        this.editCompanyDialogRef.close();
        //this.editCompanyDialogRef.close('Pizza!');
    }
    closePrecesptionDialog() {
        this.presecptionModalDialogRef.close();
        //this.editCompanyDialogRef.close('Pizza!');
    }
    print(cmpName) {

        // let printContents = document.getElementById(cmpName).innerHTML;
        // let originalContents = document.body.innerHTML;

        // document.body.innerHTML = printContents;

        // window.print();
        // window.close();

        // document.body.innerHTML = originalContents;

        // window.print();
        this.print1(cmpName);


        // var printContent = document.getElementById(cmpName);
        // var WinPrint = window.open('', '', 'width=1000,height=750');
        // WinPrint.document.write(printContent.innerHTML);
        // WinPrint.document.close();
        // WinPrint.focus();
        // WinPrint.print();
        // WinPrint.close();
        //this.ngOnInit();
        //this.editCompanyDialogRef.close();
        //return false;
    }

    printSingle() {
        //this.showHideDiv= false;
        // this.print1();
    }

    print1(cmpName) {

        let printContents, popupWin;
        printContents = document.getElementById(cmpName).innerHTML;
        popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
        //popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <style>
          body{  width: 99%;}
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
           @media screen {
               @font-face {
                   font-family: 'Source Sans Pro';
                   font-style: normal;
                   font-weight: 400;
                   src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
               }
   
               @font-face {
                   font-family: 'Source Sans Pro';
                   font-style: normal;
                   font-weight: 700;
                   src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
               }
           }
   
           /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
           body,
           table,
           td,
           a {
               -ms-text-size-adjust: 100%; /* 1 */
               -webkit-text-size-adjust: 100%; /* 2 */
           }
   
           /**
           * Remove extra space added to tables and cells in Outlook.
           */
           table,
           td {
               mso-table-rspace: 0pt;
               mso-table-lspace: 0pt;
           }
   
           /**
           * Better fluid images in Internet Explorer.
           */
           img {
               -ms-interpolation-mode: bicubic;
           }
   
           /**
           * Remove blue links for iOS devices.
           */
           a[x-apple-data-detectors] {
               font-family: inherit !important;
               font-size: inherit !important;
               font-weight: inherit !important;
               line-height: inherit !important;
               color: inherit !important;
               text-decoration: none !important;
           }
   
           /**
           * Fix centering issues in Android 4.4.
           */
           div[style*="margin: 16px 0;"] {
               margin: 0 !important;
           }
   
           body {
               width: 100% !important;
               height: 100% !important;
               padding: 0 !important;
               margin: 0 !important;
           }
   
           /**
           * Collapse table borders to avoid space between cells.
           */
           table {
               border-collapse: collapse !important;
           }
   
           a {
               color: #1a82e2;
           }
   
           img {
               height: auto;
               line-height: 100%;
               text-decoration: none;
               border: 0;
               outline: none;
           }
   
           .heading_1 {
               background-color: #fff;
               padding: 36px 24px 0;
               border-top: 3px solid #d4dadf;
               font-family: sans-serif;
               font-size: 21px;
               font-weight: bold;
               letter-spacing: 0.2px;
           }
   
           .tocken_no{
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
       font-size: 16px;
       font-weight: bold;
           }
            .td_style{
               padding: 24px; 
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               width: 50%;padding-bottom: 0px;
               padding-top: 10px;
           }
           
           .td_table{
               text-align: left;
               background-color:#D2C7BA;
                width:100%;
               padding: 12px;
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               font-size: 16px; line-height: 24px;
           }
           .td_table1{
             text-align: left;
              width:100%;
               padding: 12px;
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               font-size: 16px; line-height: 24px;
           }
           .td_table2{
               text-align: left; 
               width:50%;
               padding: 12px; 
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               font-size: 16px; line-height: 24px; 
               border-top: 2px dashed #D2C7BA; 
               border-bottom: 2px dashed #D2C7BA;
           }
           .td_table3{
               text-align: left; 
               width:50%;
               padding: 12px; 
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               font-size: 16px; line-height: 24px; 
               border-top: 2px dashed #D2C7BA; 
               border-bottom: 2px dashed #D2C7BA;
           }
           .Payment_row{
               text-align: left;
               background-color:#ffffff;
               padding: 24px; 
               font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
               font-size: 16px; line-height: 24px;
               
           }
           .payment_Receipt{
               text-align: left;
               background-color: #ffffff;
               padding: 36px 24px 0; 
               border-top: 3px solid #d4dadf;width:30%;
           }
           .Token_No{
           width: 100%; 
           max-width: 600px;
           border-top:1px solid #c1c1c1;
           background-color: #fff;
   
               }
               .Payment_method_bgmcolr{
                   width: 600px;
                   background-color: #fff;
               }
               
               .Adress_row{
                   text-align: left;
                  padding-bottom: 36px; 
                   padding-left: 36px; 
                   font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                   font-size: 16px; line-height: 24px;
               }
   
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();

    }
    toggle() {
        this.showHideDiv = !this.showHideDiv;
    }

    printPresecption(cmpName) {
        let printContents, popupWin;
        printContents = document.getElementById(cmpName).innerHTML;
        popupWin = window.open('', '_blank', 'top=10,left=100,height=900,width=1000');
        popupWin.document.write(`
        <html>
          <head>
            <style>
            body{  width: 99%;}
            /**
             * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
             */
             @media screen {
                 @font-face {
                     font-family: 'Source Sans Pro';
                     font-style: normal;
                     font-weight: 400;
                     src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
                 }
     
                 @font-face {
                     font-family: 'Source Sans Pro';
                     font-style: normal;
                     font-weight: 700;
                     src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
                 }
             }
     
             /**
             * Avoid browser level font resizing.
             * 1. Windows Mobile
             * 2. iOS / OSX
             */
             body,
             table,
             td,
             a {
                 -ms-text-size-adjust: 100%; /* 1 */
                 -webkit-text-size-adjust: 100%; /* 2 */
             }
     
             /**
             * Remove extra space added to tables and cells in Outlook.
             */
             table,
             td {
                 mso-table-rspace: 0pt;
                 mso-table-lspace: 0pt;
             }
     
             /**
             * Better fluid images in Internet Explorer.
             */
             img {
                 -ms-interpolation-mode: bicubic;
             }
     
             /**
             * Remove blue links for iOS devices.
             */
             a[x-apple-data-detectors] {
                 font-family: inherit !important;
                 font-size: inherit !important;
                 font-weight: inherit !important;
                 line-height: inherit !important;
                 color: inherit !important;
                 text-decoration: none !important;
             }
     
             /**
             * Fix centering issues in Android 4.4.
             */
             div[style*="margin: 16px 0;"] {
                 margin: 0 !important;
             }
     
             body {
                 width: 100% !important;
                 height: 100% !important;
                 padding: 0 !important;
                 margin: 0 !important;
             }
     
             /**
             * Collapse table borders to avoid space between cells.
             */
             table {
                 border-collapse: collapse !important;
             }
     
             a {
                 color: #1a82e2;
             }
     
             img {
                 height: auto;
                 line-height: 100%;
                 text-decoration: none;
                 border: 0;
                 outline: none;
             }
     
             .heading_1 {
                 background-color: #fff;
                 padding: 36px 24px 0;
                 border-top: 3px solid #d4dadf;
                 font-family: sans-serif;
                 font-size: 21px;
                 font-weight: bold;
                 letter-spacing: 0.2px;
             }
     
             .tocken_no{
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
         font-size: 16px;
         font-weight: bold;
             }
              .td_style{
                 padding: 24px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 width: 50%;padding-bottom: 0px;
                 padding-top: 10px;
             }
             
             .td_table{
                 text-align: left;
                 background-color:#D2C7BA;
                  width:100%;
                 padding: 12px;
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
             }
             .td_table1{
               text-align: left;
                width:100%;
                 padding: 12px;
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
             }
             .td_table2{
                 text-align: left; 
                 width:50%;
                 padding: 12px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px; 
                 border-top: 2px dashed #D2C7BA; 
                 border-bottom: 2px dashed #D2C7BA;
             }
             .td_table3{
                 text-align: left; 
                 width:50%;
                 padding: 12px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px; 
                 border-top: 2px dashed #D2C7BA; 
                 border-bottom: 2px dashed #D2C7BA;
             }
             .Payment_row{
                 text-align: left;
                 background-color:#ffffff;
                 padding: 24px; 
                 font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                 font-size: 16px; line-height: 24px;
                 
             }
             .payment_Receipt{
                 text-align: left;
                 background-color: #ffffff;
                 padding: 36px 24px 0; 
                 border-top: 3px solid #d4dadf;width:30%;
             }
             .Token_No{
             width: 100%; 
             max-width: 600px;
             border-top:1px solid #c1c1c1;
             background-color: #fff;
     
                 }
                 .Payment_method_bgmcolr{
                     width: 600px;
                     background-color: #fff;
                 }
                 
                 .Adress_row{
                     text-align: left;
                    padding-bottom: 36px; 
                     padding-left: 36px; 
                     font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; 
                     font-size: 16px; line-height: 24px;
                 }
     
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
        );
        popupWin.document.close();

    }


    // searchPatient(val) {
    //     if (this.actionName == 'New Appointment') {
    //         this.applyFilter(val);
    //     }
    //     else if (this.actionName == 'Update Appointment') {
    //         let details = this.patients.filter(
    //             (a) => a.mobile == val && a.appointmentID != val.appointmentID
    //         );
    //         if (details.length > 0) {
    //             this.mobNoAlreadyExists = true;
    //             this.step1.controls['mobNum'].setValue();
    //         }
    //     }
    // }

    deleteAppointment(val) {

        this.spinner.show();
        this.appt.AppointmentID = Number(val.appointmentID);
        this.utilitiesService.deleteAppointment(this.appt).subscribe((data) => {
            if (data) {
                var c = data;
                this._snackBar.open('Appointment Deleted Successfully...!!', '', {
                    "duration": 2000
                });
                this.spinner.hide();
                this.getAllAppointments();

            }
        },
            (error) => {
                this.spinner.hide();
                this.errorMessage = error;
            },

            () => { this.spinner.hide(); }
        );
    }

    showError(msg) {
        this.toastService.show(msg, {
            classname: 'bg-info text-light',
            delay: 4000,
            autohide: true,
            headertext: 'Appointment Details!',
        });
    }


    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    ngAfterViewInit() {
        this.todayBookings.sort = this.sort;
    }

    //==================Code related to Vitals======================//

    createItem(): FormGroup {
        return this._formBuilder.group({
            Image: ['', Validators.required],
            fileName: ['', Validators.required],
            docType: ['', Validators.required],
        });
    }

    createItem1(): FormGroup {
        return this._formBuilder.group({
            Image: ['', Validators.required],
            fileName: ['', Validators.required],
            docType: ['', Validators.required],
        });
    }
    createMedicationItem(): FormGroup {

        return this._formBuilder.group({
            medicine: [''],
            dose: [''],
            when: [''],
            frequencyListMedication: [''],
            duration: [''],
            notes: [''],
        });
    }
    createMedicationItem1(): FormGroup {

        return this._formBuilder.group({
            medicine: [''],
            dose: [''],
            when: [''],
            frequencyListMedication: [''],
            duration: [''],
            notes: ['']
        });
    }

    addItem(): void {
        
        this.items = this.vitalsForm.get('items') as FormArray;
        this.items.push(this.createItem1());
    }

    addMedicationItem(): void {
        
        this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
        this.medicationitems.push(this.createMedicationItem1());
    }

    get employees(): FormArray {
        
        return this.vitalsForm.get('items') as FormArray;
    }

    DeleteItem(idx: number) {
        if (idx != 0) {
            this.items.removeAt(idx);
        }
    }
    DeleteMedicationItem(idx: number) {
        if (idx != 0) {
            this.medicationitems.removeAt(idx);
        }
    }
    validatepri1(e: any) {
        let input;
        input = String.fromCharCode(e.which);
        return !!/[0-9]/.test(input);
    }

    rowData(val) {

        this.patientName = val.patient + " " + "(" + val.gender + ", Age " + val.age + ")"
        this.vitalsForm.reset();
        this.fruits = [];
        this.flag = '1'
        this.PatientID = val.patientID;
        this.AppointmentID = val.appointmentID;
        this.vitalsID = 0;
        
        this.items = this.vitalsForm.get('items') as FormArray;
        this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
        const arr = <FormArray>this.vitalsForm.controls.items;
        arr.controls = [];
        const arr1 = <FormArray>this.vitalsForm.controls.medicationitems;
        arr1.controls = [];
        this.addItem();
        this.addMedicationItem();
    }
    vitalsCrud() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/VitalsCRUD/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.vitalsList = data;
                    this.vitals = data;
                } else {
                }
            },

            () => { }
        );
    }
    getDocs() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/DocsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.docs = data;
                    this.docsList = data;

                } else {
                }
            },

            () => { }
        );
    }

    //     changeDetected(val)
    //     {
    // 
    //         var s=0;
    //         // if(val ==0)
    //         // {
    //         //     // this.horizontalStepperForm.setErrors({
    //         //     //     invalid: true,
    //         //     //   });
    //         // }
    //     }

    getTimeChange(val) {

        if (val == "No Slot") {
            this.isNoSlot = true;
        }
        else {
            this.isNoSlot = false;
        }
    }

    getSlotsWithDocID(val) {
        
        this.selectedDate = this.step1.get('appDate').value
        var d = new Date(this.selectedDate);
        var n = d.getDay();
        let arr = [];
        arr.push({
            DoctorID: val
        })
        var url = 'PatientsAppointments/DoctorsAvailabilitySlots/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.slotsArr = data;
                    if (this.slotsArr.length == 0) {
                        //this.slotsArr[0].slot="No Slot";
                        this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slot' });
                        this.step1.controls['slot'].setValue(this.slotsArr[0]);
                        this.isNoSlot = true;
                        //  this.horizontalStepperForm.setErrors({
                        //                 invalid: true,
                        //              });
                    }
                    else {
                        let selDate = this.datepipe.transform(this.selectedDate, 'dd MMM yyyy');
                        let docAppointmentsOnSelectedDate = this.allAppointments.filter(a => a.doctorID == val && this.datepipe.transform(a.serviceDate, 'dd MMM yyyy') == selDate)
                        let dayOfWeekNumber = d.getDay();
                        // for (var i = 0; i < this.slotsArr.length; i++) {
                        for (var i = this.slotsArr.length; i >= 0; --i) {

                            if (dayOfWeekNumber == 0) {
                                dayOfWeekNumber = 7;
                            }
                            if (i == 0) {
                                if (dayOfWeekNumber != this.slotsArr[0].day) {
                                    this.slotsArr.splice(0, 1);

                                }
                            }
                            else {
                                if (dayOfWeekNumber != this.slotsArr[i - 1].day) {
                                    this.slotsArr.splice(i, 1);

                                }
                                else {
                                    if (docAppointmentsOnSelectedDate.some(e => e.slotTime === this.slotsArr[i].slot)) {
                                        this.slotsArr.splice(i, 1);
                                    }
                                }
                            }
                        }

                    }
                }
                else {


                }
            },

            () => { }
        );
    }

    getSlotsWithDocIDEdit(val, slotTime) {

        this.selectedDate = this.step1.get('appDate').value
        var d = new Date(this.selectedDate);
        var n = d.getDay();
        let arr = [];
        arr.push({
            DoctorID: val
        })
        var url = 'PatientsAppointments/DoctorsAvailabilitySlots/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.slotsArr = data;
                    if (this.slotsArr.length == 0) {
                        //this.slotsArr[0].slot="No Slot";
                        this.slotsArr.push({ day: 7, rowid: 0, doctorid: 0, slot: 'No Slot' });
                        this.step1.controls['slot'].setValue(this.slotsArr[0]);
                        //  this.horizontalStepperForm.setErrors({
                        //                 invalid: true,
                        //              });
                        this.isNoSlot = true;
                    }
                    else {
                        let selDate = this.datepipe.transform(this.selectedDate, 'dd MMM yyyy');
                        //let docAppointmentsOnSelectedDate = this.allAppointments.filter(a => a.doctorID == val && this.datepipe.transform(a.serviceDate, 'dd MMM yyyy') == selDate)
                        //  for (var i = 0; i < this.slotsArr.length; i++) {
                        //      if (docAppointmentsOnSelectedDate.some(e => e.slotTime === this.slotsArr[i].slot)) {
                        //          this.slotsArr.splice(i, 1);
                        //      }
                        //  }
                        let sl = this.slotsArr.filter(a => a.slot == slotTime)
                        this.step1.controls['slot'].setValue(sl[0]);

                    }
                }
                else {


                }
            },

            () => { }
        );
    }

    bindMobileNo(){
        

        // this.horizontalStepperForm.step1.mobNum.setValue(this.searchKey3)
        this.step1.controls['mobNum'].setValue(this.searchKey3);
        // this.horizontalStepperForm.controls.step1['mobNum'].setValue(this.searchKey3);
        //this.horizontalStepperForm.value.step1.mobNum=this.searchKey3
    }

    getComplaints() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/ComplaintsCrud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.complaints = data;
                    this.complaintsList = data;
                } else {
                }
            },

            () => { }
        );
    }
    getVisitReason() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/VisitReason_Crud/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {

                    this.visitReason = data;
                    this.visitReasonList = data;
                } else {
                }
            },

            () => { }
        );
    }
    addUpdateVitals(val) {

        let itemArr = [];
        for (var i = 0; i < val.items.length; i++) {
            if (val.items[i].docType != null) {
                itemArr.push({
                    AppointmentID: this.AppointmentID,
                     DocumentTypeID: val.items[i].docType.documentTypeID,
                    //  , DocTypeNAme: val.items[i].Image
                     DocTypeNAme: "VitalsDocs\\" + val.items[i].Image.split("\\").pop()
                });
            }
            else {
                itemArr.push({
                    AppointmentID: this.AppointmentID,
                    DocumentTypeID: undefined,
                    //  , DocTypeNAme: val.items[i].Image
                     DocTypeNAme: "VitalsDocs\\"
                });
            }
        }
        let medicationArr = [];
        
        for (var i = 0; i < val.medicationitems.length; i++) {

            medicationArr.push({
                vitalsID: this.AppointmentID
                , medicine: val.medicationitems[i].medicine
                , dose: val.medicationitems[i].dose
                , when: val.medicationitems[i].when
                , frequencyListMedication: val.medicationitems[i].frequencyListMedication
                , duration: val.medicationitems[i].duration
                , notes: val.medicationitems[i].notes,

               

                
            });
        }

        let compArr = [];
        for (var i = 0; i < this.fruits.length; i++) {
            compArr.push({ ComplaintName: this.fruits[i] })
        }
        var DoctorCompleted = 0;
        var Status = '';
        if (this.roleID == 2) {
            DoctorCompleted = 1;
            Status = 'Completed';
        }
        else if (this.roleID == 5) {
            Status = 'Arrived';
        }
        let arr = [];
        arr.push({
            flag: Number(this.flag)
            , VitalsID: Number(this.vitalsID)
            , BMI: val.BMI
            , SpO2: val.SpO2
            , BloodGroup: val.bloodGroup
            , BP: val.bloodPressure
            , Pulse: val.pulse
            , Serum_Creatinine: val.serumCreatinine
            , Temperature_F: val.temp
            , VisitReasonID: Number(val.visitReason)
            , DoctorCompleted: Number(DoctorCompleted)
            , Weight: val.weight
            , comp: compArr
            , medicine: medicationArr
            , PatientID: Number(this.PatientID)
            , AppointmentID: Number(this.AppointmentID)
            , vitalDocs: itemArr
            , advice: val.advice
            , nextVisit: val.nextVisit
            , frequency: val.frequency
            , pickADate: val.pickADate
            , status: Status
        })
        var url = 'PatientsAppointments/VitalsCRUD/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            //this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data == '1') {

                   // 
                   // this.Screen = 1;
                    // this.detailData.vitalId = this.afterSaveVitalId;
                    // this.onRowClicked(this.detailData)
                    this.fruits = [];
                    this._snackBar.open('Vitals Added Successfully...!!', 'ok', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        "duration": 2000,
                    });
                   // this.getAllAppointmentsAfterSAve();
                    this.Screen = 1;
                    this.ngOnInit();
                  
                }
                else {

                }
            },

            () => { }
        );
    }
    getAllAppointmentsAfterSAve() {
        this.spinner.show();
        this.utilitiesService.getAllAppointments().subscribe(
            (data) => {
                if (data) {

                    this.allAppointments = data;
                    if (this.detailData)
                        this.afterSaveVitalId = this.allAppointments.filter((a) => a.appointmentID == this.detailData.appointmentID).vitalsID;
                    this.date = new Date();
                    this.date.setHours(0, 0, 0, 0);
                    let todayDate = this.datepipe.transform(this.date, 'dd MMM yyyy');
                    const dateforToday = new Date();

                    if (this.roleID != 2) {
                        //Today Bookings
                        this.todayBookings = data.filter((a) => a.serviceDate == todayDate);
                        this.selection = new Set < this.todayBookings > (true);
                        //Future Bookings
                        this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
                        //All Bookings
                        // this.patientsappointments = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday));
                        this.patientsappointments = data;
                        // this.filterPatientappointments =data.filter((v, i, a) => a.indexOf(v) === i); 
                    }
                    else {
                        // this.registrationID=this.loginDetails.registrationID;

                        this.todayBookings = data.filter((a) => a.serviceDate == todayDate && a.doctorID == this.registrationID);
                        this.selection = new Set < this.todayBookings > (true);
                        //Future Bookings
                        this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday) && a.doctorID == this.registrationID);
                        //All Bookings
                        this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
                    }

                    // //Today Bookings
                    // this.todayBookings = data.filter((a) => a.serviceDate == todayDate);
                    // this.selection = new Set < this.todayBookings > (true);
                    // //Future Bookings
                    // this.upcomingBookings = data.filter((a) => new Date(a.serviceDate) > new Date(dateforToday));
                    // //All Bookings
                    // // this.patientsappointments = data.filter((a) => new Date(a.serviceDate) < new Date(dateforToday));
                    // this.patientsappointments = data;
                    // // this.filterPatientappointments =data.filter((v, i, a) => a.indexOf(v) === i); 

                    this.filterPatientappointments = data.filter(
                        (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient) === i
                    );
                }

                this.todayBookings = new MatTableDataSource(this.todayBookings);
                this.upcomingBookings = new MatTableDataSource(this.upcomingBookings);
                this.patientsappointments = new MatTableDataSource(this.patientsappointments);
                this.detailData.vitalID = this.afterSaveVitalId;
                if (this.roleID == 2) {
                    this.onRowClickedAfterSAve(this.detailData);
                }
                this.todayBookings.filterPredicate = this.createFilter();

                this.filterSelectObj.filter((o) => {
                    o.options = this.getFilterObject(this.todayDataSourceBookings, o.columnProp);
                });

                this.spinner.hide();
            },

            () => {
                this.spinner.hide();
            }
        );
    }
    onRowClickedAfterSAve(row) {

        // this.rowClickedData=row;
        this.Screen = 2;
        this.detailData = row;
        this.viewHistory(row);
        this.fruits = [];
        // this.vitalsForm.reset();
        if (row.vitalsID) {
            this.setValues(row);

        }
        else {
            this.patientName = row.patient + " " + "(" + row.gender + ", Age " + row.age + ")"
            // this.vitalsForm.reset();
            // this.fruits = [];
            
            this.flag = '1'
            this.PatientID = row.patientID;
            this.AppointmentID = row.appointmentID;
            this.vitalsID = 0;
            this.items = this.vitalsForm.get('items') as FormArray;
            this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
            // const arr = <FormArray>this.vitalsForm.controls.items;
            // arr.controls = [];
            // this.addItem();

            // console.log('Row clicked: ', row);
        }
    }
    GetComplaintsXML() {

        this.spinner.show();
        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetComplaintsXML(this.appt).subscribe(
            (data) => {

                if (data) {
                    this.fruits = [];
                    this.complaintsXML = data;
                    for (var i = 0; i < this.complaintsXML.length; i++) {
                        this.fruits.push(data[i].complaintName)
                    }

                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }

    GetDocumentsXML() {

        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetDocumentsXML(this.appt).subscribe(
            (data) => {

                if (data) {

                    this.docsXml = data;
                    this.items = this.vitalsForm.get('items') as FormArray;
                    const arr = <FormArray>this.vitalsForm.controls.items;
                    arr.controls = [];
                    for (var i = 0; i < this.docsXml.length; i++) {
                        let uom = this.docs.filter(a => a.documentTypeID == this.docsXml[i].documentTypeID);
                        this.items.push(this._formBuilder.group({
                            Image: [this.docsXml[i].docTypeNAme],
                            fileName: [this.docsXml[i].docTypeNAme],
                            docType: [uom[0]],
                        }));
                       
                    }
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }
    GetMedicineXML() {

        this.appt.VitalsID = Number(this.vitalsID);
        this.utilitiesService.GetMedicineXML(this.appt).subscribe(
            (data) => {

                if (data) {
                    
                    this.medicineXml = data;
                    this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
                    const arr = <FormArray>this.vitalsForm.controls.medicationitems;
                    arr.controls = [];
                    for (var i = 0; i < this.medicineXml.length; i++) {
                        this.medicationitems.push(this._formBuilder.group({
                            medicine: [this.medicineXml[i].medicine],
                            dose: [this.medicineXml[i].dose],
                            when: [this.medicineXml[i].when],
                            frequencyListMedication: [this.medicineXml[i].frequencyListMedication],
                            duration: [this.medicineXml[i].duration],
                            notes: [this.medicineXml[i].notes]
                        }));
                    
                 }
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }
    setValues(val) {

        this.flag = '2';
        this.vitalsID = val.vitalsID;
        this.PatientID = val.patientID;
        this.AppointmentID = val.appointmentID;
        this.advice = val.advice;
        this.nextvisit = val.nextVisit;

        this.GetComplaintsXML();
        this.GetDocumentsXML();
        this.GetMedicineXML();
        this.vitals = this.vitalsList.filter(a => a.vitalsID === this.vitalsID);
        if (this.vitals.length > 0) {
            
            this.vitalsForm.controls['weight'].setValue(this.vitals[0].weight)
            this.vitalsForm.controls['bloodGroup'].setValue(this.vitals[0].bloodGroup)
            this.vitalsForm.controls['temp'].setValue(this.vitals[0].temperature_F)
            this.vitalsForm.controls['serumCreatinine'].setValue(this.vitals[0].serum_Creatinine)
            this.vitalsForm.controls['bloodPressure'].setValue(this.vitals[0].bp)
            this.vitalsForm.controls['pulse'].setValue(this.vitals[0].pulse)
            this.vitalsForm.controls['SpO2'].setValue(this.vitals[0].spO2)
            this.vitalsForm.controls['BMI'].setValue(this.vitals[0].bmi)
            this.vitalsForm.controls['visitReason'].setValue(this.vitals[0].visitReasonID)
            this.vitalsForm.controls['advice'].setValue(this.vitals[0].advice)
            this.vitalsForm.controls['nextVisit'].setValue(this.vitals[0].nextVisit)
            this.vitalsForm.controls['pickADate'].setValue(this.vitals[0].pickADate)
            this.vitalsForm.controls['frequency'].setValue(this.vitals[0].frequency)
          

        }
    }
    detectFiles(event, item) {

        //this.urls = [];
        let files = event.target.files;
        if (files) {
            for (let file of files) {
                let reader = new FileReader();
                reader.onload = (e: any) => {

                }
                reader.readAsDataURL(file);
            }
            this.fileChange(event);
        }

        if (files.length >= 1) {
            item.patchValue({
                fileName: files[0].name,
            })
        }
    }

    //This is for Uploading Multiple Image
    fileChange(event) {


        let fileList = event.target.files;

        let fileToUpload = <File>fileList[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.http.post(this.API_URL + 'PatientsAppointments/upload', formData, { reportProgress: true })
            .subscribe(data => {

                this.fileName = fileList[0].name;


            });
    }


    public uploadFile = (files) => {

        if (files.length === 0) {
            return;
        }
        this.API_URL + 'PatientsAppointments/upload'
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.http.post(this.API_URL, formData, { reportProgress: true, observe: 'events' })
            .subscribe(event => {

            });
    }


    viewHistory(val) {

        let arr = [];
        arr.push({ PatientID: Number(val.patientID) })
        var url = 'PatientsAppointments/PatientHistory/';
        
        this.utilitiesService.CRUD(arr, url).subscribe(
           
            (data) => {
                
                if (data) {

                    const dateforToday = new Date();
                    this.patientHistory = data;
                    this.patientHistory = this.patientHistory.filter((a) => new Date(a.serviceDate) <= new Date(dateforToday));
                    // this.patientHistoryList = data;
                    // this.patientHistory.splice(0, 1); -- If you need to splice today data in Previous Visit tab 
                    // this.patientHistoryList.splice(0, 1);
                    for (var i = 0; i < this.patientHistory.length; i++) {
                        if (this.patientHistory[i].vitalsID > 0) {
                            this.GetComplaintsListXML(this.patientHistory[i].vitalsID, this.patientHistory[i]);
                            this.GetMedicineListXML(this.patientHistory[i].vitalsID, this.patientHistory[i]);
                            this.GetDocumentListXML(this.patientHistory[i].vitalsID, this.patientHistory[i]);

                        }

                    }
                } else {
                }
            },

            () => { }
        );
    }
    GetComplaintsListXML(val, history) {

        // this.spinner.show();
        this.apptList.VitalsID = val;
        this.utilitiesService.GetComplaintsXML(this.apptList).subscribe(
            (data) => {

                if (data) {
                    // this.fruitsDAta = [];
                    var s = " ";
                    this.complaintsXMLList = data;
                    if (this.complaintsXMLList.length > 0) {
                        for (var i = 0; i < this.complaintsXMLList.length; i++) {
                            if (s == "")
                                data[i].complaintName;
                            else
                                s = s + ',' + data[i].complaintName;
                        }
                        history.complaintName = s;
                    }

                } else {
                    // this.spinner.hide();
                }
            },
            () => { //this.spinner.hide();
            }
        );
    }
    GetMedicineListXML(val, history) {

        this.apptList.VitalsID = val;
        this.utilitiesService.GetMedicineXML(this.apptList).subscribe(
            (data) => {

                if (data) {

                    this.medicineXml = data;
                    //this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
                    // const arr = <FormArray>this.vitalsForm.controls.medicationitems;
                    //  arr.controls = [];
                    this.medicineList = [];
                    for (var i = 0; i < this.medicineXml.length; i++) {
                        this.medicineList.push(this.medicineXml[i]);
                        // this.medicationitems.push(this._formBuilder.group({
                        //     medicine: [this.medicineXml[i].medicine],
                        //     dose: [this.medicineXml[i].dose],
                        //     when: [this.medicineXml[i].when],
                        //     frequencyListMedication: [this.medicineXml[i].frequencyListMedication],
                        //     duration: [this.medicineXml[i].duration],
                        //     notes: [this.medicineXml[i].notes]
                        // }));
                    }
                    history.medicineList = this.medicineList;
                    this.spinner.hide();
                } else {
                    this.spinner.hide();
                }
            },
            () => { this.spinner.hide(); }
        );
    }
    DownloadDocument(fileDownloadPath) {
        this.fileUrl = fileDownloadPath; //"wwwroot/SiteDocument/SiteDemo1/FileDocument.doc" static file path
        this.utilitiesService.DocumentsDownload(this.fileUrl).subscribe(async (event) => {
            let data = event as HttpResponse < Blob > ;
            const downloadedFile = new Blob([data.body as BlobPart], {
                type: data.body?.type
            });
            console.log("ddd", downloadedFile)
            if (downloadedFile.type != "") {
                const a = document.createElement('a');
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                a.download = this.fileUrl;
                a.href = URL.createObjectURL(downloadedFile);
                a.target = '_blank';
                a.click();
                document.body.removeChild(a);
            }
        });
    }
    GetDocumentListXML(val, history) {
        debugger
                this.apptList.VitalsID = val;
                this.utilitiesService.GetDocumentsXML(this.apptList).subscribe(
                    (data) => {
                        debugger
                        if (data) {
        
                            this.docsXml = data;
                            this.docsList = [];
                            for (var i = 0; i < this.docsXml.length; i++) {
                                this.docsList.push(this.docsXml[i]);
                                this.labreportfiles.push(this.docsList[i].docTypeNAme.slice(11))
                            }
                            // var splitted = this.docsList[0].docTypeNAme.slice(11);
                            this.fileUrl=this.docsList[0].docTypeNAme.slice(11);
                            // this.filename=this.docsList[0].value.docTypeNAme;

                            history.documents = this.docsList;
                            this.spinner.hide();
                        } else {
                            this.spinner.hide();
                        }
                    },
                    () => { this.spinner.hide(); }
                );
            }
    appoinmentLink() {
        //this._router.navigate(['/Appointments']);
        this.Screen = 1;
        this.ngOnInit();
    }

    GetMedicineData() {

        
        this.medicineService.GetMedicineList().subscribe(
            (data) => {
                
                if (data) {
                    if (this.roleID == 2) {
                        this.medicinePrescepList = data;
                        // this.medicinePrescepList = this.medicinePrescepList.filter((a) => a.medic == this.registrationID);
                    }
                    else
                        this.medicinePrescepList = data;
                }

            },

            () => {

            }

        );

    }

    // //Receipt Print
    // openPresecptionDialog(): void {
    //     
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.restoreFocus = false;
    //     dialogConfig.autoFocus = false;
    //     dialogConfig.role = 'dialog';
    //     dialogConfig.disableClose=true;

    //     this.presecptionModalDialogRef = this.dialog.open(this.presecptionModal, dialogConfig);

    //     this.presecptionModalDialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed...');
    //     });



    // }
}

