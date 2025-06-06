import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isCollapsed = false;

  menuItems = [
    {
      label: 'Inicio',
      icon: 'home',
      expanded: false,
      subItems: [
        { label: 'Resumen', route: '/reportes/resumen' },
        { label: 'Estadísticas', route: '/reportes/reportes' },
        { label: 'Cierre de Caja', route: '/reportes/cierre-de-caja-diario' },
        { label: 'Cierre de Caja Mensual', route: '/reportes/cierre-de-caja-mensual' },
        { label: 'Estados de cuenta', route: '/reportes/estados-de-cuenta'}
      ]
    },
    {
      label: 'Configuración',
      icon: 'settings',
      expanded: false,
      subItems: [
        { label: 'Perfil', route: '/configuracion/perfil' },
        { label: 'Seguridad', route: '/configuracion/seguridad' }
      ]
    },
    {
      label: 'Ventas',
      icon: 'attach_money',
      expanded: false,
      subItems: [
        { label: 'Facturas', route: '/ventas/listado-venta-diario' },
        { label: 'Registrar', route: '/ventas/agregar-venta' }
      ]
    },
    {
      label: 'Inventario',
      icon: 'inventory',
      expanded: false,
      subItems: [
        { label: 'Productos', route: '/inventario/listado-inventario' },
        { label: 'Compras', route: '/inventario/registrar-compra' }
      ]
    },
    {
      label: 'Gestión',
      icon: 'supervisor_account',
      expanded: false,
      subItems: [
        {label: 'Proveedores', route: '/persona/proveedores'},
        { label: 'Detalles compras', route: '/listado/listado-compras' },
        { label: 'Detalles ventas', route: '/listado/listado-ventas' }
      ]
    }
  ];


  toggleSection(item: any) {
    item.expanded = !item.expanded;
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion() {
    console.log('Sesión cerrada');

  }
}
