import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }

  gotoServices(){
    this._router.navigate(['/service'])
  }

  goToReports(){
    this._router.navigate(['/admin-reports'])
  }

}
