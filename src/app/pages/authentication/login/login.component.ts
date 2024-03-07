import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginService } from '../../Services/login.service';
import { TokenService } from '../../Services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../Services/common.service';
import { CommonSpinnerService } from '../../Services/common-spinner.service';
import { snackbarStatus } from '../../Enums/notification-snackbar';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class LoginComponent {

  loginFormGroup:FormGroup;
  hide = true;
  userCredential : any;
  expiryDate : number;

  constructor(private _formBuilder : FormBuilder,
              private router : Router, 
              public _dialog: MatDialog, 
              private _loginService : LoginService, 
              private _commonService : CommonService, 
              private _tokenService : TokenService, 
              private _commonSpinner : CommonSpinnerService
              )
  {
    this.loginFormGroup = this._formBuilder.group({
      UserId : ['',Validators.required],
      Password : ['',Validators.required]
    })
  }

  ngOnInit() 
  {
    if(localStorage.getItem('SalesToken'))
    {
      this.userCredential = this._tokenService.decryptToken(localStorage.getItem('SalesToken'));

      this.router.navigate(['/pages/price-pages/dashboard'])
    }
  }

  OpenForgotPasswordDialog(choice : string){
    // const dialogRef = this._dialog.open(ForgotPasswordComponent);
    this.loginFormGroup.reset();
    const dialogRef = this._dialog.open(ForgotPasswordComponent, {
      disableClose: true,
      backdropClass: 'userActivationDialog',
      data : choice,
    }).afterClosed()
    .subscribe((res) => {
      if(res == "Change Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
      else if(res == "Forgot Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
    });
  }

  Login(){
    if(this.loginFormGroup.valid)
    {
      this._commonSpinner.showSpinner();
      this._loginService.authentication(this.loginFormGroup.value).subscribe({
        next : (response) => 
        {

          this._loginService.getPasswordValidity(this.loginFormGroup.value.UserId).then(
            (data) => 
            {
              this.expiryDate = data;

            if(this.expiryDate < 90)
            {

              localStorage.setItem("SalesToken", response.Token);
              this._tokenService.getUserName(response.Token);
              this._commonSpinner.hideSpinner();
              this.router.navigate(['/pages/price-pages/dashboard']).then(() => 
              {
                this._commonService.openSnackbar("Login Successfully", snackbarStatus.Success);
              });
            }
            else
            {
              this._commonSpinner.hideSpinner();
              this.loginFormGroup.reset();
              this.OpenForgotPasswordDialog("Change Password");
            }

          }
        ).catch((err) => 
        {
          this._commonSpinner.hideSpinner();
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        })
        },error : (err) => {
          this._commonSpinner.hideSpinner();
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      })
    }
    else
    {
      if(this.loginFormGroup.controls.UserId.invalid && this.loginFormGroup.controls.Password.invalid)
      {
        this._commonService.openSnackbar("Enter User Id, Password", snackbarStatus.Danger);
        this.loginFormGroup.markAllAsTouched();
      }
      else if(this.loginFormGroup.controls.UserId.invalid)
      {
        this._commonService.openSnackbar("Enter User Id", snackbarStatus.Danger);
        this.loginFormGroup.controls.UserId.touched;
      }
      else if(this.loginFormGroup.controls.Password.invalid)
      {
        this._commonService.openSnackbar("Enter Password", snackbarStatus.Danger);
        this.loginFormGroup.controls.Password.touched;
      }
    }
  }


}
