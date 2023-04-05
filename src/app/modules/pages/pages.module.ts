import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { Route, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppointmentsComponent } from './appointments/appointments.component';
import { DoctorsCalenderComponent } from './doctors-calender/doctors-calender.component';
import { PatientsComponent } from './patients/patients.component';
import { MyPatientsComponent } from './mypatients/myPatients.component';
import { ReportComponent } from './Reports/report.component';
import { MedicineComponent } from './medicine/medicine.component';
import { PatientsService } from './patients/patients.service';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdmindashboardModule } from '../admin/admindashboard/admindashboard.module';
import { AdmindashboardComponent } from '../admin/admindashboard/admindashboard.component';
import { AdmindashboardService } from '../admin/admindashboard/admindashboard.service';

import { ToastComponent } from './directives/toast.component';
import { MatChipsModule } from '@angular/material/chips';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MastersComponent } from './masters/masters.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { MyPatientsService } from './mypatients/mypatients.service';
 import { ReportService } from './Reports/report.service';
import { MedicineService } from './medicine/medicine.service';

const Routes: Route[] = [
    { path: 'Appointments', component: AppointmentsComponent },
    { path: 'DoctorsCalender', component: DoctorsCalenderComponent },
    { path: 'Patients', component: PatientsComponent },
    { path: 'MyPatients', component: MyPatientsComponent },
    { path: 'Medicine', component:  MedicineComponent},
     { path: 'Reports', component: ReportComponent },
    { path: 'Admindashboard', component: AdmindashboardComponent },
    //{ path: 'Admindashboard', component: MastersComponent },
    { path: 'Employess', component: MastersComponent },
    { path: 'PatientHist', component: PatientHistoryComponent },



];

@NgModule({
    declarations: [
        AppointmentsComponent,
        DoctorsCalenderComponent,
        PatientsComponent,
        MyPatientsComponent,
        MedicineComponent,
        ReportComponent,
        ToastComponent,
        MastersComponent,
        PatientHistoryComponent,
    ],
    imports: [
        CommonModule, MatExpansionModule, MatChipsModule, MatAutocompleteModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(Routes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        // MatDatepickerInputEvent,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NgxMaterialTimepickerModule,
        FuseAlertModule, MatSnackBarModule, FullCalendarModule, 
       
    ],
    providers: [PatientsService,DatePipe, AdmindashboardService,MyPatientsService,ReportService,MedicineService],
})
export class PagesModule {}
