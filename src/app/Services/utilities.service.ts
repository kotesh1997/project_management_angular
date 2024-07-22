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


    CRUD(data, url) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(this.API_URL + url, data, { headers: headers });
    }

    addService(data) {
        return this.http.put(this.API_URL + 'Service/AddProject', data)
    }


    getallprojects() {
        return this.http.get(this.API_URL + 'Project_Management/GetAllProjects')
    }


    deleteprojectById(id): Observable<any> {
        return this.http
            .delete<any>(`${this.API_URL}Project_Management/DeleteProject/DeleteProjectbyId?id=${id}`)
            .pipe(
                tap((status) => console.log('status: ' + status)),
            );
    }

    getTotalCounts() {
        return this.http.get(this.API_URL + 'Project_Management/GetTotalCounts/totalcounts')
    }



}
