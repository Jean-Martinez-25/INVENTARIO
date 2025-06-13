import { Component, OnInit, ViewChild } from '@angular/core';
import { DetalleCompra } from '../../../interfaces/detalles/detalle-venta';
import { Table } from 'primeng/table';
import { ReportesService } from '../../../servicios/reportes/reportes.service';

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  datos!: DetalleCompra[];
  inventarioFiltrado: DetalleCompra[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private reporteService: ReportesService) {
  }

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas() {
    this.reporteService.obtenerDetallesCompras().subscribe({
      next: data => {
        this.datos = data
        this.filtrarInventario();
        this.loading = false;
      }
    })
  }
  filtrarInventario() {
    const termino = this.searchTerm.toLowerCase();

    this.inventarioFiltrado = this.datos.filter(item =>
      item?.codigo?.toLowerCase().includes(termino) ||
      item?.producto?.toLowerCase().includes(termino) ||
      item?.marca?.toLowerCase().includes(termino) ||
      item?.proveedor?.toLowerCase().includes(termino) ||
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
      return total + (item.totalCompra || 0);
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
    const pro = new Set(
      this.datos
        .map(item => item.proveedor)
        .filter(pro => pro && pro.trim() !== '')
    );
    return Array.from(pro).sort();
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
        item.totalCompra,
        `"${item.marca}"`,
        `"${item.proveedor}"`
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
}
