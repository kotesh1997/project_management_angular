import { PlatformLocation } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements AfterViewInit {
  @ViewChild('barChart') barChart: ElementRef;
  myBarChart: any;

  constructor(
    private platformlocation: PlatformLocation

  ) {
      history.pushState(null, '', location.href);
      this.platformlocation.onPopState(() => {
          history.pushState(null, '', location.href);
      });

   }

  ngAfterViewInit(): void {
    this.myBarChart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['06-04-2024'],
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
            data: [2500], // Assuming the data for 'Consultation' is 2500
            backgroundColor: 'green',
            borderColor: 'green',
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
          {
            label: 'Total Amount',
            data: [4000], // Assuming the data for 'Total Amount' is 4000
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1
          },
          
         
        ]
      },
      options: {
        indexAxis: 'x', // Place the labels at the bottom of the x-axis
        scales: {
          y: {
            // Assuming the max value is 15000
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
}
