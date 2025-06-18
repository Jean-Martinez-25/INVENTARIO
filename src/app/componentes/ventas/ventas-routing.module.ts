import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarVentasComponent } from './registrar-ventas/registrar-ventas.component';
import { ListadoVentasComponent } from './listado-ventas/listado-ventas.component';
import { FiltroVentasListadoComponent } from './filtro-ventas-listado/filtro-ventas-listado.component';
import { MenuComponent } from '../menu/menu.component';
import { RegistrarServicioComponent } from './registrar-servicio/registrar-servicio.component';
import { ListadoServiciosComponent } from './listado-servicios/listado-servicios.component';
import { AgendaServiciosComponent } from './agenda-servicios/agenda-servicios.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'agregar-venta', component: RegistrarVentasComponent},
      {path: 'agregar-servicio', component: RegistrarServicioComponent},
      {path: 'listado-venta-diario', component: ListadoVentasComponent},
      {path: 'listado-servicios', component: ListadoServiciosComponent},
      {path: 'agenda-servicios', component: AgendaServiciosComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
