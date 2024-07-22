import { ViewEncapsulation, Component, ViewChild, OnInit, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilitiesService } from 'app/Services/utilities.service';
import { DatePipe, PlatformLocation } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';


import {

    FormControl,

    NgForm,
    FormArray
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { GeneralService } from 'app/Services/general.service';
import { ToastService } from 'app/Services/toastservice';
import { environment } from 'environments/environment';

export class Service {
    public serviceId: any;
    public tittle: string;
    public description: any;
    public user: any;
    public client: number;

}

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],

})
export class PopupComponent implements OnInit {

    service: any = {
        tittle: '',
        description: '',
        user: '',
        client: '',

    };
    priceControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
    selectedGender
    myForm: FormGroup;

    selected = 'option1';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('projectlist') projectPaginator: MatPaginator;



    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    displayedColumns: string[] = ['mobile', 'email', 'experience', 'qualification', 'institution', 'Currency', 'Start', 'Deadline', 'Status', 'Tasks', 'Actions', 'Slots'];

    displayedColumnsJr: string[] = ['name', 'mobile', 'email', 'experience', 'qualification', 'institution', 'Currency', 'Start', 'Deadline', 'Status', 'Tasks', 'Actions'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    @ViewChild(MatSort) sort: MatSort;
    private API_URL: any = environment.API_URL;


    status: any = [];
    submitbtn: any;
    statusList: any = [];

    public form: FormGroup;

    submitButton: boolean = true;


    taskForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required)
    });
    projectlist: MatTableDataSource<any>;
    ngOnInit(): void {
        this.getProjects();
    }
    constructor(private dialogRef: MatDialogRef<PopupComponent>,
        private _fuseconfirmationservice: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private utilitiesService: UtilitiesService,
        public datepipe: DatePipe,
        private toastService: ToastService,
        private _snackBar: MatSnackBar,
        private generalService: GeneralService,
        private http: HttpClient,
        private fb: FormBuilder,
        private platformlocation: PlatformLocation,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { id: number }
    ) {
        this.taskForm.patchValue({ projectId: data.id });
        this.taskForm = _formBuilder.group({
            tittle: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            user: ['', Validators.compose([Validators.required])],
            client: ['', Validators.compose([Validators.required])],

        },);
    }


    saveTask() {
        const data = {
            projectId: this.data.id,
            tittle: this.service.tittle,
            description: this.service.description,
            assignedTo: this.service.user,
            assignedBy: this.service.client,
        };

        this.http.post(this.API_URL + 'Project_Management/AddProjectTask', data)
            .subscribe((resp: any) => {
                if (resp.status === 'OK') {
                    this._snackBar.open('Project Added Successfully...!!', 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 2000
                    });
                    this.dialogRef.close(this.taskForm.value);
                    window.location.reload();
                }
            }, err => {
                if (err.error && err.error.message) {
                    this._snackBar.open(err.error.message, 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000
                    });
                } else {
                    this._snackBar.open('Failed to add project. Please try again later.', 'OK', {
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000
                    });
                }
                console.error('Error adding project:', err);
            });
    }

    getProjects() {
        this.utilitiesService.getallprojects().subscribe((response: any) => {
            this.projectlist = new MatTableDataSource(response);
            this.projectlist.sort = this.sort;
            this.projectlist.paginator = this.paginator;
        });
    }

}
