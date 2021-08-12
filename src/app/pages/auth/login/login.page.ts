import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import { ValidateService } from '../../../services/validate.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  validationMessages = [
    { type: 'required', message: 'This field is required' },
    { type: 'email', message: 'Please enter a valid email' }
  ];
  remember: boolean = false;

  constructor(
    private titleService: Title,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    private storageService: StorageService,
    private validateService: ValidateService,
    private data: DataService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Sign In');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.appService.checkOnline()) {
      this.appService.presentLoadingWithOptions('Please Wait...', 'Checking your credentials...');
      let credentials = { ...this.loginForm.value, todo: 'signin' };
      this.authService.login(credentials).subscribe(
        res => {
          console.log('login res: ', res);
          this.checkResponse(credentials, res);
        },
        err => {
          console.log('login error: ', err);
          this.appService.dismissLoader();
          this.data.errorObject = this.validateService.parseErrorContent(err['error'], err['status']);
          this.navCtrl.navigateBack('error');
        }
      );
    }
  }

  formControlHasError(controlName: string, validation: any): boolean {
    const formControl = this.loginForm.get(controlName);
    return formControl.hasError(validation.type) && (formControl.dirty || formControl.touched);
  }

  async checkResponse(credentials: any, response: any) {
    if (response && response['status'] == 200) {
      const rules = [
        {
          key: 'api_key',
          type: 'string',
          required: true
        },
        {
          key: 'access_key',
          type: 'string',
          required: true
        }
      ];
      let validate = this.validateService.validateResponse(response, rules);
      if (validate.status == true) {
        this.storageService.set('loginData', JSON.stringify(credentials));
        this.storageService.set('sessionData', JSON.stringify(response.data));
        this.storageService.set('authenticated', true);
        this.authService.authState.next(true);
      } else {
        this.appService.dismissLoader();
      }
    } else {
      this.appService.dismissLoader();
    }
  }

  forgot() {
    this.navCtrl.navigateForward('/forgot-password');
  }

  register() {
    this.navCtrl.navigateForward('/register');
  }
}
