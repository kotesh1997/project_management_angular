import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UtilitiesService } from 'app/Services/utilities.service';
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

  searchKey
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

  ngOnInit(): void {
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
}
applyFilter() {
    this.deptReports.filter = this.searchKey.trim().toLowerCase();
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
  this.sumrep.departmentId=1
  this.utilitiesService.getSummaryReports(this.sumrep).subscribe(
    (data) => {
      if (data) {
        this.summaryReports = new MatTableDataSource<any>([data.result]);
        this.summaryReports.sort = this.sort;
        this.summaryReports.paginator = this.paginator;
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
}



}
