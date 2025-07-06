import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoInventarioComponent } from './listado-inventario/listado-inventario.component';
import { MenuComponent } from '../menu/menu.component';
import { RegistrarComprasInventarioComponent } from './registrar-compras-inventario/registrar-compras-inventario.component';
import { EdicionComponent } from './edicion/edicion.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {path: 'listado-inventario', component: ListadoInventarioComponent},
      {path: 'registrar-compra', component: RegistrarComprasInventarioComponent},
      {path: 'edicion', component: EdicionComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
