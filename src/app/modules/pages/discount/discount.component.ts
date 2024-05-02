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


export class discount{
  public discountId:any;
  public discount:string;
//   public price:any;
//   public gst:any;
//   public serviceOwner:number;
  }

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class DiscountComponent implements OnInit {
    discount: any = { discountID: 0, discount: '', createdBy: '', action: '' };
    // discount = new discount()
      priceControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
      selectedGender
    // form: FormGroup;
  
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
      displayedColumns: string[] = [ 'mobile', 'email',  'Actions','Slots'];
      displayedColumnsJr: string[] = ['name', 'mobile', 'email', 'experience', 'qualification', 'institution', 'Actions'];
      columnsToDisplay: string[] = this.displayedColumns.slice();
      @ViewChild(MatSort) sort: MatSort;
      private API_URL: any = environment.API_URL;
      flag: string;
      regDetailsJrList: any = [];
      regDetailsFrontList: any = [];
      regDetailsLabList: any = [];
  
      services = new MatTableDataSource(this.regDetailsLabList);

      discounts = new MatTableDataSource(this.regDetailsLabList);

  
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
      form: FormGroup;
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
   
  // discounts: any;
  
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
            discount    : ['', Validators.compose([Validators.required])],
            //   price          : ['', Validators.compose([Validators.required])],
            //   gst             : ['', Validators.compose([Validators.required])],
            //   serviceOwner    : ['', Validators.compose([Validators.required])],
          },);
  
      }
  

      dataSource: MatTableDataSource<any>;
      totalCount: number;
      pageSize = 100; // Set your desired page size here
      pageCount: number;
    

      ngOnInit(): void {
  
          // if(this.mon == null){
          //     this.addItem()
          // }
  
          // this.addItem();
          this.utilitiesService.getDiscounts().subscribe((data: any) => {
            this.dataSource = new MatTableDataSource(data.discounts);
            this.totalCount = data.totalCount;
      
            // Calculate page count
            this.pageCount = Math.ceil(this.totalCount / this.pageSize);
          });
          
          this.getDiscounts();
          this.submitbtn=true;
          this.daysArr = [];
  
      
  
      }
  
      
   
      getDiscounts() {
        this.utilitiesService.getDiscounts().subscribe(

          (data:any) => {
            if (data) {
            this.discounts = new MatTableDataSource(data);
            this.discounts.sort = this.sort;
            this.discounts.paginator = this.paginator;
   

            }
          }

          

           
        );
    }
  
  
  
      doctors=[]
  
  

      updatediscount(){
        this.utilitiesService.adddiscount(this.discount).subscribe((resp:any)=>{
               if(resp.status=="OK"){
                   this._snackBar.open('Discount Updated Successfully...!!', 'OK', {
                       horizontalPosition: this.horizontalPosition,
                       verticalPosition: this.verticalPosition,
                       "duration": 2000
                   });
                   this.drawer.close();
                   this.getDiscounts();
               }
       })
       }
   
       showError:boolean=false
       errMsg:string

       adddiscount(){
       this.utilitiesService.adddiscount(this.discount).subscribe((resp:any)=>{
           if(resp.status=="OK"){
               this._snackBar.open('Discount Added Successfully...!!', 'OK', {
                   horizontalPosition: this.horizontalPosition,
                   verticalPosition: this.verticalPosition,
                   "duration": 2000
               });
               this.drawer.close();
               this.getDiscounts();
           }
       },err=>{
           this.errMsg=err.error.message
           this.showError=true
       })
       }

  
      deletediscount(id){
          debugger
          const confirmDelete = window.confirm('Are you sure you want to delete this discount?');
          if (confirmDelete) {
          this.utilitiesService.deleteDiscountById(id).subscribe((resp:any)=>{
              if(resp.status=="OK"){
                  this._snackBar.open('Discount deleted Successfully...!!', 'OK', {
                      horizontalPosition: this.horizontalPosition,
                      verticalPosition: this.verticalPosition,
                      "duration": 2000
                  });
                  this.getDiscounts();
              }
      })
        }

    }
  
  

  
      clearSearch() {
          this.searchKey = '';
          this.doFilter1(this.searchKey, 1)
      }
  
      public doFilter1 = (value, state) => {
          debugger
          var sd=value.trim().toLocaleLowerCase()
              this.discounts.filter = value.trim().toLocaleLowerCase()
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
          this.discount=new discount()
          this.drawer.open();
          this.submitbtn=true;
          this.Updatebtn=false;
      }
  
      openUpdateDrawer(id){
          this.discount=new discount()
          this.utilitiesService.getdiscountbyid(id).subscribe(
              (data) => {
                if (data) {
                  console.log("servById",data)
                  this.discount=data
                }
              })
  
          this.drawer.open();
          this.submitbtn=false;
          this.Updatebtn=true;
      }

   
  
  
  }
