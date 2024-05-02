import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserService } from 'app/core/user/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { PlatformLocation } from '@angular/common';



@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PasswordComponent implements OnInit {

  isPasswordEmpty = true;
  passwordChanged: boolean = false;
successMessage: string = '';
showPasswordNotMatchMessage: boolean = false;

  

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  showAlert: boolean = false;
  user: User;
  resetPasswordForm: any;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _authService: AuthService,private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _formBuilder: FormBuilder,  private _userService: UserService,  
    private platformlocation: PlatformLocation

  ) {
      history.pushState(null, '', location.href);
      this.platformlocation.onPopState(() => {
          history.pushState(null, '', location.href);
      });
  }

  loginDetails: any = [];
  roleID: any;
  roleName: any;
  ngOnInit(): void {
    var val=  localStorage.getItem('loginDetails');
    // Subscribe to user changes
    this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: User) => {
            debugger
            this.user = user;
            this.loginDetails = JSON.parse(
                localStorage.getItem('loginDetails')
            );
            console.log("login", this.loginDetails)

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    this.resetPasswordForm = this._formBuilder.group(
      {
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required],
      },
      {
        validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
      }
    );
  }

 
  signOut(): void {
    this._router.navigate(['/sign-out']);
}



// rest(){
//   debugger
// var data={
//   registrationID:this.loginDetails.registrationID,
//   newPassword:this.resetPasswordForm.controls['password'].value,
//   confirmPassword:this.resetPasswordForm.controls['passwordConfirm'].value
// }

//   this._authService.resetPasswords(data).subscribe(res => {
//     debugger
  
//     console.log('contcats',res)
    
//     // datasource=res;
//   })
// }

// rest() {
//   debugger;

//   var data = {
//     registrationID: this.loginDetails.registrationID,
//     newPassword: this.resetPasswordForm.controls['password'].value,
//     confirmPassword: this.resetPasswordForm.controls['passwordConfirm'].value
//   };

//   this._authService.resetPasswords(data).subscribe(
//     (res: any) => {
//       debugger;

//       console.log('contcats', res);

//       if (res && res.status === 'success') {
//         this.passwordChanged = true;
//         this.successMessage = 'An error occurred while changing the password.';  
//       } else {
//         this.passwordChanged = false;
//         this.successMessage = 'Password changed successfully!';
//       }
//       this.resetPasswordForm.reset();
//     },
//     error => {
//       console.error('Error:', error);
//       this.passwordChanged = false;
//       this.successMessage =  'Password change failed. Please try again.';
//     }
//   );
// }

rest() {
  debugger
  // Disable the form during submission
  this.resetPasswordForm.disable();

  var data = {
    registrationID: this.loginDetails.registrationID,
    newPassword: this.resetPasswordForm.controls['password'].value,
    confirmPassword: this.resetPasswordForm.controls['passwordConfirm'].value
  };

  this._authService.resetPasswords(data).subscribe(
    (res: any) => {
      if (res && res.status === 'success') {
        this.passwordChanged = true;
        this.successMessage = 'An error occurred while changing the password.';
      } else {
        this.passwordChanged = false;
        this.successMessage = 'Password changed successfully!';

        // Clear form and reset flags
        this.resetPasswordForm.reset();
        this.showPasswordNotMatchMessage = false;
        this.isPasswordEmpty = true;

        // Manually mark both password and confirm password controls as untouched and valid
        this.resetPasswordForm.get('password').markAsUntouched();
        this.resetPasswordForm.get('password').setErrors(null);
        this.resetPasswordForm.get('passwordConfirm').markAsUntouched();
        this.resetPasswordForm.get('passwordConfirm').setErrors(null);
      }
    },
    error => {
      console.error('Error:', error);
      this.passwordChanged = false;
      this.successMessage = 'Password change failed. Please try again.';
    }
  ).add(() => {
    // Enable the form after submission (whether successful or not)
    this.resetPasswordForm.enable();
  });
}




  onPasswordConfirmInput(): void {
    this.showPasswordNotMatchMessage =
      this.resetPasswordForm.get('passwordConfirm').dirty &&
      this.resetPasswordForm.hasError('mustMatch');
      this.successMessage = '';
  }

onPasswordChange() {
  this.isPasswordEmpty = this.resetPasswordForm.get('password').value === '';
  this.successMessage = '';
}




  togglePasswordVisibility(field: any): void {
    field.type = field.type === 'password' ? 'text' : 'password';
  }



}


