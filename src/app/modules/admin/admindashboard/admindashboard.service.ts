import { Injectable } from "@angular/core"
import { Observable, BehaviorSubject, throwError } from "rxjs"
import { HttpClient } from "@angular/common/http"
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class AdmindashboardService {

    private messageSource = new BehaviorSubject<any>(1);
    currentMessage = this.messageSource.asObservable();
    private API_URL: any = environment.API_URL;
    constructor(private http: HttpClient) {

    }

    getDoctor(doctorID): Observable<any> {
        return this.http.get<any>(this.API_URL + "Doctor/GetDoctor/" + doctorID)
            .pipe(
                tap(status => console.log("status: " + status)),
                catchError(this.handleError)
            );
    }


    getDoctors(): Observable<any> {
        return this.http.get<any>(this.API_URL + "Doctor/GetAllDoctors/")
            .pipe(
                tap(status => console.log("status: " + status)),
                catchError(this.handleError)
            );
    }
    private handleError(error: any) {
        console.error(error);
        return throwError(error);
    }

    getDashboardData(): Observable<any> {
        return this.http.get<any>(this.API_URL + "Registration/GetDashboardCount/getDashboardCount/")
            .pipe(
                tap(status => console.log("status: " + status)),
                catchError(this.handleError)
            );
    }
}
