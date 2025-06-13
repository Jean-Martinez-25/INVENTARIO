import { ReportesService } from './../../../servicios/reportes/reportes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleVenta } from '../../../interfaces/detalles/detalle-venta';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrl: './listado-ventas.component.css'
})
export class ListadoVentasComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  datos: DetalleVenta[] = [];
  inventarioFiltrado: DetalleVenta[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  
  constructor(private reporteService: ReportesService) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  /**
   * Obtiene los datos de ventas del servicio
   */
  obtenerVentas(): void {
    this.loading = true;
    this.reporteService.obtenerDetallesVenta().subscribe({
      next: (data: DetalleVenta[]) => {
        this.datos = data;
        this.filtrarInventario();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener las ventas:', error);
        this.loading = false;
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  /**
   * Filtra el inventario basado en el término de búsqueda
   */
  filtrarInventario(): void {
    const termino = this.searchTerm.toLowerCase().trim();
    
    if (!termino) {
      this.inventarioFiltrado = [...this.datos];
      return;
    }

    this.inventarioFiltrado = this.datos.filter(item =>
      item?.codigo?.toLowerCase().includes(termino) ||
      item?.producto?.toLowerCase().includes(termino) ||
      item?.marca?.toLowerCase().includes(termino) ||
      item?.cliente?.toLowerCase().includes(termino) ||
      item?.numFactura?.toString().toLowerCase().includes(termino)
    );
  }

  /**
   * Limpia la búsqueda y restablece los datos
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filtrarInventario();
    
    // Resetea la tabla si existe
    if (this.table) {
      this.table.clear();
    }
  }

  /**
   * Calcula el total de todas las ventas
   */
  getTotalVentas(): number {
    return this.inventarioFiltrado.reduce((total, item) => {
      return total + (item.totalVenta || 0);
    }, 0);
  }

  /**
   * Obtiene el número total de productos únicos
   */
  getTotalProductos(): number {
    const productosUnicos = new Set(
      this.inventarioFiltrado.map(item => item.producto)
    );
    return productosUnicos.size;
  }

  /**
   * Obtiene las marcas únicas
   */
  getMarcasUnicas(): string[] {
    const marcas = new Set(
      this.datos
        .map(item => item.marca)
        .filter(marca => marca && marca.trim() !== '')
    );
    return Array.from(marcas).sort();
  }

  /**
   * Obtiene los clientes únicos
   */
  getClientesUnicos(): string[] {
    const clientes = new Set(
      this.datos
        .map(item => item.cliente)
        .filter(cliente => cliente && cliente.trim() !== '')
    );
    return Array.from(clientes).sort();
  }

  /**
   * Exporta los datos filtrados (funcionalidad básica)
   */
  exportarDatos(): void {
    // Implementar lógica de exportación
    console.log('Exportando datos...', this.inventarioFiltrado);
    
    // Ejemplo básico de exportación a CSV
    const headers = ['ID', 'N° Factura', 'Producto', 'Cantidad', 'Total Venta', 'Marca', 'Cliente'];
    const csvContent = [
      headers.join(','),
      ...this.inventarioFiltrado.map(item => [
        item.codigo,
        item.numFactura,
        `"${item.producto}"`, // Comillas para productos con comas
        item.cantidad,
        item.totalVenta,
        `"${item.marca}"`,
        `"${item.cliente}"`
      ].join(','))
    ].join('\n');

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `detalle-ventas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Refresca los datos
   */
  refrescarDatos(): void {
    this.obtenerVentas();
  }

  /**
   * Formatea un número como moneda colombiana
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  /**
   * Obtiene el color para la cantidad basado en el valor
   */
  getColorCantidad(cantidad: number): string {
    if (cantidad >= 10) return 'success';
    if (cantidad >= 5) return 'warning';
    return 'danger';
  }

  /**
   * Maneja errores de carga de datos
   */
}