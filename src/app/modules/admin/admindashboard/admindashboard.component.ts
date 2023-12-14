import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdmindashboardService } from './admindashboard.service';
import { Router } from '@angular/router'; 




export class DashboardData {
  doctors: number;
  jrDoctors: number;
  patients: number;
  frontDesk: number;
}


@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmindashboardComponent implements OnInit {
  doctorDetails: any; errorMessage: any;
  dashboardData = new DashboardData();
  dashboardData1: any;

  constructor(private admindashboardService: AdmindashboardService,private router: Router) { }

  ngOnInit(): void {
    debugger
    this.getDoctors();
    this.getDashboardData();

    

  }
  getDoctors() {

    debugger

    this.admindashboardService.getDoctors().subscribe(
      (data) => {
        if (data) {
          this.doctorDetails = data;
        }
      },
      (error) => {
        this.errorMessage = error;
      },
      () => {

      }

    );
  }

  getDashboardData() {

    debugger

    this.admindashboardService.getDashboardData().subscribe(
      (data) => {
        if (data) {
          this.dashboardData1 = data;
          this.dashboardData.doctors =this.dashboardData1[0].total
    this.dashboardData.jrDoctors =this.dashboardData1[2].total
    this.dashboardData.frontDesk =this.dashboardData1[1].total
    this.dashboardData.patients =this.dashboardData1[3].total
        }
      },
      (error) => {
        this.errorMessage = error;
      },
      () => {

      }

    );
  }

  
}
