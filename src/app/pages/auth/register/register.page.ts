import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  regForm: FormGroup;
  validationMessages = [
    { type: 'required', message: 'This field is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ];

  constructor(
    private titleService: Title,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Create Account');
    this.regForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  register() {
    console.log('isOnline: ', this.appService.isOnline);
    if (this.appService.checkOnline()) {
      this.authService.createAccount(this.regForm.value).subscribe(
        res => {
          console.log('create account res: ', res);
          this.navCtrl.navigateForward('/create-success');
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
    const formControl = this.regForm.get(controlName);
    return formControl.hasError(validation.type) && (formControl.dirty || formControl.touched);
  }

  openTerms() {
    this.navCtrl.navigateBack('/terms');
  }
}
