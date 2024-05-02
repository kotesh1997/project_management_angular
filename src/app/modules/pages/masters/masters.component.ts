import { ViewEncapsulation, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientsService } from '../patients/patients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, PlatformLocation } from '@angular/common';
import { AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
     FormArray,
     
     
     
} from '@angular/forms';
import { GeneralService } from '../../../Services/general.service';
import { UtilitiesService } from 'app/Services/utilities.service';
import { ToastService } from 'app/Services/toastservice';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
    styleUrls: ['./masters.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class MastersComponent implements OnInit {
    
    selectedGender
  myForm: FormGroup;
 
    selected = 'option1';

    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('Frontdeskpag') Frontdeskpag: MatPaginator;
    @ViewChild('Assdocpag') Assdocpag: MatPaginator;

    @ViewChild('LabAsspag') LabAsspag: MatPaginator;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('drawer', { static: false }) drawer: FuseDrawerComponent; // Replace 'yourDrawer' with your drawer name

//   @ViewChild('paginatorPageSize') paginatorPageSize: MatPaginator;
//   dataSourceWithPageSize = new MatTableDataSource<any>;

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

    regDetails1 = new MatTableDataSource(this.regDetailsLabList);

    regDetails: any = [];
    totalRegDetails:any=[];
    genders: any = [];
    specializationsList: any = [];
    specializations: any = [];
    status: any = [];
    submitbtn:any;
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
    newDayArry=[];
    Updatebtn: boolean;
    submitButton1: boolean=false;
    searchKey: string;
    searchKey1: string;
    searchKey2: string;
    searchKey3: string;
    labassts: boolean=true;
    frontdesks: boolean=true;
    assdoctortab: boolean=true;
    doctortab: boolean=true;
    changedmon: boolean;
    changedtue: boolean;
    changedwed: boolean;
    changedthu: boolean;
    changedfri: boolean;
    changedsat: boolean;
    changedsun: boolean;
    GetSlots: FormGroup;
    orgslotsa: boolean;
    orgslots: any=false;
    dataset: any[];
    selectedSlots:{start:any,ending:any,day:any}[]=[];
    availbleSlots: any=[];
    selectedDay: number=1;
    addedTimeSlots1: { start: any; ending: any; day: any; }[];
    constructor(public patientsService: PatientsService,
        private _fuseconfirmationservice:FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        public datepipe: DatePipe,
        private toastService: ToastService,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        private http: HttpClient,
        private fb: FormBuilder,
        private platformlocation: PlatformLocation

    ) {
        history.pushState(null, '', location.href);
        this.platformlocation.onPopState(() => {
            history.pushState(null, '', location.href);
        });  
            
        this.form = _formBuilder.group({
            name           : ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            email          : ['', Validators.compose([Validators.required, emailValidator])],
            mobile         : ['', [
                Validators.required, // Required field
                Validators.pattern(/^[0-9]{10}$/) // Matches a 10-digit number
              ]],
            password       : ['', Validators.required],
            confirmPassword: ['', Validators.required],
            // gender         : [''],
            gender: [1, [Validators.required]],
            // gender: ['1'],
            experience     : ['', ],
            qualification  : ['', ],
            aadharNumber  : ['', Validators.compose([ Validators.minLength(12),Validators.maxLength(12)])],
            pancardNumber : ['', Validators.compose([ Validators.minLength(10),Validators.maxLength(10)])],
            specializations: ['', ],
            institution    : ['', ],
            status         : ['', Validators.required],
            aboutMe        : ['', ],
            address        : ['', ],
           

            
        }, { validator: matchingPasswords('password', 'confirmPassword') });

    }

    ngOnInit(): void {
        // if(this.mon == null){
        //     this.addItem()
        // }

        // this.addItem();

        this.submitbtn=true;
        this.getRegisterationDetails();
        this.getGenders();
        this.getSpecializations();
        this.getStatuses();
        this.daysArr = [];
        
        this.daysArr.push(
            { Name: 'MONDAY', Value: '1', id: 'weekday-mon', isActive:false},
            { Name: 'TUESDAY', Value: '2', id: 'weekday-tue', isActive:false},
            { Name: 'WEDNESDAY', Value: '3', id: 'weekday-wed', isActive:false},
            { Name: 'THURSDAY', Value: '4', id: 'weekday-thu', isActive:false},
            { Name: 'FRIDAY', Value: '5', id: 'weekday-fri', isActive:false},
            { Name: 'SATURDAY', Value: '6', id: 'weekday-sat' , isActive:false},
           //  { Name: 'SUNDAY', Value: '7', id: 'weekday-sun' , isActive:false},
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
       
        var days=""
        var today = (new Date()).getDay();
        if(today==1){
            days="SUNDAY"
        }
        else if(today==1){
            days="MONDAY"
        }
        else if(today==2){
            days="TUESDAY"
        }
        else if(today==3){
            days="WEDNESDAY"
        }
        else if(today==4){
            days="THURSDAY"
        }
        else if(today==5){
            days="FRIDAY"
        }
        else if(today==6){
            days="SATURDAY"
        }
        var data={
            Name:days,
            Value:today
        }
       
       // this.day(data);
    
    }

    defaultSlot(){
    const newSlot={
       start:'',
       ending:'',
       day:this.selectedDay
    }
    this.availbleSlots.push(newSlot)
    this.slotbinding()
    }


    slotbinding(){
        debugger
    this.selectedSlots = []

    this.selectedSlots = this.availbleSlots.filter(a => a.day === this.selectedDay);
   console.log("check Week",this.selectedSlots)

    const slot = this.availbleSlots.filter(a => a.day == this.selectedDay);
    if (slot == undefined || slot == null || slot.length == 0) {
      this.defaultSlot();
    }


    const slot1 = this.availbleSlots.filter(a => a.day == this.selectedDay);
    const slot2 = [];
 
    this.selectedSlots = slot1;
    // if (this.selectedSlots.length > 0) {
    //     let lastObject = this.selectedSlots[this.selectedSlots.length - 1];
      
    //     console.log(lastObject);
    //     if (lastObject.start !== ''&& lastObject.ending !== ''){
    //         const newSlot={
    //             start:'',
    //             ending:'',
    //             day:this.selectedDay
    //          }
    //          this.selectedSlots.push(newSlot)
    //     }

    //   } else {
    //     console.log('lastobject',"The array is empty, so there is no last object to access.");
    //   }
    }




    isTimeSlotsValid():boolean{
        return this.selectedSlots.every(group => group.start&&group.ending)
    }

    addSlot(){
        debugger
        console.log("SelectedSlots",this.selectedSlots)
        const newSlot={
            start:'',
            ending:'',
            day:this.selectedDay
         }
         this.availbleSlots.push(newSlot)
         this.slotbinding()  
    }

    dayToggle(id){
    this.isAllDays=false;
     this.selectedDay=id
     this.slotbinding()  
    }

    change1(start,end){
    debugger
    if(start && end)
    {
        if(this.isAllDays){
            this.addedTimeSlots1 = [];
  
      let aa = this.selectedSlots;
      console.log("aa", aa);
  
      aa.forEach((each) => {
        for (let j = 1; j <= 6; j++) {
          if (j !== this.selectedDay) {
            const bb = {
              start: each.start,
              ending: each.ending,
              day: j,
              // interviewermasterId: each.interviewermasterId
            };
            this.addedTimeSlots1.push(bb);
          }
        }
      });

  
      // Filter out objects with empty "start" and "ending" properties
      const filteredAvailableSlots = this.availbleSlots.filter((slot) => slot.start !== "" && slot.ending !== "");
      this.addedTimeSlots1 = this.addedTimeSlots1.filter((slot) => slot.start !== "" && slot.ending !== "");
      // Combine the arrays without duplicates
      const combinedArray = [...filteredAvailableSlots, ...this.addedTimeSlots1];
  
      // Remove duplicates within the same day
      const uniqueSlotsPerDay = {};
      this.availbleSlots = combinedArray.filter((slot) => {
        const key = `${slot.day}_${slot.start}_${slot.ending}`;
        if (!uniqueSlotsPerDay[key]) {
          uniqueSlotsPerDay[key] = true;
          return true;
        }
        return false;
      });
  
      console.log('1117', this.availbleSlots);
      this.slotbinding();
        }

    }
    }



    selectedRowName: string = '';

// Function to set the selected doctor's name
updateSelect1(doctor) {
  this.selectedRowName = doctor.name;
}
isAllDays:boolean=false;

onToggleChange(event: MatSlideToggleChange) {
    debugger;
    if (event.checked) {
      this.isAllDays = event.checked;
      this.addedTimeSlots1 = [];
  
      let aa = this.selectedSlots;
      console.log("aa", aa);
  
      aa.forEach((each) => {
        for (let j = 1; j <= 6; j++) {
          if (j !== this.selectedDay) {
            const bb = {
              start: each.start,
              ending: each.ending,
              day: j,
              // interviewermasterId: each.interviewermasterId
            };
            this.addedTimeSlots1.push(bb);
          }
        }
      });

  
      // Filter out objects with empty "start" and "ending" properties
      const filteredAvailableSlots = this.availbleSlots.filter((slot) => slot.start !== "" && slot.ending !== "");
      this.addedTimeSlots1 = this.addedTimeSlots1.filter((slot) => slot.start !== "" && slot.ending !== "");
      // Combine the arrays without duplicates
      const combinedArray = [...filteredAvailableSlots, ...this.addedTimeSlots1];
  
      // Remove duplicates within the same day
      const uniqueSlotsPerDay = {};
      this.availbleSlots = combinedArray.filter((slot) => {
        const key = `${slot.day}_${slot.start}_${slot.ending}`;
        if (!uniqueSlotsPerDay[key]) {
          uniqueSlotsPerDay[key] = true;
          return true;
        }
        return false;
      });
  
      console.log('1117', this.availbleSlots);
      this.slotbinding();
  
    } else if (!event.checked) {
      this.isAllDays = event.checked;
    }
  }
  
  
  

onToggleChanges(event:MatSlideToggleChange){

}

    

    // getGenders() {
    //     this.utilitiesService.getAllGenders().subscribe(
    //         (data) => {
    //             if (data) {
    //                 this.genders = data;
    //                 console.log("genders", this.genders)
    //             } else {
    //                 this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
    //                     "duration": 2000
    //                 });
    //             }
    //         },

    //         () => { }
    //     );
    // }
    getGenders() {
        this.utilitiesService.getAllGenders().subscribe(
          (data) => {
            if (data) {
              this.genders = data;
              console.log("genders", this.genders);
              this.selectedGender=this.genders[0].genderID
    
              // Set the default value based on your data
              const defaultGender = 'Male'; // You can change this as needed
              this.myForm.get('gender').setValue(defaultGender);
            } else {
              this._snackBar.open('Something went wrong, please try again later.', 'OK', {
                duration: 2000,
              });
            }
          },
          () => {}
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
                    if(this.regDetails.length>0){
                        this.doctortab=true
                    }
                    else{
                        this.doctortab=false
                    }
                    
                    this.regDetails1 = new MatTableDataSource(this.regDetails);
                    this.regDetails1.paginator = this.paginator;
                    this.regDetails.sort = this.sort;

                    this.regDetailsJrList = this.totalRegDetails.filter((a) => a.roleID == 5);
                    if(this.regDetailsJrList.length>0){
                        this.assdoctortab=true
                    }
                    else{
                        this.assdoctortab=false
                    }
                    this.regDetailsJrList = new MatTableDataSource(this.regDetailsJrList);
                    this.regDetailsJrList.sort = this.sort;
                    this.regDetailsJrList.paginator = this.Assdocpag;

                    this.regDetailsFrontList = this.totalRegDetails.filter((a) => a.roleID == 3);
                    if(this.regDetailsFrontList.length>0){
                        this.frontdesks=true
                    }
                    else{
                        this.frontdesks=false
                    }
                    this.regDetailsFrontList = new MatTableDataSource(this.regDetailsFrontList);
                    this.regDetailsFrontList.sort = this.sort;
                     this.regDetailsFrontList.paginator = this.Frontdeskpag;

                    this.regDetailsLabList = this.totalRegDetails.filter((a) => a.roleID == 6);
                    if(this.regDetailsLabList.length>0){
                        this.labassts=true
                    }
                    else{
                        this.labassts=false
                    }
                    this.regDetailsLabList = new MatTableDataSource(this.regDetailsLabList);
                    this.regDetailsLabList.sort = this.sort;
                    this.regDetailsLabList.paginator = this.LabAsspag;

                    
                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        "duration": 2000
                    });
                }
            },



            () => { }
        );

        // this.patientsappointments = new MatTableDataSource(this.patientHistory);
        // this.patientsappointments.paginator = this.paginator;

    }

    addActionForm(val)
    {
        this.actionName = 'Asst Doctor'
        this.form.reset();
        this.flag = '1';
        this.roleID = '5';
    }
    addActionFormFrontDesk(val)
    {this.Updatebtn=false;
        this.submitbtn=true;

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
        this.actionName = 'New Doctor';
        this.submitbtn=true;
        this.Updatebtn=false;
        this.form.controls['gender'].setValue(1);

    }
     
    addUpdateRegDetails(val) {
       debugger
        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
            // this.drawer.close()
           
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
            , SpecializationID:0
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
                    this.drawer.close();
                    this.form.reset();

                    this._snackBar.open(this.msg, 'ok', {
                        "duration": 2000
                    });
                }
                else if (data == '101') {
                    // this._snackBar.open(this.msg, 'ok', {
                    //     "duration": 2000
                    // });
                    this._snackBar.open('Email already Exist ..!!', 'No', {
                        "duration": 2000
                    });

                }
                else if (data == '102') {
                  
                    this._snackBar.open('Mobile Number already Exist ..!!', 'No', {
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
        debugger
       
        this.registrationID = val.RegistrationID
        this.flag = '2';
        this.roleID=(val.roleID).toString();
        if(this.roleID =='5')
        {
            this.actionName = 'Asst Doctor';
        }
        else if(  this.roleID == '3')
        {
            this.actionName = 'Front Desk';
        }
        else if(  this.roleID == '6')
        {
            this.actionName = 'Lab Assistant';
        }
        else if(  this.roleID == '2')
        {
            this.actionName = val.name;
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

        this.submitbtn=false;
        this.Updatebtn=true;
    }

 
    public doFilter1 = (value, state) => {
        debugger
        var sd=value.trim().toLocaleLowerCase()
            this.regDetails1.filter = value.trim().toLocaleLowerCase()
            // this.upcomingBookings.filter =  '';
            // this.patientsappointments.filter = '';
            this.searchKey3 = '';
            var value1='';
           
            this.regDetailsJrList.filter = value1.trim().toLocaleLowerCase()
            this.regDetailsFrontList.filter = value1.trim().toLocaleLowerCase()
            this.regDetailsLabList.filter = value1.trim().toLocaleLowerCase()


             this.searchKey2 = '';
            this.searchKey1 = '';
      
    };
    public doFilter2 = (value, state) => {
        debugger
        var sd=value.trim().toLocaleLowerCase()
            this.regDetailsJrList.filter = value.trim().toLocaleLowerCase()
            // this.upcomingBookings.filter =  '';
            // this.patientsappointments.filter = '';

             this.searchKey = '';
             this.searchKey2 = '';
            this.searchKey3 = '';
            var value1='';
           
            this.regDetails.filter = value1.trim().toLocaleLowerCase()
            this.regDetailsFrontList.filter = value1.trim().toLocaleLowerCase()
            this.regDetailsLabList.filter = value1.trim().toLocaleLowerCase()

      
    };
    public doFilter3 = (value, state) => {
        
        var sd=value.trim().toLocaleLowerCase()
            this.regDetailsFrontList.filter = value.trim().toLocaleLowerCase()
            // this.upcomingBookings.filter =  '';
            // this.patientsappointments.filter = '';
             this.searchKey = '';
             this.searchKey1 = '';
             this.searchKey3 = '';
             var value1='';
           
             this.regDetails.filter = value1.trim().toLocaleLowerCase()
             this.regDetailsJrList.filter = value1.trim().toLocaleLowerCase()
             this.regDetailsLabList.filter = value1.trim().toLocaleLowerCase()

      
    };
    public doFilter4 = (value, state) => {
        
        var sd=value.trim().toLocaleLowerCase()
            this.regDetailsLabList.filter = value.trim().toLocaleLowerCase()
            // this.upcomingBookings.filter =  '';
            // this.patientsappointments.filter = '';
             this.searchKey = '';
             this.searchKey1 = '';
             this.searchKey2 = '';
             var value1='';
           
             this.regDetails.filter = value1.trim().toLocaleLowerCase()
             this.regDetailsJrList.filter = value1.trim().toLocaleLowerCase()
             this.regDetailsFrontList.filter = value1.trim().toLocaleLowerCase()
      
    };
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
    submitEnable:boolean=false;
    chnaged(tme:any,id:any){
       
        var data1=[];
        this.dataset=[];
        if(tme.value.from&&tme.value.to){
            this.submitEnable=true
        }
        else{
            this.submitEnable=false
        }
        this.dataset.push({
            Day: id
            , Start: tme.value.from
            , Ending: tme.value.to
        })
    }
    chnaged1(time:any,id:any){
        console.log("Selected Slots",this.selectedSlots)
        if(time.value.from&&time.value.to){
            this.submitEnable=true
        }
        else{
            this.submitEnable=false
        }
        // var data1=[];
        // this.dataset=[];
        // this.dataset.push({
        //     Day: 7
        //     , Start: time.value.from
        //     , Ending: time.value.to
        // })
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
        this.submitEnable=false

if(!this.orgslots){

    this.GetSlots=this.slotsForm;
    this.orgslots=true;
    console.log("GetSlots11",this.GetSlots)

}
        this.submitButton=false;
        this.submitButton1=true;
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
    // DeleteItem(idx: number) {
    //     debugger;
    //         if (this.dayName == 'SUNDAY') {
    //                 this.sun.removeAt(idx);
    //         }
    //         else if (this.dayName == 'MONDAY') {
    //                 this.mon.removeAt(idx);
    //         }
    //         else if (this.dayName == 'TUESDAY') {
    //                 this.tue.removeAt(idx);
    //         }
    //         else if (this.dayName == 'WEDNESDAY') {
    //                 this.wed.removeAt(idx);
    //         }
    //         else if (this.dayName == 'THURSDAY') {
    //                 this.thu.removeAt(idx);
    //         }
    //         else if (this.dayName == 'FRIDAY') {
    //                 this.fri.removeAt(idx);
    //         }
    //         else if (this.dayName == 'SATURDAY') {
    //                 this.sat.removeAt(idx);
    //         }
    // }



    // deleteSlot(selectedIndex:number){
    //     debugger
    //    const confirmation = this._fuseconfirmationservice.open({
    //     title: 'Delete Slot',
    //     message: 'Are you sure you want to delete this slot?',
    //     actions: {
    //       confirm: {
    //         label: 'Delete',
    //                   }
    //     }
    //   });

    //   confirmation.afterClosed().subscribe((result) => {
    //     if (result === 'confirmed') {

    //         if (selectedIndex >= 0 && selectedIndex < this.selectedSlots.length) {
    //             // Get the item to be removed from this.selectedSlots
    //             const removedItem = this.selectedSlots[selectedIndex];
            
    //             // Find the index of the corresponding item in this.availbleSlots
    //             const availbleIndex = this.availbleSlots.findIndex(
    //               (item) =>
    //                 item.day === removedItem.day &&
    //                 item.start === removedItem.start &&
    //                 item.ending === removedItem.ending
    //             );
            
    //             // Remove the item from this.selectedSlots
    //             this.selectedSlots.splice(selectedIndex, 1);
            
    //             // Remove the corresponding item from this.availbleSlots if the index is found
    //             if (availbleIndex !== -1) {
    //               this.availbleSlots.splice(availbleIndex, 1);
    //             }
    //           }
    //           const availbleSlots2 = this.availbleSlots.filter((slot) => slot.start !== "" && slot.ending !== "");

    //           let arr = [];
    //           arr.push({
    //               flag: '1'
    //               , DoctorID: this.doctorID
    //               , slots: availbleSlots2
    //           })
    //           var url = 'PatientsAppointments/DoctorsAvailability/';
    //           this.utilitiesService.addUpdateVitals(arr, url).subscribe(
    //               (data) => {
    //                   if (data == '100') {;
    //                       this._snackBar.open('Slot deleted successfully ..!!', 'ok', {
    //                           "duration": 2000
    //                       });
    //                       // val.Name = 'MONDAY';
    //                       // val.Value = 1;
    //                       // this.day(val)
    //                   }
    //                   else {
    //                       this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
    //                           "duration": 2000
    //                       });
    //                   }
    //               },
      
    //               () => { }
    //           );
    //           console.log("After Delete",this.availbleSlots)
    //        }
    //     });
       
    // }

    deleteSlot(selectedIndex: number) {
        const userConfirmation = window.confirm('Are you sure you want to delete this slot?');
    
        if (userConfirmation) {
            if (selectedIndex >= 0 && selectedIndex < this.selectedSlots.length) {
                const removedItem = this.selectedSlots[selectedIndex];
    
                const availbleIndex = this.availbleSlots.findIndex(
                    (item) =>
                        item.day === removedItem.day &&
                        item.start === removedItem.start &&
                        item.ending === removedItem.ending
                );
    
                this.selectedSlots.splice(selectedIndex, 1);
    
                if (availbleIndex !== -1) {
                    this.availbleSlots.splice(availbleIndex, 1);
                }
            }
    
            const availbleSlots2 = this.availbleSlots.filter((slot) => slot.start !== "" && slot.ending !== "");
    
            let arr = [];
            arr.push({
                flag: '1',
                DoctorID: this.doctorID,
                slots: availbleSlots2
            });
            var url = 'PatientsAppointments/DoctorsAvailability/';
            this.utilitiesService.addUpdateVitals(arr, url).subscribe(
                (data) => {
                    if (data == '100') {
                        this._snackBar.open('Slot deleted successfully ..!!', 'ok', {
                            "duration": 2000
                        });
                    } else {
                        this._snackBar.open('Something went wrong please try again later ..!!', 'ok', {
                            "duration": 2000
                        });
                    }
                },
                () => { }
            );
            console.log("After Delete", this.availbleSlots);
        }
    }
     



    DeleteItem(idx: number): void {
       
        // Display a confirmation dialog
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
      
        // If the user confirms, delete the item
        if (isConfirmed) {
          if (this.dayName == 'SUNDAY') {
            this.sun.removeAt(idx);
          } else if (this.dayName == 'MONDAY') {
            this.mon.removeAt(idx);
          } else if (this.dayName == 'TUESDAY') {
            this.tue.removeAt(idx);
          } else if (this.dayName == 'WEDNESDAY') {
            this.wed.removeAt(idx);
          } else if (this.dayName == 'THURSDAY') {
            this.thu.removeAt(idx);
          } else if (this.dayName == 'FRIDAY') {
            this.fri.removeAt(idx);
          } else if (this.dayName == 'SATURDAY') {
            this.sat.removeAt(idx);
          }
          this.slotsArrForChips.splice(idx, 1);
          this.submitEnable=true
         
        }
      }
      

    daysArray(val) {



if(this.isAllDays){

    this.dataset
    
    this.slotsArr = [];
    if(val.sun.length!=0){
        for (var i = 0; i < val.sun.length; i++) {
            if(val.sun[0].from !=null && val.sun[0].from !="" ){
            this.slotsArr.push({
                  Day: 7
                , Start: val.sun[i].from.Timings
                , Ending: val.sun[i].to.Timings
            });
        }
        
        
        else{
            val.sun=[];
        }
        
        
        
        } 
        // if(this.dataset[0].Day !=7){
        //     this.slotsArr.push({
        //         Day: 7
        //       , Start: this.dataset[0].Start.Timings
        //       , Ending: this.dataset[0].Ending.Timings
        //     });
        // }
       
    }
    // else{
    //     this.slotsArr.push({
    //         Day: 7
    //       , Start: this.dataset[0].Start.Timings
    //       , Ending: this.dataset[0].Ending.Timings
    //     });
    // }
    
    if(val.mon.length!=0){
    for (var i = 0; i < val.mon.length; i++) {
        if(val.mon[0].from !=null && val.mon[0].from !=""){
        this.slotsArr.push({
            Day: 1
            , Start: val.mon[i].from.Timings
            , Ending: val.mon[i].to.Timings
        });
    }
    else{
        val.mon=[];
    }
  
} 
if(this.dataset[0].Day !=1){
    this.slotsArr.push({
        Day: 1
      , Start: this.dataset[0].Start.Timings
      , Ending: this.dataset[0].Ending.Timings
    }); 
    }
    }
    else{
        this.slotsArr.push({
            Day: 1
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    }
    
    if(val.tue.length!=0){
    for (var i = 0; i < val.tue.length; i++) {
        if(val.tue[0].from !=null && val.tue[0].from !="" ){
    
        this.slotsArr.push({
            Day: 2
            , Start: val.tue[i].from.Timings
            , Ending: val.tue[i].to.Timings
        });
    }
    else{
        val.tue=[];
    }
    
   
    }
    if(this.dataset[0].Day !=2){
        this.slotsArr.push({
            Day: 2
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        }); 
    }
    }
    else{
        this.slotsArr.push({
            Day: 2
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    }
    
    if(val.wed.length!=0){
    
    for (var i = 0; i < val.wed.length; i++) {
        if(val.wed[0].from !=null && val.wed[0].from !="" ){
            this.slotsArr.push({
                Day: 3
                , Start: val.wed[i].from.Timings
                , Ending: val.wed[i].to.Timings
            });
        }
        else{
            val.wed=[];
        }
        
   
    }
    if(this.dataset[0].Day !=3){
        this.slotsArr.push({
            Day: 3
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        }); 
      
    }
    }
    else{
        this.slotsArr.push({
            Day: 3
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    }
    if(val.thu.length!=0){
    
    for (var i = 0; i < val.thu.length; i++) {
        if(val.thu[0].from !=null && val.thu[0].from !=""){
    
        this.slotsArr.push({
            Day: 4
            , Start: val.thu[i].from.Timings
            , Ending: val.thu[i].to.Timings
        });
    }
    else{
        val.thu=[];
    }
    
    if(this.dataset[0].Day !=4){
    this.slotsArr.push({
        Day: 4
      , Start: this.dataset[0].Start.Timings
      , Ending: this.dataset[0].Ending.Timings
    }); 
}
    }
    }
    else{
        this.slotsArr.push({
            Day: 4
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    }
    
    if(val.fri.length!=0){
    for (var i = 0; i < val.fri.length; i++) {
        if(val.fri[0].from !=null && val.fri[0].from !="" ){
        this.slotsArr.push({
            Day: 5
            , Start: val.fri[i].from.Timings
            , Ending: val.fri[i].to.Timings
        });
    }
        else{
            val.fri=[];
        }
        
    if(this.dataset[0].Day !=5){
        this.slotsArr.push({
            Day: 5
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        }); 
    }
    }
    }
    else{
        this.slotsArr.push({
            Day: 5
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    }
    
    if(val.sat.length!=0){
    for (var i = 0; i < val.sat.length; i++) {
        if(val.sat[0].from !=null && val.sat[0].from !=""){
    
        this.slotsArr.push({
            Day: 6
            , Start: val.sat[i].from.Timings
            , Ending: val.sat[i].to.Timings
        });
    }
    else{
        val.sat=[];
    }
    
    if(this.dataset[0].Day !=6){
    this.slotsArr.push({
        Day: 6
      , Start: this.dataset[0].Start.Timings
      , Ending: this.dataset[0].Ending.Timings
    }); 
}
    } 
    }
    else{
        this.slotsArr.push({
            Day: 6
          , Start: this.dataset[0].Start.Timings
          , Ending: this.dataset[0].Ending.Timings
        });  
    } 
    }

else{


        debugger
       // let itemArr = [];
        this.slotsArr = [];

        for (var i = 0; i < val.sun.length; i++) {
            if(val.sun[0].from !=null && val.sun[0].from !="" ){
            this.slotsArr.push({
                  Day: 7
                , Start: val.sun[i].from.Timings
                , Ending: val.sun[i].to.Timings
            });
        }
        else{
            val.sun=[];
        }
        
        }
        for (var i = 0; i < val.mon.length; i++) {
            if(val.mon[0].from !=null && val.mon[0].from !="" ){
            this.slotsArr.push({
                Day: 1
                , Start: val.mon[i].from.Timings
                , Ending: val.mon[i].to.Timings
            });
        }
        else{
            val.mon=[];
        }
        }
        for (var i = 0; i < val.tue.length; i++) {
            if(val.tue[0].from !=null && val.tue[0].from !="" ){

            this.slotsArr.push({
                Day: 2
                , Start: val.tue[i].from.Timings
                , Ending: val.tue[i].to.Timings
            });
        }
        else{
            val.tue=[];
        }
        }
        for (var i = 0; i < val.wed.length; i++) {
            if(val.wed[0].from !=null && val.wed[0].from !="" ){
                this.slotsArr.push({
                    Day: 3
                    , Start: val.wed[i].from.Timings
                    , Ending: val.wed[i].to.Timings
                });
            }
            else{
                val.wed=[];
            }
          
        }
        for (var i = 0; i < val.thu.length; i++) {
            if(val.thu[0].from !=null && val.thu[0].from !="" ){

            this.slotsArr.push({
                Day: 4
                , Start: val.thu[i].from.Timings
                , Ending: val.thu[i].to.Timings
            });
        }
        else{
            val.thu=[];
        }
        }
        for (var i = 0; i < val.fri.length; i++) {
            if(val.fri[0].from !=null && val.fri[0].from !=""){
            this.slotsArr.push({
                Day: 5
                , Start: val.fri[i].from.Timings
                , Ending: val.fri[i].to.Timings
            });
        }
            else{
                val.fri=[];
            }
        }
        for (var i = 0; i < val.sat.length; i++) {
            if(val.sat[0].from !=null && val.sat[0].from !=""){

            this.slotsArr.push({
                Day: 6
                , Start: val.sat[i].from.Timings
                , Ending: val.sat[i].to.Timings
            });
        }
        else{
            val.sat=[];
        }
        }
    }
       // this.slotsArr = [];
       // this.slotsArr = itemArr;
        
    }

// daysArray(val) {
//     debugger;

//     if (this.isAllDays) {
//         this.slotsArr = [];

//         const selectedDay = val.mon.length > 0 ? val.mon : val.tue.length > 0 ? val.tue :
//             val.wed.length > 0 ? val.wed : val.thu.length > 0 ? val.thu : val.fri.length > 0 ? val.fri : val.sat;

//         if (selectedDay.length !== 0) {
//             for (let i = 0; i < selectedDay.length; i++) {
//                 if (selectedDay[0].from != null) {
//                     this.slotsArr.push({
//                         Day: selectedDay[0].Day,
//                         Start: selectedDay[i].from.Timings,
//                         Ending: selectedDay[i].to.Timings
//                     });
//                 } else {
//                     selectedDay.length = 0;
//                 }
//             }
//         }

//         // Add the slots to other days (Monday to Saturday)
//         for (let dayIndex = 1; dayIndex <= 6; dayIndex++) {
//             if (dayIndex !== selectedDay[0].Day) {
//                 this.slotsArr.push({
//                     Day: dayIndex,
//                     Start: this.dataset[0].Start.Timings,
//                     Ending: this.dataset[0].Ending.Timings
//                 });
//             }
//         }
//     } else {
       
//     }
// }

 
clearSearch() {
    this.searchKey = '';
    this.doFilter1(this.searchKey, 1)
    this.doFilter2(this.searchKey1, 1)
    this.doFilter3(this.searchKey2, 1)
    this.doFilter4(this.searchKey3, 1)
}


    addSlots(val) {
        debugger
        // this.daysArray(val);
        let arr = [];
        arr.push({
            flag: '1'
            , DoctorID: this.doctorID
            , slots: this.availbleSlots
        })
        var url = 'PatientsAppointments/DoctorsAvailability/';
        this.utilitiesService.addUpdateVitals(arr, url).subscribe(
            (data) => {
                if (data == '100') {;
                    this._snackBar.open('Slot added successfully ..!!', 'ok', {
                        "duration": 2000
                    });
                    // val.Name = 'MONDAY';
                    // val.Value = 1;
                    // this.day(val)
                    
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
        this.selectedSlots=[];
    
        // this.addSlot()
        this.selectedDay=1
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
     
        this.slotsForm.reset({
            sun: [],
            mon: [],
            tue: [],
            wed: [],
            thu: [],
            fri: [],
            sat: []
          });
        //   this.mon.setValue(null);
        //   this.tue.setValue(null);
        //   this.wed.setValue(null);
        //   this.thu.setValue(null);
        //   this.fri.setValue(null);
        //   this.sat.setValue(null);
        //   this.sun.setValue(null);
       
        this.sun = this.slotsForm.get('sun') as FormArray;
        this.sun=this._formBuilder.array([]),
        
            this.mon = this.slotsForm.get('mon') as FormArray;
            this.mon=this._formBuilder.array([]),
       
            this.tue = this.slotsForm.get('tue') as FormArray;
            this.tue=this._formBuilder.array([]),
        

            this.wed = this.slotsForm.get('wed') as FormArray;
            this.wed=this._formBuilder.array([]),
        
            this.thu = this.slotsForm.get('thu') as FormArray;
            this.thu=this._formBuilder.array([]),
        
            this.fri = this.slotsForm.get('fri') as FormArray;
            this.fri=this._formBuilder.array([]),
        
            this.sat = this.slotsForm.get('sat') as FormArray;
            this.sat=this._formBuilder.array([]),

  
        this.doctorID = val.registrationID;
        this.slotsArrForChips = []
        this.slotsArrForChipsList = []
         this.day(val)
    
    }
    day(val) {
        debugger;
        //this.slotsArrForChips = []
        this.submitEnable=false;
        this.isAllDays=false;
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
                    console.log("1234",this.allSlots)
                   this.availbleSlots=data;
                   this.slotbinding();
                    this.slotsArrForChips = []
                    this.slotsArrForChipsList = []
                    this.slotsArrForChipsList =data
                    this.slotsArrForChips = this.slotsArrForChipsList.filter(a => a.day == this.dayID)
                    console.log("1234",this.slotsArrForChips)
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

        // this.addItem();
        // this.addSlot();


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