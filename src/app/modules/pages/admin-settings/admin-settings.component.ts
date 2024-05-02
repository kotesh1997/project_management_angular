import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  constructor(private _router:Router,
    private platformlocation: PlatformLocation

  ) {
      history.pushState(null, '', location.href);
      this.platformlocation.onPopState(() => {
          history.pushState(null, '', location.href);
      });

   }

  ngOnInit(): void {
  }

  gotoServices(){
    this._router.navigate(['/service'])
  }

  goToReports(){
    this._router.navigate(['/admin-reports'])
  }

  gotodiscount(){
    this._router.navigate(['/Discount'])
  }

}
