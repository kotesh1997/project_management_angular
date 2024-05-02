import { ViewEncapsulation, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientsService } from './patients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatformLocation } from '@angular/common';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.scss'],
    //encapsulation: ViewEncapsulation.None
})
export class PatientsComponent implements OnInit {
    horizontalStepperForm: FormGroup;
    constructor(public patientsService: PatientsService, private _formBuilder: FormBuilder,
        private platformlocation: PlatformLocation

    ) {
        history.pushState(null, '', location.href);
        this.platformlocation.onPopState(() => {
            history.pushState(null, '', location.href);
        });

    }

    patientsappointments: MatTableDataSource<any>;
    displayedColumns: string[] = ['SL', 'Patient', 'Mobile', 'LastSeen', 'AddAppointment', 'Action'];
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    searchKey: string;



    ngOnInit(): void {
        this.GetAllAppointments();
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                country: ['', Validators.required],
                language: ['', Validators.required]
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                about: ['']
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true]
                }),
                pushNotifications: ['everything', Validators.required]
            })
        });
    }


    GetAllAppointments() {

        this.patientsService.GetAllAppointments().subscribe(
            (data) => {
                if (data) {
                    this.patientsappointments = data;
                }
                this.patientsappointments = new MatTableDataSource(data);
                this.patientsappointments.sort = this.sort;
                this.patientsappointments.paginator = this.paginator;
            },

            () => {

            }

        );
    }
    onSearchClear() {
        this.searchKey = "";
        this.applyFilter();
    }
    applyFilter() {
        this.patientsappointments.filter = this.searchKey.trim().toLowerCase();
    }



}
