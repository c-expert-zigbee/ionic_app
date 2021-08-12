import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipesModule } from 'src/app/pipes/pipes.module';

import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { CategoriesComponent } from './categories/categories.component';
import { ListCardComponent } from './list-card/list-card.component';
import { ListFormComponent } from './list-form/list-form.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, PipesModule],
  declarations: [AuthHeaderComponent, MainToolbarComponent, CategoriesComponent, ListCardComponent, ListFormComponent],
  exports: [AuthHeaderComponent, MainToolbarComponent, CategoriesComponent, ListCardComponent, ListFormComponent]
})
export class ComponentModule {}
