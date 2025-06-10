import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasRoutingModule } from './ventas-routing.module';
import { FiltroVentasListadoComponent } from './filtro-ventas-listado/filtro-ventas-listado.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { RegistrarVentasComponent } from './registrar-ventas/registrar-ventas.component';
import { SharedModule } from '../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

// Angular Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// PrimeNG Modules
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';

// Material Modules
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Services
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

// Components
import { InformacionFacturasComponent } from './informacion-facturas/informacion-facturas.component';
import { ListadoComprasComponent } from './listado-compras/listado-compras.component';

@NgModule({
  declarations: [
    FiltroVentasListadoComponent,
    ListadoVentasComponent,
    RegistrarVentasComponent,
    InformacionFacturasComponent,
    ListadoComprasComponent
  ],
  imports: [
    // Angular Core
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    // Routing
    VentasRoutingModule,
    
    // Shared
    SharedModule,
    
    // Material Modules
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    
    // PrimeNG Modules
    DropdownModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    CardModule,
    DynamicDialogModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    AutoCompleteModule,
    CheckboxModule,
    CalendarModule,
    TooltipModule
  ],
  providers: [
    DialogService,
    MessageService
  ]
})
export class VentasModule {}