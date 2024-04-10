import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { bottom } from '@popperjs/core';
import { UtilitiesService } from 'app/Services/utilities.service';
import { Chart } from 'chart.js/auto';
import { result } from 'lodash';
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
@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminReportsComponent implements OnInit {
  @ViewChild('barChart') barChart: ElementRef;
  myBarChart: any;
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
  displayedColumns2: string[] = ['date','newreg','billedpatients', 'consultations', 'lab', 'others', 'totalearnings'];
  displayedColumns: string[] = ['department', 'service', 'count', 'totalbill', 'totalcollected'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;

  constructor( private utilitiesService: UtilitiesService,private datePipe: DatePipe) { }


  

  
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

  ngOnInit(): void {
    this.showGraph()
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

getSummaryReports(){
  debugger
  this.sumrep.departmentId=1
  this.utilitiesService.getSummaryReports(this.cardrep).subscribe(
    (data) => {
      if (data) {
        this.consultation=data.result.consultation
        this.totalEarnings=data.result.totEarnings
        const resultdate=data.result.date
        this.date=this.datePipe.transform(resultdate, 'dd/MM/yyyy');
        this.summaryReports = new MatTableDataSource<any>([data.result]);
        this.summaryReports.sort = this.sort;
        this.summaryReports.paginator = this.paginator;
        this.ngAfterViewInit()
      }
    })
}

getCardReports(){
  this.cardrep.departmentId=1
  this.utilitiesService.getCardReports(this.cardrep).subscribe(
    (data) => {
      if (data) {
        this.totalBilled=data.result.totBilled
        this.totalCollected=data.result.totCollected
        this.cash=data.result.cash
        this.card=data.result.card
       // this.wallet=data.result.netbanking
       this.billedpatients=data.result.unqBilledPatients
        // this.summaryReports = new MatTableDataSource<any>([data.result]);
        // this.summaryReports.sort = this.sort;
        // this.summaryReports.paginator = this.paginator;
      }
    })

    this.getSummaryReports()
}



}
