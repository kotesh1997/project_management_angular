import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { AdmindashboardComponent } from './modules/admin/admindashboard/admindashboard.component';
import { ReportComponent } from './modules/pages/Reports/report.component';
import { AppointmentsComponent } from './modules/pages/appointments/appointments.component';
import { DoctorsCalenderComponent } from './modules/pages/doctors-calender/doctors-calender.component';
import { MastersComponent } from './modules/pages/masters/masters.component';
import { MedicineComponent } from './modules/pages/medicine/medicine.component';
import { MyPatientsComponent } from './modules/pages/mypatients/myPatients.component';
import { PatientHistoryComponent } from './modules/pages/patient-history/patient-history.component';
import { PatientsComponent } from './modules/pages/patients/patients.component';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'Appointments' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'Appointments' },

    // Auth routes for guests
    {
        path: '',
        // canActivate: [NoAuthGuard],
        // canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
            
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
            
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
           
        ]
    },

    // Admin routes
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
            { path: 'calendar', loadChildren: () => import('app/modules/admin/apps/calendar/calendar.module').then(m => m.CalendarModule) },
            { path: 'Admindashboard', loadChildren: () => import ('app/modules/admin/admindashboard/admindashboard.module').then(m=> m.AdmindashboardModule) },
            { path: 'Pages', loadChildren: () => import ('app/modules/pages/pages.module').then(m=> m.PagesModule) },
            {path: 'password', loadChildren: () => import('app/layout/common/password/password.module').then(m => m.PasswordModule)},
            
            // { path: 'Appointments', component: AppointmentsComponent },
            // { path: 'DoctorsCalender', component: DoctorsCalenderComponent },
            // { path: 'Patients', component: PatientsComponent },
            // { path: 'MyPatients', component: MyPatientsComponent },
            // { path: 'Medicine', component:  MedicineComponent},
            //  { path: 'Reports', component: ReportComponent },
            // { path: 'Admindashboard', component: AdmindashboardComponent },
            // //{ path: 'Admindashboard', component: MastersComponent },
            // { path: 'Employess', component: MastersComponent },
            // { path: 'PatientHist', component: PatientHistoryComponent },
        ]
    },
    // Pages routes

    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('app/modules/pages/pages.module').then(m => m.PagesModule) },

        ]
    }
];
