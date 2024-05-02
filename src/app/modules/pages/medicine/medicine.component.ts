import { ViewEncapsulation, Component, ViewChild, OnInit,ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineService } from './medicine.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { T } from '@angular/cdk/keycodes';
import { UtilitiesService } from 'app/Services/utilities.service';
import { LoaderService } from '../../../Services/loader.service';
import * as XLSX from 'xlsx';
import { DatePipe, PlatformLocation } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';


import {
    
    FormControl,
    
    NgForm,
     FormArray
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
    selector: 'app-medicine',
    templateUrl: './medicine.component.html',
    styleUrls: ['./medicine.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    
    //encapsulation: ViewEncapsulation.None
})
export class MedicineComponent implements OnInit {
    Updatebtn: boolean;
    submitbtn:any;
    composition1:any;
    medicine1:any;
    horizontalStepperForm: FormGroup;
    public form: FormGroup;
    medlist: boolean=true;
    patientsappointments: any;
    constructor(public medicineService: MedicineService, 
        private _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
         private utilitiesService: UtilitiesService,  public spinner: LoaderService ,  public datepipe: DatePipe,
         private _formBuilder: FormBuilder,
         private platformlocation: PlatformLocation

        ) {
            history.pushState(null, '', location.href);
            this.platformlocation.onPopState(() => {
                history.pushState(null, '', location.href);
            });
            this.form = _formBuilder.group({              
                medicineName         : ['', Validators.required],
                composition       : [''] 
            });
          }

    medicineList:any = [];
    displayedColumns: string[] = ['MedicineId','MedicineName', 'Composition', 'Actions'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('TABLE') table: ElementRef;
    searchKey: string;
    loginDetails: any;
    roleID: any;
    registrationID:any;
    patientHistory: any = [];
    patientHistoryList: any = [];
   
    Screen: any = 1;
   
    patientName: string;
    PatientID: any;
    AppointmentID: any;
    vitalsID: any;
    complaintsXML: any = [];
    items: FormArray;
    medicationitems: FormArray;
    appt: any = {};
    appFromDate: string;
    appToDate: string;
    actionName: string = 'Medicine'
    flag: string;
    msg: any;

    ExportTOExcel()
        {
            
        const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       //let bur=XLSX.write(wb,{cellStyles:})
    
        
        /* save to file */
        XLSX.writeFile(wb, 'SheetJS.xlsx');
        
        }

        @ViewChild('myField') myField: ElementRef;
        setFocus() {
            debugger
            
            if (this.myField && this.myField.nativeElement) {
                setTimeout(() => {
                    this.myField.nativeElement.focus();

                  }, 100);
            //   this.myField.nativeElement.focus();
            }
        }
       
        
   exportpdf(){
            debugger
              var prepare=[];
            this.medicineList.filteredData.forEach(e=>{
              var tempObj =[];
              tempObj.push(e.medicineId);
              tempObj.push(e.medicineName);
              tempObj.push( e.composition);
              tempObj.push( e.mobile);
              tempObj.push(e.visitCount);
              prepare.push(tempObj);
        
            });
            const doc = new jsPDF();
            autoTable(doc,{
                head: [['MedicineId','MedicineName ',' Composition']],
                body: prepare
            });
            doc.save('Medicine' + '.pdf');
          
            // const doc = new jsPDF("p", "pt", "a4");
            // const source = document.getElementById("table1");
            // // doc.text("Test", 40, 20);
            // doc.setFontSize(20)
            // doc.html(source, {
            //   callback: function(pdf) {
            //     doc.output("dataurlnewwindow"); // preview pdf file when exported
            //   }
            // });
        }
  

    ngOnInit(): void {
        debugger;
        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID=this.loginDetails.registrationID;
        } 
        this.GetMedicineData();    
       
    }
   

    // GetMedicineData(){       

    //     debugger;
    //     this.medicineService.GetMedicineList().subscribe(
    //         (data) => {
    //             debugger;
    //             if (data) {
    //                 if(this.roleID == 2)
    //                 {
    //                     // console.log(data);
    //                 data = data .sort((a,b) => {
    //                     if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
    //                         return -1;
    //                     }
    //                 })
    //                 this.medicineList = data;
    //                 this.medicineList = this.medicineList.filter((a) => a.medic == this.registrationID);
    //                 }
    //                 else
    //                 data = data .sort((a,b) => {
    //                     if((a.medicineName).toLowerCase() < (b.medicineName).toLowerCase()){
    //                         return -1;
    //                     }
    //                 })
    //                 this.medicineList = data;
    //             }
    //             if(this.medicineList.length>0){
    //                 this.medlist=true
    //             }
    //             else{
    //                 this.medlist=false
    //             }
               
    //             // this.patientsappointments = this.patientsappointments.filter(
    //             //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient )  === i
    //             // );            
    //             this.medicineList = new MatTableDataSource(this.medicineList);
    //            //this.sort.sort()
    //             this.medicineList.sort = this.sort;
              

    //             this.medicineList.paginator = this.paginator;
    //         },

    //         () => {

    //         }

    //     );

    // }
    GetMedicineData() {
        debugger;
        this.medicineService.GetMedicineList().subscribe(
            (data) => {
                debugger;
                if (data) {
                    if (this.roleID == 2) {
                        this.medicineList = data.filter((a) => a.medic == this.registrationID);
                    } else {
                        this.medicineList = data;
                    }
                }
                if (this.medicineList.length > 0) {
                    this.medlist = true;
                } else {
                    this.medlist = false;
                }
    
                this.medicineList = new MatTableDataSource(this.medicineList);
                this.medicineList.sort = this.sort;
                this.medicineList.paginator = this.paginator;
            },
            () => {}
        );
    }
    
    medicineId:any
    updateSelect(val) {
        debugger
       this.flag='2'
      this.medicineId=val.medicineId
       this.medicine1=val.medicineName
       this.composition1=val.composition
       this.Updatebtn = true; // Show Update button
    this.submitbtn = false;
       
    }

    addUpdateMedicineDetails(val) {
        debugger;
        this.msg = this.actionName + ' data added successfully ..!!';

        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
        }
        else if (this.flag == '2') {
            //this.msg = 'Doctor with same mobile no alreay Exists ..!!';
            this.msg = this.actionName + ' data updated Successfully ..!!';
        }
        let arr = [];
        arr.push({ 
                MedicineId:            val.medicineId,
                MedicineName           :val.medicineName           
                ,Composition          :val.composition 
                ,Action:'Insert',  
        })
        //var url = 'PatientsAppointments/RegisterationCRUD/';
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    ;
                    this.GetMedicineData();
                    this.form.reset();
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
    UpdateMedicineDetails(val) {
        debugger;
        this.msg = this.actionName + ' data added successfully ..!!';

        if (this.flag == '1') {
            this.msg = this.actionName + ' data added successfully ..!!';
        }
        else if (this.flag == '2') {
            //this.msg = 'Doctor with same mobile no alreay Exists ..!!';
            this.msg = this.actionName + ' data updated Successfully ..!!';
        }
        let arr = [];
        arr.push({ 
                MedicineId:            this.medicineId,
                MedicineName           :val.medicineName           
                ,Composition          :val.composition 
                ,Action:'Update',  
        })
        //var url = 'PatientsAppointments/RegisterationCRUD/';
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    ;
                    this.GetMedicineData();
                    this.form.reset();
                    this.Updatebtn = false;
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

    deleteDoc(element) {
        debugger;
        this.msg = this.actionName + ' data Deleted successfully ..!!';
    
        if (this.flag == '1') {
            this.msg = this.actionName + ' data Deleted successfully ..!!';
        } else if (this.flag == '2') {
            this.msg = this.actionName + ' data Deleted Successfully ..!!';
        } else if (this.flag == '3') {
            this.msg = this.actionName + ' data Deleted Successfully ..!!';
        }
    
        let arr = [];
        arr.push({
            MedicineId: element.medicineId,
            MedicineName: element.medicineName,
            Composition: element.composition,
            Action: 'Delete',
        });
    
        this.medicineService.addUpdateMedicineDetails(arr).subscribe(
            (data) => {
                if (data == '1') {
                    this.GetMedicineData();
                    this.form.reset();
                    this.Updatebtn = false;
                    this._snackBar.open(this.msg, 'ok', {
                        duration: 2000
                    });
                } else {
                    this._snackBar.open('Something went wrong please try again alter ..!!', 'ok', {
                        duration: 2000
                    });
                }
            },
            () => {}
        );
    }
    

    // GetAllAppointments() {

    //     this.reportService.getReportPatientList().subscribe(
    //         (data) => {
    //             debugger;
    //             if (data) {
    //                 if(this.roleID == 2)
    //                 this.patientsappointments = data.filter((a) => a.doctorID == this.registrationID);
    //                 else
    //                 this.patientsappointments = data;
    //             }

    //             // this.patientsappointments = this.patientsappointments.filter(
    //             //     (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient && t.serviceDate === thing.serviceDate)  === i
    //             // );    
    //             this.patientsappointments = this.patientsappointments.filter(
    //                 (thing, i, arr) => arr.findIndex(t => t.mobile === thing.mobile && t.patient === thing.patient )  === i
    //             );            
    //             this.patientsappointments = new MatTableDataSource(this.patientsappointments);
    //            //this.sort.sort()
    //             this.patientsappointments.sort = this.sort;
    //            // this.sort.active='appointmentID';
    //           //  this.sort.direction = 'desc';

                 


    //             // const sortState: MatSort = {active: 'appointmentID', direction: 'desc'};
    //             // this.sort.active = sortState.active;
    //             // this.sort.direction = sortState.direction;
    //             // this.sort.sortChange.emit(sortState);

    //             this.patientsappointments.paginator = this.paginator;
    //         },

    //         () => {

    //         }

    //     );
    // }
    onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
    }
    applyFilter() {
        this.medicineList.filter = this.searchKey.trim().toLowerCase();
    }

  
  
    appoinmentLink() {
        //this._router.navigate(['/Appointments']);
        this.Screen = 1;
    }



}
