import { ViewEncapsulation, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientsService } from '../patients/patients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
    styleUrls: ['./masters.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class MastersComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    displayedColumns: string[] = ['name', 'mobile', 'email', 'experience', 'qualification', 'institution', 'Actions','Slots'];
    displayedColumnsJr: string[] = ['name', 'mobile', 'email', 'experience', 'qualification', 'institution', 'Actions'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    @ViewChild(MatSort) sort: MatSort;
    private API_URL: any = environment.API_URL;
    flag: string;
    regDetailsJrList: any = [];
    regDetailsFrontList: any = [];
    regDetailsLabList: any = [];
    regDetails: any = [];
    totalRegDetails:any=[];
    genders: any = [];
    specializationsList: any = [];
    specializations: any = [];
    status: any = [];
    statusList: any = [];
    daysArr: any = [];
    timings: any = [];
    slotsArr: any = [];
    slotsArrForChips: any = [];
    slotsArrForChipsList: any = [];
    slotsForm: FormGroup;
    public form: FormGroup;
    registrationID: any;
    roleID: string;
    items: FormArray;
    sun: FormArray;
    mon: FormArray;
    tue: FormArray;
    wed: FormArray;
    thu: FormArray;
    fri: FormArray;
    sat: FormArray;
    dayName: string = 'MONDAY'
    dayID: any = 1
    submitButton: boolean = true;

    doctorID: any;
    msg: any;
    sunItems: FormArray;
    monItems: FormArray;
    tueItems: FormArray;
    wedItems: FormArray;
    thurstems: FormArray;
    friItems: FormArray;
    satItems: FormArray;
    allSlots: any=[];
    actionName: string = 'Doctor'
    status1: any[];
    constructor(public patientsService: PatientsService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        public datepipe: DatePipe,
        private toastService: ToastService,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        private http: HttpClient) {
        this.form = _formBuilder.group({
            name           : ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            email          : ['', Validators.compose([Validators.required, emailValidator])],
            mobile         : ['', Validators.required],
            password       : ['', Validators.required],
            confirmPassword: ['', Validators.required],
            gender         : ['', Validators.required],
            experience     : ['', Validators.required],
            qualification  : ['', ],
            aadharNumber  : ['', Validators.compose([Validators.required, Validators.minLength(12),Validators.maxLength(12)])],
            pancardNumber : ['', Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10)])],
            specializations: ['', Validators.required],
            institution    : ['', ],
            status         : ['', Validators.required],
            aboutMe        : ['', ],
            address        : ['', ],
           

            
        }, { validator: matchingPasswords('password', 'confirmPassword') });

    }

    ngOnInit(): void {
        this.getRegisterationDetails();
        this.getGenders();
        this.getSpecializations();
        this.getStatuses();
        this.daysArr = [];
        this.daysArr.push(
            { Name: 'MONDAY', Value: '1', id: 'weekday-mon'},
            { Name: 'TUESDAY', Value: '2', id: 'weekday-tue'},
            { Name: 'WEDNESDAY', Value: '3', id: 'weekday-wed'},
            { Name: 'THURSDAY', Value: '4', id: 'weekday-thu'},
            { Name: 'FRIDAY', Value: '5', id: 'weekday-fri'},
            { Name: 'SATURDAY', Value: '6', id: 'weekday-sat' },
            { Name: 'SUNDAY', Value: '7', id: 'weekday-sun' },
        )
        this.slotsForm = this._formBuilder.group({
            //items: this._formBuilder.array([this.createItem()], [Validators.required]),
            sun: this._formBuilder.array([]),
            mon: this._formBuilder.array([]),
            tue: this._formBuilder.array([]),
            wed: this._formBuilder.array([]),
            thu: this._formBuilder.array([]),
            fri: this._formBuilder.array([]),
            sat: this._formBuilder.array([]),
        });
        this.timings = [];
        this.timings.push({ "Timings": "12:00 AM" }, { "Timings": "12:30 AM" }, { "Timings": "01:00 AM" }, { "Timings": "01:30 AM" }, { "Timings": "02:00 AM" },
        { "Timings": "02:30 AM" }, { "Timings": "03:00 AM" }, { "Timings": "03:30 AM" }, { "Timings": "04:00 AM" }, { "Timings": "04:30 AM" },
        { "Timings": "05:00 AM" }, { "Timings": "05:30 AM" }, { "Timings": "06:00 AM" }, { "Timings": "06:30 AM" }, { "Timings": "07:00 AM" },
        { "Timings": "07:30 AM" }, { "Timings": "08:00 AM" }, { "Timings": "08:30 AM" }, { "Timings": "09:00 AM" }, { "Timings": "09:30 AM" },
        { "Timings": "10:00 AM" }, { "Timings": "10:30 AM" }, { "Timings": "11:00 AM" }, { "Timings": "11:30 AM" }, { "Timings": "12:00 PM" },
        { "Timings": "12:30 PM" }, { "Timings": "01:00 PM" }, { "Timings": "01:30 PM" }, { "Timings": "02:00 PM" }, { "Timings": "02:30 PM" },
        { "Timings": "03:00 PM" }, { "Timings": "03:30 PM" }, { "Timings": "04:00 PM" }, { "Timings": "04:30 PM" }, { "Timings": "05:00 PM" },
        { "Timings": "05:30 PM" }, { "Timings": "06:00 PM" }, { "Timings": "06:30 PM" }, { "Timings": "07:00 PM" }, { "Timings": "07:30 PM" },
        { "Timings": "08:00 PM" }, { "Timings": "08:30 PM" }, { "Timings": "09:00 PM" }, { "Timings": "09:30 PM" }, { "Timings": "10:00 PM" },
        { "Timings": "10:30 PM" }, { "Timings": "11:00 PM" }, { "Timings": "11:30 PM" })
    }

    getGenders() {
        this.utilitiesService.getAllGenders().subscribe(
            (data) => {
                if (data) {
                    this.genders = data;
                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    getSpecializations() {
        this.utilitiesService.getSpecializations().subscribe(
            (data) => {
                if (data) {
                    this.specializations = data;
                    this.specializationsList = data;

                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    getStatuses() {
        debugger
        this.utilitiesService.getStatuses().subscribe(
            (data) => {
                if (data) {
                    this.status = data;
                    this.status1=[]
                    for(var i=0;i<this.status.length;i++){
if(this.status[i].statusName=="Active"||this.status[i].statusName=="InActive  " ){
    this.status1.push(this.status[i])
}

                    }

                    this.statusList = data;

                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });

                }
            },

            () => { }
        );
    }

    getRegisterationDetails() {
        this.flag = '4'
        let arr = [];
        arr.push({ flag: Number(this.flag) })
        var url = 'PatientsAppointments/RegisterationCRUD/';
        this.utilitiesService.CRUD(arr, url).subscribe(
            (data) => {
                if (data) {                    
                    this.totalRegDetails = data;
                    this.regDetails= this.totalRegDetails.filter((a) => a.roleID == 2);                   
                    this.regDetails = new MatTableDataSource(this.regDetails);
                    this.regDetails.sort = this.sort;

                    this.regDetailsJrList = this.totalRegDetails.filter((a) => a.roleID == 5);
                    this.regDetailsJrList = new MatTableDataSource(this.regDetailsJrList);
                    this.regDetailsJrList.sort = this.sort;

                    this.regDetailsFrontList = this.totalRegDetails.filter((a) => a.roleID == 3);
                    this.regDetailsFrontList = new MatTableDataSource(this.regDetailsFrontList);
                    this.regDetailsFrontList.sort = this.sort;

                    this.regDetailsLabList = this.totalRegDetails.filter((a) => a.roleID == 6);
                    this.regDetailsLabList = new MatTableDataSource(this.regDetailsLabList);
                    this.regDetailsLabList.sort = this.sort;

                    
                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    addActionForm(val)
    {
        this.actionName = 'Jr Doctor'
        this.form.reset();
        this.flag = '1';
        this.roleID = '5';
    }
    addActionFormFrontDesk(val)
    {
        this.actionName = 'Front Desk'
        this.form.reset();
        this.flag = '1';
        this.roleID = '3';
    }
    addActionFormLabAssitant(val)
    {
        this.actionName = 'Lab Assistant'
        this.form.reset();
        this.flag = '1';
        this.roleID = '6';
    }


    openAddForm() {
        this.form.reset();
        this.flag = '1';
        this.roleID = '2';
        this.actionName = 'Doctor';
    }
     
    addUpdateRegDetails(val) {
        debugger;
        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
        }
        else if (this.flag == '2') {
            //this.msg = 'Doctor with same mobile no alreay Exists ..!!';
            this.msg = this.actionName + ' data updated Successfully ..!!';
        }
        let arr = [];
        arr.push({
            flag: Number(this.flag)
            , RoleID         : this.roleID
             ,Name           :val.name           
             ,Email          :val.email          
             ,Mobile         :val.mobile         
             ,Password       :val.password       
             ,GenderID       :val.gender         
             ,Experience     :val.experience     
             ,Qualification  :val.qualification
             ,AadharNumber   :val.aadharNumber
             ,PancardNumber  :val.pancardNumber  
            , SpecializationID:val.specializations
             ,Institution    :val.institution    
             ,StatusID         :val.status         
             ,AboutMe        :val.aboutMe        
            , Address: val.address
            , RegistrationID: this.registrationID          
        })
        var url = 'PatientsAppointments/RegisterationCRUD/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data == '100') {
                    ;
                    this.getRegisterationDetails();
                    this.form.reset();
                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });
                }
                else if (data == '101') {
                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });

                }
                else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    updateSelect(val) {
        debugger;
        this.registrationID = val.RegistrationID
        this.flag = '2';
        this.roleID=val.roleID;
        if(this.roleID =='5')
        {
            this.actionName = 'Jr Doctor';
        }
        else if(  this.roleID = '3')
        {
            this.actionName = 'Front Desk';
        }
        else if(  this.roleID = '6')
        {
            this.actionName = 'Lab Assistant';
        }
        else if(  this.roleID = '2')
        {
            this.actionName = 'Doctor';
        }
        this.registrationID = val.registrationID;
        this.form.controls['name'].setValue(val.name);
        this.form.controls['email'].setValue(val.email);
        this.form.controls['mobile'].setValue(val.mobile);
        this.form.controls['password'].setValue(val.password);
        this.form.controls['confirmPassword'].setValue(val.password);
        this.form.controls['gender'].setValue(val.genderID);
        this.form.controls['experience'].setValue(val.experience);
        this.form.controls['qualification'].setValue(val.qualification);
        this.form.controls['aadharNumber'].setValue(val.aadharNumber);
        this.form.controls['pancardNumber'].setValue(val.pancardNumber);
        this.form.controls['specializations'].setValue(val.specializationID);
        this.form.controls['institution'].setValue(val.institution);
        this.form.controls['status'].setValue(val.statusID);
        this.form.controls['aboutMe'].setValue(val.aboutMe);
        this.form.controls['address'].setValue(val.address);
    }

    deleteDoc(val) {
        debugger;
        this.roleID=val.roleID;
        if(this.roleID =='5')
        {
            this.actionName = 'Jr Doctor';
        }
        else if(  this.roleID = '3')
        {
            this.actionName = 'Front Desk';
        }
        else if(  this.roleID = '6')
        {
            this.actionName = 'Lab Assistant';
        }
        else if(  this.roleID = '2')
        {
            this.actionName = 'Doctor';
        }
        this.flag = '3';
        if (this.flag == '3') {
            this.msg = this.actionName + ' data Deleted successfully ..!!';
        }
        
        let arr = [];
        arr.push({
            flag: Number(this.flag)
            , RoleID         : this.roleID
             ,Name           :val.name           
             ,Email          :val.email          
             ,Mobile         :val.mobile         
             ,Password       :val.password       
             ,GenderID       :val.gender         
             ,Experience     :val.experience     
             ,Qualification  :val.qualification 
             ,AadharNumber  :val.aadharNumber
             ,PancardNumber  :val.PancardNumber  
            , SpecializationID:val.specializations
             ,Institution    :val.institution    
             ,StatusID         :val.status         
             ,AboutMe        :val.aboutMe        
            , Address: val.address
            , RegistrationID: val.registrationID
           
        })
        var url = 'PatientsAppointments/RegisterationCRUD/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data == '100') {
                    ;
                    this.getRegisterationDetails();
                   
                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });
                }                
                else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
        
    }

    createItem(): FormGroup {
        return this._formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
        });
    }

    createItem1(): FormGroup {
        return this._formBuilder.group({
            from: ['', Validators.required],
            to: ['', Validators.required],
        });
    }
    addItem(): void {
        if (this.dayName == 'SUNDAY') {
            this.sun = this.slotsForm.get('sun') as FormArray;
            this.sun.push(this.createItem1());
        }
        else if (this.dayName == 'MONDAY') {
            this.mon = this.slotsForm.get('mon') as FormArray;
            this.mon.push(this.createItem1());
        }
        else if (this.dayName == 'TUESDAY') {
            this.tue = this.slotsForm.get('tue') as FormArray;
            this.tue.push(this.createItem1());
        }
        else if (this.dayName == 'WEDNESDAY') {
            this.wed = this.slotsForm.get('wed') as FormArray;
            this.wed.push(this.createItem1());
        }
        else if (this.dayName == 'THURSDAY') {
            this.thu = this.slotsForm.get('thu') as FormArray;
            this.thu.push(this.createItem1());
        }
        else if (this.dayName == 'FRIDAY') {
            this.fri = this.slotsForm.get('fri') as FormArray;
            this.fri.push(this.createItem1());
        }
        else if (this.dayName == 'SATURDAY') {
            this.sat = this.slotsForm.get('sat') as FormArray;
            this.sat.push(this.createItem1());
        }
        this.submitButton=false;
    }
    get sund(): FormArray {
        return this.slotsForm.get('sun') as FormArray;
    }
    get mond(): FormArray {
        return this.slotsForm.get('mon') as FormArray;
    }
    get tued(): FormArray {
        return this.slotsForm.get('tue') as FormArray;
    }
    get wedd(): FormArray {
        return this.slotsForm.get('wed') as FormArray;
    }
    get thud(): FormArray {
        return this.slotsForm.get('thu') as FormArray;
    }
    get frid(): FormArray {
        return this.slotsForm.get('fri') as FormArray;
    }
    get satd(): FormArray {
        return this.slotsForm.get('sat') as FormArray;
    }
    DeleteItem(idx: number) {
        debugger;
            if (this.dayName == 'SUNDAY') {
                    this.sun.removeAt(idx);
            }
            else if (this.dayName == 'MONDAY') {
                    this.mon.removeAt(idx);
            }
            else if (this.dayName == 'TUESDAY') {
                    this.tue.removeAt(idx);
            }
            else if (this.dayName == 'WEDNESDAY') {
                    this.wed.removeAt(idx);
            }
            else if (this.dayName == 'THURSDAY') {
                    this.thu.removeAt(idx);
            }
            else if (this.dayName == 'FRIDAY') {
                    this.fri.removeAt(idx);
            }
            else if (this.dayName == 'SATURDAY') {
                    this.sat.removeAt(idx);
            }
    }
    

    daysArray(val) {
        
       // let itemArr = [];
        this.slotsArr = [];

        for (var i = 0; i < val.sun.length; i++) {
            this.slotsArr.push({
                  Day: 7
                , Start: val.sun[i].from.Timings
                , Ending: val.sun[i].to.Timings
            });
        }
        for (var i = 0; i < val.mon.length; i++) {
            this.slotsArr.push({
                Day: 1
                , Start: val.mon[i].from.Timings
                , Ending: val.mon[i].to.Timings
            });
        }
        for (var i = 0; i < val.tue.length; i++) {
            this.slotsArr.push({
                Day: 2
                , Start: val.tue[i].from.Timings
                , Ending: val.tue[i].to.Timings
            });
        }
        for (var i = 0; i < val.wed.length; i++) {
            this.slotsArr.push({
                Day: 3
                , Start: val.wed[i].from.Timings
                , Ending: val.wed[i].to.Timings
            });
        }
        for (var i = 0; i < val.thu.length; i++) {
            this.slotsArr.push({
                Day: 4
                , Start: val.thu[i].from.Timings
                , Ending: val.thu[i].to.Timings
            });
        }
        for (var i = 0; i < val.fri.length; i++) {
            this.slotsArr.push({
                Day: 5
                , Start: val.fri[i].from.Timings
                , Ending: val.fri[i].to.Timings
            });
        }
        for (var i = 0; i < val.sat.length; i++) {
            this.slotsArr.push({
                Day: 6
                , Start: val.sat[i].from.Timings
                , Ending: val.sat[i].to.Timings
            });
        }
       // this.slotsArr = [];
       // this.slotsArr = itemArr;
        
    }

    addSlots(val) {
        
        this.daysArray(val);
        let arr = [];
        arr.push({
            flag: '1'
            , DoctorID: this.doctorID
            , slots: this.slotsArr
        })
        var url = 'PatientsAppointments/DoctorsAvailability/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data == '100') {;
                    this._snackBar.open('Slot added successfully ..!!', 'ok', {
                        "duration": 2000
                    });
                    val.Name = 'MONDAY';
                    val.Value = 1;
                    this.day(val)
                }
                else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },

            () => { }
        );
    }

    rowData(val) {
        debugger;
        this.doctorID = val.registrationID;
        this.slotsArrForChips = []
        this.slotsArrForChipsList = []
        this.dayName == 'MONDAY'
        val.Name = 'MONDAY';
        val.Value = 1;
        this.day(val)
    }
    day(val) {
        debugger;
        //this.slotsArrForChips = []
        this.dayName = val.Name;
        this.dayID = val.Value;
        let arr = [];
        arr.push({
            DoctorID: this.doctorID
        })
        var url = 'PatientsAppointments/GetAvailabilityXML/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                
                if (data) {
                    ;
                    this.allSlots = [];
                    this.allSlots = data;
                    this.slotsArrForChips = []
                    this.slotsArrForChipsList = []
                    this.slotsArrForChipsList =data
                    this.slotsArrForChips = this.slotsArrForChipsList.filter(a => a.day == this.dayID)
                    this.availSlots();
                }
                else {

                }
            },

            () => { }
        );
    }
    //items: this._formBuilder.array([this.createItem()], [Validators.required]),

    availSlots() {
        debugger
        this.sun = this.slotsForm.get('sun') as FormArray;
      //  this.monItems = this.slotsForm.get('mon') as FormArray;
        this.mon = this.slotsForm.get('mon') as FormArray;
        // this.tueItems = this.slotsForm.get('tue') as FormArray;
        // this.wedItems = this.slotsForm.get('wed') as FormArray;
        // this.thurstems= this.slotsForm.get('thu') as FormArray;
        // this.friItems = this.slotsForm.get('fri') as FormArray;
        // this.satItems = this.slotsForm.get('sat') as FormArray;
        this.tue = this.slotsForm.get('tue') as FormArray;
        this.wed = this.slotsForm.get('wed') as FormArray;
        this.thu= this.slotsForm.get('thu') as FormArray;
        this.fri = this.slotsForm.get('fri') as FormArray;
        this.sat = this.slotsForm.get('sat') as FormArray;

        const sunArr = <FormArray>this.slotsForm.controls.sun;
        const monArr = <FormArray>this.slotsForm.controls.mon;
        const tueArr = <FormArray>this.slotsForm.controls.tue;
        const wedArr = <FormArray>this.slotsForm.controls.wed;
        const thuArr = <FormArray>this.slotsForm.controls.thu;
        const friArr = <FormArray>this.slotsForm.controls.fri;
        const satArr = <FormArray>this.slotsForm.controls.sat;


        sunArr.controls = [];
        monArr.controls = [];
        tueArr.controls = [];
        wedArr.controls = [];
        thuArr.controls = [];
        friArr.controls = [];
        satArr.controls = [];

        for (var i = 0; i < this.allSlots.length; i++) {
            let st1 = this.timings.filter(a => a.Timings === this.allSlots[i].start);
            let to1 = this.timings.filter(a => a.Timings === this.allSlots[i].ending);
            let st = st1[0]
            let to = to1[0]

            if (this.allSlots[i].day == 7) {
                this.sun.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 1) {
                // this.monItems.push(this._formBuilder.group({
                //     from: [st, Validators.required],
                //     to: [to, Validators.required],
                // }));
                 this.mon.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 2) {
                this.tue.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 3) {
                this.wed.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 4) {
                this.thu.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 5) {
                this.fri.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
            else if (this.allSlots[i].day == 6) {
                this.sat.push(this._formBuilder.group({
                    from: [st, Validators.required],
                    to: [to, Validators.required],
                }));
            }
        }
    }
}


export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password = group.controls[passwordKey];
        let passwordConfirmation = group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({ mismatchedPasswords: true })
        }
    }
}
