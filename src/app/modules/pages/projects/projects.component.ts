
import { FormArray } from '@angular/forms';
import { ViewEncapsulation, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, PlatformLocation } from '@angular/common';
import { AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,




} from '@angular/forms';
import { GeneralService } from '../../../Services/general.service';
import { UtilitiesService } from 'app/Services/utilities.service';
import { ToastService } from 'app/Services/toastservice';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

export class Service {
  public id: number;
  public code: string;
  public name: string;
  public client: string;
  public project_Manager: string;
  public revenue: number;
  public revenue_ClientCurrency: number;
  public startDate: string;
  public deadLine: string;
  public status: any;
  public task: string;
}


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ProjectsComponent implements OnInit {
  service: any = {
    client: '',
    code: '',
    deadLine: '',
    name: '',
    project_Manager: '',
    revenue: '',
    revenue_ClientCurrency: '',
    startDate: '',
    status: ''
  };

  priceControl = new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]);
  selectedGender
  myForm: FormGroup;

  selected = 'option1';

  @ViewChild('drawer') drawer: FuseDrawerComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('projectlist') projectPaginator: MatPaginator;



  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  displayedColumns: string[] = ['mobile', 'email', 'experience', 'qualification', 'institution', 'Currency', 'Start', 'Deadline', 'Status', 'Tasks', 'Actions', 'Slots'];

  @ViewChild(MatSort) sort: MatSort;
  private API_URL: any = environment.API_URL;
  flag: string;
  regDetailsJrList: any = [];
  regDetailsFrontList: any = [];
  regDetailsLabList: any = [];

  services = new MatTableDataSource(this.regDetailsLabList);


  status: any = [];
  submitbtn: any;
  public form: FormGroup;
  submitButton: boolean = true;
  searchKey: string;
  searchKey1: string;
  searchKey2: string;
  searchKey3: string;
  Updatebtn: boolean;
  submitButton1: boolean = false;
  ts1: { start: any; ending: any; day: any; }[];

  constructor(
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


  ) {
    history.pushState(null, '', location.href);
    this.platformlocation.onPopState(() => {
      history.pushState(null, '', location.href);
    });


    this.form = _formBuilder.group({
      client: ['', Validators.compose([Validators.required])],
      code: ['', Validators.compose([Validators.required])],
      deadLine: [''],
      name: ['', Validators.compose([Validators.required])],
      project_Manager: ['', Validators.compose([Validators.required])],
      revenue: ['', Validators.compose([Validators.required])],
      revenue_ClientCurrency: [''],
      startDate: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],

    },);

  }

  ngOnInit(): void {

    this.getprojects();
    this.submitbtn = true;
  }

  projectTaskCounts: any = [];

  projectlist: any = [];

  getprojects() {
    this.utilitiesService.getallprojects().subscribe((response: any) => {
      this.projectlist = new MatTableDataSource(response);
      this.projectlist.sort = this.sort;
      this.projectlist.paginator = this.paginator;
      console.log('response', response)
    });
  }


  deleteproject(id) {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    if (confirmDelete) {
      this.utilitiesService.deleteprojectById(id).subscribe((resp: any) => {
        if (resp.status == "OK") {
          this._snackBar.open('project deleted Successfully...!!', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 2000
          });
          this.getprojects();
        }
      });
    }
  }

  updateProject() {
    let updatedData = this.form.value;
    updatedData['id'] = this.currenteditingelement.id;
    this.http.put(`${this.API_URL}Project_Management/UpdateProject`, updatedData)
      .subscribe((resp: any) => {
        if (resp.status === 'OK') {
          this._snackBar.open('Project Updated Successfully...!!', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 2000
          });
          this.drawer.close();
          this.getprojects();
        }
      }, err => {
        if (err.error && err.error.message) {
          this._snackBar.open(err.error.message, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000
          });
        } else {
          this._snackBar.open('Failed to update project. Please try again later.', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000  // Adjust duration as needed
          });
        }
        console.error('Error updating project:', err);
      });
  }


  showError: boolean = false
  errMsg: string


  saveproject() {
    const data = {
      code: this.service.code,
      name: this.service.name,
      client: this.service.client,
      project_Manager: this.service.project_Manager,
      revenue: this.service.revenue,
      revenue_ClientCurrency: this.service.revenue_ClientCurrency,
      startDate: this.service.startDate,
      deadLine: this.service.deadLine,
      status: this.service.status,
      task: 'string'
    };

    this.http.post(this.API_URL + 'Project_Management/AddProject', data)
      .subscribe((resp: any) => {
        if (resp.status === 'OK') {
          this._snackBar.open('Project Added Successfully...!!', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 2000
          });
          this.drawer.close();
          this.getprojects();  // Refresh projects list after adding
        }
      }, err => {
        if (err.error && err.error.message) {
          this._snackBar.open(err.error.message, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000  // Adjust duration as needed
          });
        } else {
          this._snackBar.open('Failed to add project. Please try again later.', 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 5000  // Adjust duration as needed
          });
        }
        console.error('Error adding project:', err);
      });
  }



  clearSearch() {
    this.searchKey = '';
    this.doFilter1(this.searchKey, 1)
  }

  public doFilter1 = (value, state) => {
    var sd = value.trim().toLocaleLowerCase()
    this.projectlist.filter = value.trim().toLocaleLowerCase()
    this.searchKey3 = '';
    var value1 = '';
    this.regDetailsJrList.filter = value1.trim().toLocaleLowerCase()
    this.regDetailsFrontList.filter = value1.trim().toLocaleLowerCase()
    this.regDetailsLabList.filter = value1.trim().toLocaleLowerCase()
    this.searchKey2 = '';
    this.searchKey1 = '';
  };

  openSaveDrawer() {
    this.service = new Service()
    this.drawer.open();
    this.form.reset()
    this.submitbtn = true;
    this.Updatebtn = false;
  }
  currenteditingelement: any = [];

  openUpdateDrawer(element) {
    this.currenteditingelement = element
    this.drawer.open();
    this.form.patchValue(element)
    this.submitbtn = false;
    this.Updatebtn = true;
  }


  openTaskPopup(element) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '500px',
      data: { id: element.id }
    });
  }
}



