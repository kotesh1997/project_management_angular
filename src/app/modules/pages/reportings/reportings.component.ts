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

export class TotalCounts {
  totalProjectsCount: number;
  totalTasksCount: number;
  totalActiveProjectsCount: number;
  totalInactiveProjectsCount: number;
  totalRevenue: number;
  totalRevenueInClientCurrency: number;
}

import jsPDF from 'jspdf';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'app/Services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-reportings',
  templateUrl: './reportings.component.html',
  styleUrls: ['./reportings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportingsComponent implements OnInit {



  @ViewChild('barChart') barChart: ElementRef;
  myBarChart: any;
  totalprojects: number = 0
  totaltasks: number = 0
  totalrevenue: number = 0
  clientrevenue: number = 0
  activeprojects: number = 0
  inactiveprojects: number = 0
  date


  constructor(
    private datePipe: DatePipe,
    private _matDialog: MatDialog,
    private utilitiesService: UtilitiesService, private formBuilder: FormBuilder, public spinner: LoaderService, public datepipe: DatePipe, private _formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private platformlocation: PlatformLocation

  ) {
    history.pushState(null, '', location.href);
    this.platformlocation.onPopState(() => {
      history.pushState(null, '', location.href);
    });
  }


  Screen: any = 1;

  ngAfterViewInit(): void {
    if (this.myBarChart) {
      this.myBarChart.destroy();
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
            label: 'Total Projects',
            data: [this.totalprojects],
            backgroundColor: 'rgb(0, 214, 57)',
            borderColor: 'green',
            borderWidth: 1
          },
          {
            label: 'Total Tasks',
            data: [this.totaltasks],
            backgroundColor: 'blue',
            borderColor: 'blue',
            borderWidth: 1
          },
          {
            label: 'Total Revenue',
            data: [this.totalrevenue],
            backgroundColor: 'orange',
            borderColor: 'orange',
            borderWidth: 1
          },
          {
            label: 'Client Revenue',
            data: [this.clientrevenue],
            backgroundColor: 'yellow',
            borderColor: 'yellow',
            borderWidth: 1
          },

          {
            label: 'Total Revenue',
            data: [this.totalrevenue],
            backgroundColor: 'grey',
            borderColor: 'grey',
            borderWidth: 1
          },
          {
            label: 'Client Revenue',
            data: [this.clientrevenue],
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1
          },

        ]
      },
      options: {
        indexAxis: 'x',
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
              text: 'Project Reports'
            },
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                return value;
              }
            }
          }
        },

      }


    });
  }


  ngOnInit(): void {
    this.loadData();
    this.showGraph()
  }

  showGraph() {

  }

  loadData() {
    this.utilitiesService.getTotalCounts().subscribe(
      (data: TotalCounts) => {
        this.totalprojects = data.totalProjectsCount;
        this.totaltasks = data.totalTasksCount;
        this.totalrevenue = data.totalRevenue;
        this.clientrevenue = data.totalRevenueInClientCurrency;
        this.activeprojects = data.totalActiveProjectsCount;
        this.inactiveprojects = data.totalInactiveProjectsCount;

        this.updateChart();
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  updateChart() {
    if (this.myBarChart) {
      this.myBarChart.destroy();
    }

    if (!this.barChart || !this.barChart.nativeElement) {
      console.error('Cannot access barChart element');
      return;
    }

    this.myBarChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Total Projects', 'Total Tasks', 'Active Projects', 'Inactive Projects', 'Total Revenue', 'Client Revenue'],
        datasets: [
          {
            label: 'Counts',
            data: [this.totalprojects, this.totaltasks, this.activeprojects, this.inactiveprojects, this.totalrevenue, this.clientrevenue],
            backgroundColor: ['green', 'blue', 'orange', 'yellow', 'grey', 'red'],
            borderColor: ['green', 'blue', 'orange', 'yellow', 'grey', 'red'],
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'x',
        plugins: {
          tooltip: {},
          legend: {
            position: 'bottom',
            display: true,
            labels: {
              boxWidth: 10
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false, // Remove vertical grid lines
            },
          },
          y: {
            title: {
              display: true,
              text: 'Count'
            },
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value;
              }
            }
          }
        }
      }
    });
  }




}
