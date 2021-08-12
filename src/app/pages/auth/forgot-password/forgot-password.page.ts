import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage implements OnInit {
  resetForm: FormGroup;
  validationMessages = [
    { type: 'required', message: 'This field is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ];

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private appService: AppService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Request new password');
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  reset() {
    console.log('isOnline: ', this.appService.isOnline);
    if (this.appService.checkOnline()) {
      let email = this.resetForm.get('email').value;
      this.authService.sendAuthLink(email).subscribe(
        res => {
          console.log('create account res: ', res);
          this.navCtrl.navigateForward('/forgot-success');
        },
        err => {
          console.log('create account error: ', err);
        }
      );
    }
  }

  /**
   * Check if certain field has errors
   *
   * @param {string} controlName
   * @param {any} validation
   * @return {boolean}
   */
  formControlHasError(controlName: string, validation: any): boolean {
    const formControl = this.resetForm.get(controlName);
    return formControl.hasError(validation.type) && (formControl.dirty || formControl.touched);
  }
}
