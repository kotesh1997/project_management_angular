import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UtilitiesService {
    headers = {
        headers: new HttpHeaders({
            'enctype': 'multipart/form-data',
            'Accept': 'application/json'
        })
    };
    private messageSource = new BehaviorSubject<any>(1);
    currentMessage = this.messageSource.asObservable();
    private API_URL: any = environment.API_URL;
    constructor(private http: HttpClient) { }
   

    CRUD(data,url) {
       // debugger
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.API_URL + url, data, { headers: headers });
    }
    
   

    GetComplaintsXML(data) {
      //  debugger
        return this.http
            .post(
                this.API_URL + 'PatientsAppointments/GetComplaintsXML/', data
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    DocumentsDownload(fileUrl: string) {
        debugger
        return this.http.get(this.API_URL + "PatientsAppointments/DocumentsDownload?fileUrl=" + fileUrl, {
            reportProgress: true,
            observe: 'events',
            responseType: 'blob'
        });
    }
    GetDocumentsXML(data) {
        debugger
        return this.http
            .post(
                this.API_URL + 'PatientsAppointments/GetDocumentsXML/', data
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

    GetMedicineXML(data) {
        debugger
        return this.http
            .post(
                this.API_URL + 'PatientsAppointments/GetMedicineXML/', data
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    
    addDocs(data) {
        debugger
        return this.http
            .post(
                this.API_URL + 'PatientsAppointments/AddDocs/', data
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }


    getStates(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/AllGetStates').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getState(stateID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetState' + stateID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAllAppointmentBills(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAllAppointmentBills')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAppointmentBill(priceID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAppointmentBill' + priceID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getServices(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/GetServices').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getService(serviceID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetService' + serviceID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getStatuses(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/GetStatuses').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getStatus(statusID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetStatus' + statusID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAllGenders(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAllGenders')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getGender(genderID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetGender' + genderID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAllMOP(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/GetAllMOP').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getMOP(modeofPaymentID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetMOP' + modeofPaymentID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAllRoles(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/GetAllRoles').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getRole(roleID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetRole' + roleID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getSlots(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Utilities/GetSlots').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getSlot(slotID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetSlot' + slotID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getSpecializations(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAllSpecializations')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getSpecialization(specializationID): Observable<any> {
        return this.http
            .get<any>(
                this.API_URL + 'Utilities/GetSpecialization' + specializationID
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getTypeofReports(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAllTypeofReports')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getTypeofReport(typeofReportID): Observable<any> {
        return this.http
            .get<any>(
                this.API_URL + 'Utilities/GetTypeofReport' + typeofReportID
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getDiscounts(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetAllDiscounts')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getDiscount(discountID): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'Utilities/GetDiscount' + discountID)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    getAllDoctors(): Observable<any> {
        return this.http.get<any>(this.API_URL + 'Doctor/GetAllDoctors').pipe(
            tap((status) => console.log('status: ' + status)),
            catchError(this.handleError)
        );
    }
    getAllAppointments(): Observable<any> {
        return this.http
            .get<any>(this.API_URL + 'PatientsAppointments/GetAllAppointments')
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    deleteAppointment(patientsAppointments) {
        debugger
        return this.http
            .post(
                this.API_URL + 'PatientsAppointments/DeleteAppointment/',patientsAppointments
            )
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }

    addRegisterPatientAppointment(data) {
        debugger;
        if (data.Action == 'New Appointment') {   //Patient not exisiting condition
            var url = 'Patients/AddRegisterPatientAppointment/';

        }
        else if (data.Action == 'Update Existing Appointment' || data.Action=='Patient Exists save new appointment') {
            var url = 'PatientsAppointments/AddUpdateAppointment/';

        }
       
        else {
            var url = 'PatientsAppointments/AddUpdateAppointment/';

        }
        return this.http
            .post(this.API_URL + url,data)
            .pipe(
                
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    get(url,data) {
        debugger
        return this.http
            .post(this.API_URL + url, data)
            .pipe(
                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    addUpdateVitals(data,url) {
        debugger
        return this.http
            .post(this.API_URL + url, data)
            .pipe(

                tap((status) => console.log('status: ' + status)),
                catchError(this.handleError)
            );
    }
    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }
}
