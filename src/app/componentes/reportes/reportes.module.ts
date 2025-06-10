import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes/reportes.component';
//Prime ng
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ResumenComponent } from './resumen/resumen.component';
import { MatCardModule } from '@angular/material/card';
import { TableModule } from 'primeng/table';
import { ResumenProductosComponent } from './resumen-productos/resumen-productos.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CierresDeCajaComponent } from './cierres-de-caja/cierres-de-caja.component';
import { ProductosMasCompradosComponent } from "./productos-mas-comprados/productos-mas-comprados.component";
import { EstadosDeCuentaComponent } from './estados-de-cuenta/estados-de-cuenta.component';
import { MeterGroupModule } from 'primeng/metergroup';
import { ButtonModule } from 'primeng/button';
import { CierreDeCajaMensualComponent } from './cierre-de-caja-mensual/cierre-de-caja-mensual.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import { CalendarModule } from 'primeng/calendar';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoComprasComponent } from './listado-compras/listado-compras.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { ListadoDeudasComponent } from './listado-deudas/listado-deudas.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TagModule } from 'primeng/tag';
import { PagoDeudasComponent } from './pago-deudas/pago-deudas.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@NgModule({
  declarations: [
    ReportesComponent,
    ResumenComponent,
    ResumenProductosComponent,
    CierresDeCajaComponent,
    ProductosMasCompradosComponent,
    EstadosDeCuentaComponent,
    CierreDeCajaMensualComponent,
    ListadoComprasComponent,
    ListadoVentasComponent,
    ListadoDeudasComponent,
    PagoDeudasComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ChartModule,
    CardModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    TableModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MeterGroupModule,
    ButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatTableModule,
    CalendarModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    TagModule,
    MatDialogModule,
    CommonModule,
    ToastModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    DialogService,
    MessageService
  ]
})
export class ReportesModule { }
