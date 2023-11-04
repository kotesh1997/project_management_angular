import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { PatientsService } from 'app/modules/pages/patients/patients.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,

    animations: fuseAnimations,
    providers: [PatientsService],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: FormGroup;
    signInForm1: FormGroup;

    showAlert: boolean = false;
    loginDetails: any;
    

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private patientsService: PatientsService
    ) {}

    isSignInButtonDisabled(): boolean {
        return this.signInForm.invalid;
      }
      
      

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: [''],
        });
        this.signInForm1 = this._formBuilder.group({
            email: [
                'hughes.brian@company.com',
                [Validators.required, Validators.email],
            ],
            password: ['admin', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    signIn() {
        debugger
        this.patientsService.signIn(this.signInForm.value).subscribe(
            (data) => {
                if (data) {
                    this.loginDetails = data;
                    localStorage.removeItem('roleID');
                    localStorage.setItem('roleID', data.roleID);
                    localStorage.removeItem('loginDetails');
                    localStorage.setItem('loginDetails', JSON.stringify(data));
                    this.signIn1();
                } else {
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong username or password',
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            },

            () => {}
        );
    }
    /**
     * Sign in
     */

    signIn2(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL);
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();
                localStorage.removeItem('loginDetails');
                localStorage.setItem('loginDetails', response);
                alert(response);
                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong username or password',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    signIn1(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn1(this.signInForm1.value).subscribe(
            () => {
                // Set the redirect url.
                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL =
                    this._activatedRoute.snapshot.queryParamMap.get(
                        'redirectURL'
                    ) || '/signed-in-redirect';

                // Navigate to the redirect url
                this._router.navigateByUrl('/Appointments');
            },
            (response) => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',

                    message: 'Wrong email or password',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }
}
