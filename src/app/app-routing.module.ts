import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes = [
  {
    path: 'inventario',
    loadChildren: () => import('./componentes/inventario/inventario.module').then(m => m.InventarioModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('./componentes/ventas/ventas.module').then(m => m.VentasModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./componentes/reportes/reportes.module').then(m => m.ReportesModule)
  },
  {
    path: 'listado',
    loadChildren: () => import('./componentes/detalles/detalles.module').then(m => m.DetallesModule)
  },
  {
    path: 'persona',
    loadChildren: () => import('./componentes/persona/persona.module').then(m => m.PersonaModule)
  },
  {
    path: '**', redirectTo: 'ventas/agregar-venta'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
