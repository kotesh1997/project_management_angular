import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',

})

export class GeneralService {
  url: any;
  urlname: any;
    private API_URL: any = environment.API_URL;
  constructor(public http: HttpClient,) { }


  //Global Method to retrieve data 
  GetData(url) {
    return new Promise((resolve, reject) => {
      this.http.get('../assets/WebService.json').subscribe((data: any) => {
        this.urlname = data.Webservice;
        this.url = this.urlname + url
        this.http.get(this.url).subscribe(data => {

          resolve(data)
        }, err => {
          reject(err)
        })
      }, err => {
        reject(err)
      })
    });
  }
  //Global Method to Post data 
    PostData(url, PostParam) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
        this.http.get('../assets/WebService.json').subscribe((data: any) => {
        this.urlname = data.Webservice;
          url = this.API_URL + url
            this.http.post(url, PostParam, { headers: headers }).subscribe(data => {

          resolve(data)
        }, err => {
          reject(err)
        })
      }, err => {
        reject(err)
      })
    });
  }
  PostData2(url, PostParam, PostParam2) {

    return new Promise((resolve, reject) => {
      this.http.get('../assets/WebService.json').subscribe((data: any) => {
        this.urlname = data.Webservice;
        url = data.Webservice + url
        this.http.post(url, PostParam, PostParam2).subscribe(data => {
          resolve(data)
        }, err => {
          reject(err)
        })
      }, err => {
        reject(err)
      })
    });
  }

  SoapServicePostData(url, PostParam) {
    
    return new Promise((resolve, reject) => {
      this.http.get('../assets/WebSoapService.json').subscribe((data: any) => {

        url = data.Webservice + url
        // url =url
        this.http.post(url, PostParam).subscribe(data => {

          resolve(data)
        }, err => {
          reject(err)
        })
      }, err => {
        reject(err)
      })


    });
  }
  SuccessMessage() {

  }

  SoapServiceGetData(url) {
    return new Promise((resolve, reject) => {
      this.http.get('../assets/WebSoapService.json').subscribe((data: any) => {

        this.urlname = data.Webservice;
        this.url = this.urlname + url
        this.http.get(this.url).subscribe(data => {

          resolve(data)
        }, err => {
          reject(err)
        })
      }, err => {
        reject(err)
      })
    });
  }
}
