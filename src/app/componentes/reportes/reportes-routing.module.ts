import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesComponent } from './reportes/reportes.component';
import { MenuComponent } from '../menu/menu.component';
import { ResumenComponent } from './resumen/resumen.component';
import { CierresDeCajaComponent } from './cierres-de-caja/cierres-de-caja.component';
import { EstadosDeCuentaComponent } from './estados-de-cuenta/estados-de-cuenta.component';
import { CierreDeCajaMensualComponent } from './cierre-de-caja-mensual/cierre-de-caja-mensual.component';
import { ListadoDeudasComponent } from './listado-deudas/listado-deudas.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'reportes', component: ReportesComponent},
      {path: 'resumen', component: ResumenComponent},
      {path: 'cierre-de-caja-diario', component: CierresDeCajaComponent},
      {path: 'cierre-de-caja-mensual', component: CierreDeCajaMensualComponent},
      {path: 'estados-de-cuenta', component: EstadosDeCuentaComponent},
      {path: 'deudas-clientes', component: ListadoDeudasComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
