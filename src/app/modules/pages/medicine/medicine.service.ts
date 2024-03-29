import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class MedicineService {
    private messageSource = new BehaviorSubject<any>(1);
    currentMessage = this.messageSource.asObservable();
    private API_URL: any = environment.API_URL;
    constructor(private http: HttpClient) {}

   
    // getReportPatientList(this.appt): Observable<any> {
    //     return this.http
    //         .get<any>(this.API_URL + 'PatientsAppointments/getReportPatientList/')
    //         .pipe(
    //             tap((status) => console.log('status: ' + status)),
    //             catchError(this.handleError)
    //         );
    // }

    GetMedicineList(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'PatientsAppointments/GetMedicineList/')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    

    addUpdateMedicineDetails(data) {
        debugger;       
            var url = 'PatientsAppointments/AddUpdateMedicine/';       
        
        return this.http
            .post(this.API_URL + url,data)
            .pipe(
                
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

    //   GetMedicineXML(data) {
    //     debugger
    //     return this.http
    //         .post(
    //             this.API_URL + 'PatientsAppointments/GetMedicineXML/', data
    //         )
    //         .pipe(
    //             tap((status) => console.log('status: ' + status)),
    //             catchError(this.handleError)
    //         );
    // }

    
   

    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }
}
