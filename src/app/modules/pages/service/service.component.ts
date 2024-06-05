
import { FormArray } from '@angular/forms';
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




} from '@angular/forms';
import { GeneralService } from '../../../Services/general.service';
import { UtilitiesService } from 'app/Services/utilities.service';
import { ToastService } from 'app/Services/toastservice';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfirmationService } from '@fuse/services/confirmation';

export class Service{
public serviceId:any;
public serviceName:string;
public price:any;
public gst:any;
public serviceOwner:number;
}

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ServiceComponent  implements OnInit {

service = new Service()
    priceControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    selectedGender
  myForm: FormGroup;

    selected = 'option1';
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('Frontdeskpag') Frontdeskpag: MatPaginator;
    @ViewChild('Assdocpag') Assdocpag: MatPaginator;

    @ViewChild('LabAsspag') LabAsspag: MatPaginator;

    @ViewChild('drawer') drawer:FuseDrawerComponent;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // @ViewChild('drawer', { static: false }) drawer: FuseDrawerComponent; // Replace 'yourDrawer' with your drawer name

    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    displayedColumns: string[] = [ 'mobile', 'email', 'experience', 'qualification', 'institution', 'Actions','Slots'];
    columnDefinitions = [
        { def: 'mobile', visible: true, displayName: 'S.NO' },
        { def: 'email', visible: true, displayName: '	Service Name' },
        { def: 'experience', visible: true, displayName: 'Price' },
        { def: 'qualification', visible: true, displayName: 'GST(%)' },
        { def: 'institution', visible: true, displayName: 'Service Owner' },
        { def: 'Actions', visible: true, displayName: 'Actions' },
    ];
    displayedColumnsJr: string[] = ['name', 'mobile', 'email', 'experience', 'qualification', 'institution', 'Actions'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    @ViewChild(MatSort) sort: MatSort;
    private API_URL: any = environment.API_URL;
    flag: string;
    regDetailsJrList: any = [];
    regDetailsFrontList: any = [];
    regDetailsLabList: any = [];

    services = new MatTableDataSource(this.regDetailsLabList);

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
    dayName: string = 'MONDAY'
    dayID: any = 1
    submitButton: boolean = true;
    searchKey: string;
    searchKey1: string;
    searchKey2: string;
    searchKey3: string;
    doctorID: any;
    msg: any;
    allSlots: any=[];
    actionName: string = 'Doctor'
    status1: any[];
    newDayArry=[];
    Updatebtn: boolean;
    submitButton1: boolean=false;
    labassts: boolean=true;
    frontdesks: boolean=true;
    assdoctortab: boolean=true;
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
            serviceName    : ['', Validators.compose([Validators.required])],
            price          : ['', Validators.compose([Validators.required])],
            gst             : [''],
            serviceOwner    : ['', Validators.compose([Validators.required])],
        },);

    }

    ngOnInit(): void {

        // if(this.mon == null){
        //     this.addItem()
        // }

        // this.addItem();
        this.getservices();
        this.submitbtn=true;
        this.getAllDoctors();
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

    }

    updateDisplayedColumns() {
        this.displayedColumns = this.columnDefinitions
          .filter(cd => this.selectedColumns.includes(cd.def))
          .map(cd => cd.def);
      }
      selectedColumns: string[] = ['mobile', 'email', 'experience', 'qualification', 'institution', 'Actions','Slots'];

    getservices(){
        this.utilitiesService.getallservices().subscribe(
            (data:any) => {
              if (data) {
              this.services = new MatTableDataSource(data);
              this.services.sort = this.sort;
              this.services.paginator = this.paginator;
     

              }
            }
        )

    }



    doctors=[]

    getAllDoctors() {
        debugger
        this.utilitiesService.getAllDoctors().subscribe(
            (data) => {
                if (data) {
                    // console.log(data)
                    data = data .sort((a,b) => {
                        if((a.doctor).toLowerCase() < (b.doctor).toLowerCase()){
                            return -1;
                        }
                    })
                    this.doctors = data;
                    console.log("doctors",this.doctors)
                }
                 else
             {
                }
            },

            () => { }
        );
    }

    // deleteService(id){
    //     debugger
    //     this.utilitiesService.deleteServiceById(id).subscribe((resp:any)=>{
    //         if(resp.status=="OK"){
    //             this._snackBar.open('Service deleted Successfully...!!', 'OK', {
    //                 horizontalPosition: this.horizontalPosition,
    //                 verticalPosition: this.verticalPosition,
    //                 "duration": 2000
    //             });
    //             this.getservices();
    //         }
    // })
    //   }

    deleteService(id) {
        const confirmDelete = window.confirm('Are you sure you want to delete this service?');
        if (confirmDelete) {
            this.utilitiesService.deleteServiceById(id).subscribe((resp: any) => {
                if (resp.status == "OK") {
                    this._snackBar.open('Service deleted Successfully...!!', 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 2000
                    });
                    this.getservices();
                }
            });
        }
    }
    


    updateService(){
     this.utilitiesService.addService(this.service).subscribe((resp:any)=>{
            if(resp.status=="OK"){
                this._snackBar.open('Service Updated Successfully...!!', 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    "duration": 2000
                });
                this.drawer.close();
                this.getservices();
            }
    },err=>{
        this.errMsg = err.error.message;
        this.showError = true;
        // Hide error message after 2 seconds
        setTimeout(() => {
          this.showError = false;
        }, 5000);
      });
    }

    showError:boolean=false
    errMsg:string
    addService(){
    this.utilitiesService.addService(this.service).subscribe((resp:any)=>{
        if(resp.status=="OK"){
            this._snackBar.open('Service Added Successfully...!!', 'OK', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                "duration": 2000
            });
            this.drawer.close();
            this.getservices();
        }
    },err=>{
        this.errMsg = err.error.message;
        this.showError = true;
        // Hide error message after 2 seconds
        setTimeout(() => {
          this.showError = false;
        }, 5000);
      });
    }

    clearSearch() {
        this.searchKey = '';
        this.doFilter1(this.searchKey, 1)
    }

    public doFilter1 = (value, state) => {
        debugger
        var sd=value.trim().toLocaleLowerCase()
            this.services.filter = value.trim().toLocaleLowerCase()
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


    

    openSaveDrawer(){
        this.service=new Service()
        this.drawer.open();
        this.submitbtn=true;
        this.Updatebtn=false;
    }

    openUpdateDrawer(id){
        this.service=new Service()
        this.utilitiesService.getServicebyid(id).subscribe(
            (data) => {
              if (data) {
                console.log("servById",data)
                this.service=data
              }
            })

        this.drawer.open();
        this.submitbtn=false;
        this.Updatebtn=true;
    }


}



