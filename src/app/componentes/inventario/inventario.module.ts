import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListadoInventarioComponent } from './listado-inventario/listado-inventario.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrearEditarProductosComponent } from './crear-editar-productos/crear-editar-productos.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RegistrarComprasInventarioComponent } from './registrar-compras-inventario/registrar-compras-inventario.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InformacionProductoComponent } from './informacion-producto/informacion-producto.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { EditarProductoAuditoriaComponent } from './editar-producto-auditoria/editar-producto-auditoria.component';
import { MatIconModule } from '@angular/material/icon';
import { EdicionComponent } from './edicion/edicion.component';
@NgModule({
  declarations: [
    ListadoInventarioComponent,
    CrearEditarProductosComponent,
    RegistrarComprasInventarioComponent,
    InformacionProductoComponent,
    EditarProductoAuditoriaComponent,
    EdicionComponent
  ],
  imports: [
    CommonModule,
    InventarioRoutingModule,
    TableModule,
    CardModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicDialogModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    AutoCompleteModule,
    InputTextareaModule,
    MatDialogModule,
    MatCardModule,
    MatListModule, 
    MatDividerModule,
    ConfirmDialogModule,
    MatIconModule
  ],
  providers: [
      DialogService,
      MessageService,
      ConfirmationService,
      ConfirmationService
  ]
})
export class InventarioModule { }
