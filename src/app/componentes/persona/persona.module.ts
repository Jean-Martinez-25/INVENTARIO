import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonaRoutingModule } from './persona-routing.module';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ProveedoresComponent
  ],
  imports: [
    CommonModule,
    PersonaRoutingModule,
    MatCardModule,
    CardModule,
    TableModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    ButtonModule,
    MatIconModule
  ],
  providers: [
    DialogService,
    MessageService
  ]
})
export class PersonaModule { }
