import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdmindashboardService } from './admindashboard.service';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdmindashboardComponent implements OnInit {
  doctorDetails: any; errorMessage: any;

  constructor(private admindashboardService: AdmindashboardService,private router: Router) { }

  ngOnInit(): void {
    this.getDoctors();
  }
  getDoctors() {

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
  
}
