import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceEntryCreationComponent } from './price-entry-creation/price-entry-creation.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatSortModule} from '@angular/material/sort';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MAT_DATE_LOCALE, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthGuard } from '../Guards/auth.guard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TrackingDialogComponent } from './tracking-dialog/tracking-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes :Routes = [
  {
    path : 'price-entry',
    component : PriceEntryCreationComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'dashboard',
    component : DashboardComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'tracking-dialog',
    component : TrackingDialogComponent
  },
]

@NgModule({
  declarations: [
    PriceEntryCreationComponent,
    DashboardComponent,
    TrackingDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSortModule,
    MatOptionModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers : [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class PricePagesModule { }
