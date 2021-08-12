import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ComponentModule } from '../../components/component.module';

import { ForgotPasswordPage } from './forgot-password/forgot-password.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { TermsAndConditionPage } from './terms-and-condition/terms-and-condition.page';
import { CreateSuccessPage } from './create-success/create-success.page';
import { ForgotSuccessPage } from './forgot-success/forgot-success.page';

const routes: Routes = [
  { path: 'forgot-password', component: ForgotPasswordPage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'terms', component: TermsAndConditionPage },
  { path: 'create-success', component: CreateSuccessPage },
  { path: 'forgot-success', component: ForgotSuccessPage }
];

@NgModule({
  declarations: [
    ForgotPasswordPage,
    LoginPage,
    RegisterPage,
    TermsAndConditionPage,
    CreateSuccessPage,
    ForgotSuccessPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ComponentModule
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
