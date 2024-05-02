import { ViewEncapsulation, Component, ViewChild, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MyPatientsService } from './mypatients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { UtilitiesService } from 'app/Services/utilities.service';
import { LoaderService } from '../../../Services/loader.service';
import {

    FormControl,

    NgForm,
    FormArray
} from '@angular/forms';
import moment from 'moment';
import { DatePipe, PlatformLocation } from '@angular/common';

interface Days {
    value: string;
    viewValue: string;
  }
@Component({
    selector: 'app-mypatients',
    templateUrl: './mypatients.component.html',
    styleUrls: ['./mypatients.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MyPatientsComponent implements AfterViewInit {
    days: Days[] = [
        {value: '1', viewValue: 'Yesterday'},
        {value: '2', viewValue: 'Today'},
        {value: '3', viewValue: 'Tomorrow'},
      ];    
    horizontalStepperForm: FormGroup;
    peteintapp: boolean=true;
    constructor(public mypatientsService: MyPatientsService,
        private datePipe: DatePipe,
         private utilitiesService: UtilitiesService,
          public spinner: LoaderService,
           private _formBuilder: FormBuilder,
           private cdr: ChangeDetectorRef,
           private platformlocation: PlatformLocation

        ) {
            history.pushState(null, '', location.href);
            this.platformlocation.onPopState(() => {
                history.pushState(null, '', location.href);
            });

    }


    filterdayval:any;
    
    
    displayedColumns: string[] = ['SL','Patient', 'Mobile','LastSeen','Vitals'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    @ViewChild(MatSort) sort: MatSort;
    searchKey: string;
    loginDetails: any;
    roleID: any;
    registrationID: any;
    patientHistory: any = [];
    patientsappointments = new MatTableDataSource(this.patientHistory);
    patientHistoryList: any = [];
    medicineXml: any = [];
    complaintsXMLList: any = [];
    medicineList: any = [];
    Screen: any = 1;
    detailData: any = [];
    apptList: any = {};
    patientName: string;
    PatientID: any;
    AppointmentID: any;
    vitalsID: any;
    complaintsXML: any = [];
    items: FormArray;
    medicationitems: FormArray;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    yesterdaydate: any;
    todaydate: any;
    tomorrowdate: any;

    ngAfterViewInit(): void {
    
        this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
        if (this.loginDetails) {
            this.roleID = this.loginDetails.roleID;
            this.registrationID = this.loginDetails.registrationID;
        }
        this.GetAllAppointments();

    }

   

    getRelativeDate(dateString: string) {
        const currentDate = new Date();
        const targetDate = new Date(dateString);
    
        const timeDifference = currentDate.getTime() - targetDate.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    
        if (daysDifference === 0) {
          return "Today";
        } else if (daysDifference === 1) {
          return "Yesterday";
        } else {
          return daysDifference + " days before";
        }
      }

    sortData(sort: MatSort) {
        
        if (sort.active == "SL") {
            if (sort.direction == "asc")
                this.patientHistory.sort((a, b) => (a.appointmentID < b.appointmentID ? -1 : 1));
            else
                this.patientHistory.sort((a, b) => (a.appointmentID > b.appointmentID ? -1 : 1));
        }
        if (sort.active == "patient") {
            if (sort.direction == "asc")
                this.patientHistory.sort((a, b) => (a.patient < b.patient ? -1 : 1));
            else
                this.patientHistory.sort((a, b) => (a.patient > b.patient ? -1 : 1));
        }

        if (sort.active == "mobile") {
            if (sort.direction == "asc")
                this.patientHistory.sort((a, b) => (a.mobile < b.mobile ? -1 : 1));
            else
                this.patientHistory.sort((a, b) => (a.mobile > b.mobile ? -1 : 1));
        }

        if (sort.active == "serviceDate") {
            if (sort.direction == "asc")
                this.patientHistory.sort((a, b) => (a.serviceDate < b.serviceDate ? -1 : 1));
            else
                this.patientHistory.sort((a, b) => (a.serviceDate > b.serviceDate ? -1 : 1));
        }


        this.patientsappointments = new MatTableDataSource(this.patientHistory);
        this.patientsappointments.paginator = this.paginator;

    }


    GetAllAppointments() {
        debugger

        this.mypatientsService.GetAllAppointments_Distict().subscribe(
            (data) => {
                
                if (data) {
                    if (this.roleID == 2)
                        this.patientHistory = data.filter((a) => a.doctorID == this.registrationID);
                    else
                        this.patientHistory = data;
                }


                if(this.patientHistory.length>0){
                    this.peteintapp=true
                }
                else{
                    this.peteintapp=false
                }
                this.patientsappointments = new MatTableDataSource(this.patientHistory);


                this.patientsappointments.paginator = this.paginator;

            },

            () => {

            }

        );
    }
    onSearchClear() {
        debugger
        this.searchKey = "";
        this.applyFilter();
        this.filterdayval = ""; // Add this line to reset the selected day
        // this.filter.modelValue
        
    }


    // OnDaySelect(){

    // }
    OnDaySelect(event:any) {
        debugger
        
        var selectedValue= event;
        // var selectedValue= this.filterdayval;
        this.todaydate=new Date().toLocaleDateString();
        this.tomorrowdate=moment(this.todaydate).add(1, 'days');
        this.yesterdaydate=moment(this.todaydate).subtract(1, 'd');
        this.todaydate=this.datePipe.transform(new Date(this.todaydate), 'dd MMM yyyy');
        this.tomorrowdate=this.datePipe.transform(new Date(this.tomorrowdate).toLocaleDateString(), 'dd MMM yyyy');
        this.yesterdaydate=this.datePipe.transform(new Date(this.yesterdaydate).toLocaleDateString(), 'dd MMM yyyy');
        //this.yesterdaydate.setDate( this.todaydate.getDate() -1 );
       // this.tomorrowdate.setDate( this.todaydate.getDate() + 1 );
        var dateFilter;
        switch(selectedValue.toLowerCase())
        {
                case "1":
                    dateFilter =  this.yesterdaydate;
                    break;
                    case "2":
                    dateFilter= this.todaydate;
                    break;
                    case"3":
                    dateFilter = this.tomorrowdate;
                    
        }
        //this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
    
         this.searchKey = dateFilter;
        this.patientsappointments.filter = this.searchKey.trim().toLowerCase();

        
    }
    applyFilter() {
        debugger
        this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
        this.cdr.detectChanges();
        this.filterdayval = "";
      
        
    }

   
    
    
   
    

    onRowClicked(row) {
        debugger
        
        // this.rowClickedData=row;
        this.Screen = 2;
        this.detailData = row;
        this.viewHistory(row);
        // this.fruits = [];
        // this.vitalsForm.reset();
        if (row.vitalsID) {
            // this.setValues(row);

        }
        else {
            this.patientName = row.patient + " " + "(" + row.gender + ", Age " + row.age + ")"
            // this.vitalsForm.reset();
            // this.fruits = [];
            //  this.flag = '1'
            this.PatientID = row.patientID;
            this.AppointmentID = row.appointmentID;
            this.vitalsID = 0;
            // this.items = this.vitalsForm.get('items') as FormArray;
            // this.medicationitems = this.vitalsForm.get('medicationitems') as FormArray;
            // const arr = <FormArray>this.vitalsForm.controls.items;
            // arr.controls = [];
            // this.addItem();

            // console.log('Row clicked: ', row);
        }
    }


    viewHistory(val) {
        debugger
        
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
        //debugger;
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
    appoinmentLink() {
        //this._router.navigate(['/Appointments']);
        this.Screen = 1;
    }



}
