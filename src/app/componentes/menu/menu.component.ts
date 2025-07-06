// menu.component.ts
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
      label: 'Dashboard',
      icon: 'dashboard',
      expanded: false,
      subItems: [
        { label: 'Resumen General', route: '/reportes/resumen', icon: 'analytics' },
        { label: 'Estadísticas', route: '/reportes/reportes', icon: 'bar_chart' },
        { label: 'Estados de Cuenta', route: '/reportes/estados-de-cuenta', icon: 'account_balance' }
      ]
    },
    {
      label: 'Ventas',
      icon: 'point_of_sale',
      expanded: false,
      subItems: [
        { label: 'Nueva Venta', route: '/ventas/agregar-venta', icon: 'add_shopping_cart' },
        { label: 'Facturas', route: '/ventas/listado-venta-diario', icon: 'receipt_long' },
        { label: 'Historial de Ventas', route: '/listado/listado-ventas', icon: 'history' }
      ]
    },
    {
      label: 'Servicios',
      icon: 'build',
      expanded: false,
      subItems: [
        { label: 'Nuevo Servicio', route: '/ventas/agregar-servicio', icon: 'add_task' },
        { label: 'Servicios Activos', route: '/ventas/listado-servicios-actuales', icon: 'engineering' },
        { label: 'Historial Servicios', route: '/ventas/listado-servicios', icon: 'assignment' },
        { label: 'Agenda', route: '/ventas/agenda-servicios', icon: 'schedule' }
      ]
    },
    {
      label: 'Inventario',
      icon: 'inventory_2',
      expanded: false,
      subItems: [
        { label: 'Productos', route: '/inventario/listado-inventario', icon: 'category' },
        { label: 'Nueva Compra', route: '/inventario/registrar-compra', icon: 'add_box' },
        { label: 'Tablas Maestras', route: '/inventario/edicion', icon: 'edit' },
        { label: 'Historial Compras', route: '/listado/listado-compras', icon: 'shopping_cart' }
      ]
    },
    {
      label: 'Finanzas',
      icon: 'account_balance_wallet',
      expanded: false,
      subItems: [
        { label: 'Gestión de Deudas', route: '/reportes/deudas-clientes', icon: 'account_balance' },
        { label: 'Cierre de Caja', route: '/reportes/cierre-de-caja-diario', icon: 'point_of_sale' },
        { label: 'Cierre Mensual', route: '/reportes/cierre-de-caja-mensual', icon: 'calendar_month' }
      ]
    },
    {
      label: 'Clientes y Proveedores',
      icon: 'people',
      expanded: false,
      subItems: [
        { label: 'Clientes', route: '/persona/clientes', icon: 'person' },
        { label: 'Proveedores', route: '/persona/proveedores', icon: 'business' }
      ]
    },
    {
      label: 'Configuración',
      icon: 'settings',
      expanded: false,
      subItems: [
        { label: 'Perfil', route: '/configuracion/perfil', icon: 'account_circle' },
        { label: 'Seguridad', route: '/configuracion/seguridad', icon: 'security' }
      ]
    }
  ];

  toggleSection(item: any) {
    // Cerrar todas las otras secciones
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item) {
        menuItem.expanded = false;
      }
    });
    // Toggle la sección seleccionada
    item.expanded = !item.expanded;
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  cerrarSesion() {
    console.log('Sesión cerrada');
  }
}