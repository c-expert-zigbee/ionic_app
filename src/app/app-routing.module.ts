import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-ads',
    loadChildren: () => import('./pages/my-ads/my-ads.module').then(m => m.MyAdsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'post-ad',
    loadChildren: () => import('./pages/post-ad/post-ad.module').then(m => m.PostAdPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-ad',
    loadChildren: () => import('./pages/profile-ad/profile-ad.module').then(m => m.ProfileAdPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
