import { DatePipe, PlatformLocation } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { bottom } from '@popperjs/core';
import { UtilitiesService } from 'app/Services/utilities.service';
import * as XLSX from 'xlsx';
import { Chart, DateAdapter } from 'chart.js/auto';
import { result } from 'lodash';
import { MatDatepickerInputEvent } from '@angular/material/datepicker'; 

import autoTable from 'jspdf-autotable'


import {


    NgForm,
    FormArray
} from '@angular/forms';

export class Dept{
  public fromDate:Date
  public toDate:Date
  public departmentId:number
}



export class SummaryReports{
  public fromDate:Date
  public toDate:Date
  public departmentId:number
}

export class CardReports{
  public fromDate:Date
  public toDate:Date
  public departmentId:number
}
import jsPDF from 'jspdf';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportService } from '../Reports/report.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'app/Services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminReportsComponent implements OnInit {
  hasData: boolean = false;
  dateRangeForm: FormGroup;
  horizontalStepperForm: FormGroup;
  Repdata: boolean=true;

  @ViewChild('barChart') barChart: ElementRef;
  myBarChart: any;
  fromDate1: Date;
  toDate1: Date;
  fromDate2: Date;
  toDate2: Date;
  dept=new Dept()
  sumrep=new SummaryReports()
  cardrep=new CardReports()
  totalBilled:number=0
  totalCollected:number=0
  cash:number=0
  card:number=0
  wallet:number=0
  outstanding:number=0
  billedpatients:number=0
  consultation:number=0
  totalEarnings:number=0
  searchKey
  date
  appFromDate: Date;
  appToDate: Date;
  summaryReports: MatTableDataSource<any>;
  deptReports: any = [];
  displayedColumns3 : string[] = ['SL','Patient ARCID', 'Patient', 'Mobile', 'Service Name', 'Last Visit', 'Visit Count', 'Payment', 'ModeofPayment'];
  displayedColumns2: string[] = ['date','newreg','billedpatients', 'consultations', 'lab', 'others', 'totalearnings'];
  displayedColumns: string[] = ['department', 'service', 'count', 'totalbill', 'totalcollected'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('TABLE') table1: ElementRef;
  

  date1 = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  date2 = new FormControl(new Date());
  serializedDate1 = new FormControl(new Date().toISOString());

  constructor( 
        private datePipe: DatePipe,
        public reportService: ReportService, private _matDialog: MatDialog, 
        private utilitiesService: UtilitiesService,private formBuilder: FormBuilder, public spinner: LoaderService, public datepipe: DatePipe, private _formBuilder: FormBuilder,private snackBar: MatSnackBar,
        private platformlocation: PlatformLocation
    
  ) {
      history.pushState(null, '', location.href);
      this.platformlocation.onPopState(() => {
          history.pushState(null, '', location.href);
      });
  }



  patientsappointments: any = [];
  @ViewChild(MatSort) sort3: MatSort;
  @ViewChild(MatPaginator) paginator3: MatPaginator;
  @ViewChild('TABLE') table3: ElementRef;
  searchKey3: string;
  loginDetails: any;
  roleID: any;
  registrationID: any;
  patientList: any = [];
  patientTotalAmount: number = 0;

  Screen: any = 1;

  patientName: string;
  PatientID: any;
  AppointmentID: any;
  vitalsID: any;
  complaintsXML: any = [];
  items: FormArray;
  medicationitems: FormArray;
  appt: any = {};
  //appFromDate: string;
  // appToDate: string;
  appFromDate3: Date;
  appToDate3: Date;
  toDate
  fromDate


  exportpdf(){
    debugger
      var prepare=[];
    this.summaryReports.filteredData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.date);
      tempObj.push(e.newRegistrations);
      tempObj.push(e.billedPatients);
      tempObj.push( e.consultation);
      tempObj.push( e.lab);
      tempObj.push(e.others);
      tempObj.push(e.totEarnings);
      prepare.push(tempObj);
  
    });
    const doc = new jsPDF();
    autoTable(doc,{
        head: [['Date', 'New Registration', 'Billed Patients', 'Consultations', 'Lab', 'Others', 'Total Earnings']],
        body: prepare
    });
    doc.save('SummaryReports' + '.pdf');
  
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




exportpdf1(){
  debugger
    var prepare=[];
  this.deptReports.filteredData.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.department);
    tempObj.push(e.service);
    tempObj.push(e.count);
    tempObj.push( e.totalBilled);
    tempObj.push( e.totalCollected);
    prepare.push(tempObj);

  });
  const doc = new jsPDF();
  autoTable(doc,{
      head: [['Department', 'Service', 'Count', 'Total Bill', 'Total Collected']],
      body: prepare
  });
  doc.save('deptReports' + '.pdf');

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

ExportTOExcel() {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DeptReports');

  XLSX.writeFile(wb, 'DeptReports.xlsx');
}

ExportTOExcel1() {
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table1.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  // If the data is an array of objects, convert it to an array of arrays
  const data = this.summaryReports.data.map(item => {
      return [
          this.datePipe.transform(item.date, 'dd/MM/yyyy'),
          item.newRegistrations,
          item.billedPatients,
          item.consultation,
          item.lab,
          item.others,
          item.totEarnings
      ];
  });

  // Add the headers separately
  const headers = ['Date', 'New Registration', 'Billed Patients', 'Consultations', 'Lab', 'Others', 'Total Earnings'];
  const wsSummary: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  XLSX.utils.book_append_sheet(wb, wsSummary, 'SummaryReports');
  XLSX.writeFile(wb, 'SummaryReports.xlsx');
}



  
  ngAfterViewInit(): void {
    if (this.myBarChart) {
      this.myBarChart.destroy(); // Destroy existing chart
    }
  
    if (!this.barChart || !this.barChart.nativeElement) {
      console.error('Cannot access barChart element');
      return;
    }

    this.myBarChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: [this.date],
        datasets: [
          {
            label: 'Billed Patients',
            data: [0], // Assuming the data for 'Total Amount' is 4000
            backgroundColor: 'black',
            borderColor: 'black',
            borderWidth: 1
          },
          {
            label: 'Consultation',
            data: [this.consultation], // Assuming the data for 'Consultation' is 2500
            backgroundColor: 'rgb(0, 214, 57)',
            borderColor: 'green',
            borderWidth: 1
          },
          {
            label: 'Total Earnings',
            data: [this.totalEarnings], // Assuming the data for 'Total Amount' is 4000
            backgroundColor: 'rgb(255, 60, 30)',
            borderColor: 'red',
            borderWidth: 1
          },
          {
            label: 'Lab',
            data: [0], // Assuming the data for 'Total Amount' is 4000
            backgroundColor: 'orange',
            borderColor: 'orange',
            borderWidth: 1
          },
          {
            label: 'Others',
            data: [0], // Assuming the data for 'Total Amount' is 4000
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1
          },
         
          
         
        ]
      },
      options: {
        indexAxis: 'x', // Place the labels at the bottom of the x-axis
        plugins: {
          tooltip: {
          },
          legend: {
              position: bottom,
              display: true,
              labels: {
                  boxWidth: 10
              }
          }
      },
        scales: {
          y: {
            // Assuming the max value is 15000
            title: {
              display: true,
              text: 'Amount'
            },
            beginAtZero: true,
            ticks: {
              callback: function(value, index, values) {
                return value ;
              }
            }
          }
        },
        
      }
      
      
    });    
  }

  areDatesSelected(): boolean {
    return !!this.fromDate && !!this.toDate;
}

  ngOnInit(): void {
    this.showGraph()
    this.loginDetails = JSON.parse(localStorage.getItem('loginDetails'));
    if (this.loginDetails) {
        this.roleID = this.loginDetails.roleID;
        this.registrationID = this.loginDetails.registrationID;
    }
    const dateforToday = new Date();
    this.appFromDate = new Date();
    this.appToDate = new Date();
    this.GetPatientData(this.appFromDate, this.appToDate);
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
}
applyFilter() {
    this.deptReports.filter = this.searchKey.trim().toLowerCase();
}

showGraph(){

}

syncDateSetTwo(event: MatDatepickerInputEvent<Date>, datepicker: number) {
  if (datepicker === 1) {
    this.dept.fromDate = event.value;
  } else if (datepicker === 2) {
    this.dept.toDate = event.value;
  }
}


getServiceDetailsByDept(){
  const fromDate=this.datePipe.transform(this.appFromDate, 'dd/MM/yyyy');
  const toDate=this.datePipe.transform(this.appToDate, 'dd/MM/yyyy');
  this.dept.departmentId=1
this.utilitiesService.getServiceDetailsByDept(this.dept).subscribe(
  (data) => {
    if (data) {
      this.deptReports = new MatTableDataSource(data.result.departmentServiceDetails);
      this.deptReports.sort = this.sort;
      this.deptReports.paginator = this.paginator;
    }
  })
}

// getSummaryReports(){
//   debugger
//   this.sumrep.departmentId=1
//   this.utilitiesService.getSummaryReports(this.cardrep).subscribe(
//     (data) => {
//       if (data) {
//         this.consultation=data.result.consultation
//         this.totalEarnings=data.result.totEarnings
//         const resultdate=data.result.date
//         this.date=this.datePipe.transform(resultdate, 'dd/MM/yyyy');
//         this.summaryReports = new MatTableDataSource<any>([data.result]);
//         this.summaryReports.sort = this.sort;
//         this.summaryReports.paginator = this.paginator;
//         this.ngAfterViewInit()
//       }
//     })

// }

// getCardReports(){
//   debugger
//   this.cardrep.departmentId=1
//   this.utilitiesService.getCardReports(this.cardrep).subscribe(
//     (data) => {
//       if (data) {
//         this.totalBilled=data.result.totBilled
//         this.totalCollected=data.result.totCollected
//         this.cash=data.result.cash
//         this.card=data.result.card
//        // this.wallet=data.result.netbanking
//        this.billedpatients=data.result.unqBilledPatients
//         // this.summaryReports = new MatTableDataSource<any>([data.result]);
//         // this.summaryReports.sort = this.sort;
//         // this.summaryReports.paginator = this.paginator;
//       }
//     })

//     this.getSummaryReports()
// }


// generateReportsSetOne() {
//   this.getServiceDetailsByDept(this.cardrep.fromDate, this.cardrep.toDate);
// }

// generateReportsSetTwo() {
//   this.getServiceDetailsByDept(this.dept.fromDate, this.dept.toDate);
// }

// getServiceDetailsByDept(fromDate: Date, toDate: Date) {
//   const fromDateFormatted = this.datePipe.transform(fromDate, 'dd/MM/yyyy');
//   const toDateFormatted = this.datePipe.transform(toDate, 'dd/MM/yyyy');
//   this.dept.departmentId = 1;

//   this.utilitiesService.getServiceDetailsByDept(this.dept).subscribe(
//     (data) => {
//       if (data) {
//         this.deptReports = new MatTableDataSource(data.result.departmentServiceDetails);
//         this.deptReports.sort = this.sort;
//         this.deptReports.paginator = this.paginator;
//       }
//     }
//   );
// }

getSummaryReports() {
  this.sumrep.departmentId = 1;

  this.utilitiesService.getSummaryReports(this.cardrep).subscribe(
    (data) => {
      if (data) {
        this.consultation = data.result.consultation;
        this.totalEarnings = data.result.totEarnings;
        const resultdate = data.result.date;
        this.date = this.datePipe.transform(resultdate, 'dd/MM/yyyy');
        this.summaryReports = new MatTableDataSource<any>([data.result]);
        this.summaryReports.sort = this.sort;
       this.summaryReports.paginator = this.paginator;
        this.ngAfterViewInit();
      }
    }
  );
}

getCardReports() {
  debugger
  this.cardrep.departmentId = 1;

  this.utilitiesService.getCardReports(this.cardrep).subscribe(
    (data) => {
      if (data) {
        this.totalBilled = data.result.totBilled;
        this.totalCollected = data.result.totCollected;
        this.cash = data.result.cash;
        this.card = data.result.card;
        this.billedpatients = data.result.unqBilledPatients;
      }
    }
  );

  this.getSummaryReports();
}


onDateChange(data) {
  debugger;
  //var s=data
  // this.appFromDate= this.datepipe.transform(data.value, 'dd/MM/yyyy');
  //this.datepipe.transform(from, 'd MMM yyyy');
}

GetPatientData(from, to) {
  //this.appt.FromDate=from;
  // this.appt.ToDate=to;
  if (this.patientList.length > 0) {
      this.hasData = true;
    } else {
      this.hasData = false;
    }

  this.appt.FromDate = this.datepipe.transform(from, 'd MMM yyyy');
  this.appt.ToDate = this.datepipe.transform(to, 'd MMM yyyy');
  

  // let arr = [];
  // arr.push({ fromDate: from })
  // arr.push({ toDate: to })

  debugger;
  this.reportService.getReportPatientList(this.appt).subscribe(
      (data) => {
          debugger;
          if (data) {
              if (this.roleID == 2) {
                  this.patientsappointments = data;
                  this.patientsappointments = this.patientsappointments.filter((a) => a.doctorID == this.registrationID);
              }
              else {
                  this.patientsappointments = data;
              }
              this.patientList = data;
              if(this.patientsappointments.length>0){
                  this.Repdata=true
              }
              else{
                  this.Repdata=false
              }

              this.patientsappointments = new MatTableDataSource(this.patientsappointments);                   
              this.patientsappointments.sort = this.sort;
              this.patientsappointments.paginator = this.paginator;
              this.totalPrice();
          }
      },

      () => {

      }

  );

}

totalPrice() {
  let total = Number(0);
  for (let data of this.patientList) {
      total =total+ Number(data.payment);
  }      
  this.patientTotalAmount=Number(total);  
}

onSearchClear3() {
  this.searchKey3 = "";
  this.applyFilter3();
}
applyFilter3() {
  this.patientsappointments.filter = this.searchKey3.trim().toLowerCase();
}

exportpdf3(){
  debugger
    var prepare=[];
  this.patientsappointments.filteredData.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.appointmentID);
    tempObj.push(e.patientARCID);
    tempObj.push(e.patient);
    tempObj.push(e.gender);
    tempObj.push( e.age);
    tempObj.push( e.mobile);
    tempObj.push( e.serviceName);
    tempObj.push(e.serviceDate);
    tempObj.push(e.discount);
    tempObj.push(e.payment);
    tempObj.push(e.modeofPayment);
    prepare.push(tempObj);
  });

  const doc = new jsPDF();
  autoTable(doc,{
      head: [[' SL','Patient ARCID','Name','Gender','Age','Mobile',' Service Name','Last Visit','Discount','Payment','Modeof Payment']],
      body: prepare,
  });
  doc.save('Reports' + '.pdf');

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
ExportTOExcel3() {
  // Get the table element by its class name
  const table = document.querySelector('.example-container table');

  // Convert the table to a worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

  // Create a new workbook and append the worksheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Save the workbook as an Excel file
  XLSX.writeFile(wb, 'SheetJS.xlsx');
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

}
