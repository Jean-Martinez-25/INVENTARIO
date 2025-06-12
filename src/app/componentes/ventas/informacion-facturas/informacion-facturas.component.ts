import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DetalleFactura } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';

@Component({
  selector: 'app-informacion-facturas',
  templateUrl: './informacion-facturas.component.html',
  styleUrls: ['./informacion-facturas.component.css']
})
export class InformacionFacturasComponent implements OnInit {

  // Datos de la factura
  numFactura: number = 0;
  numeroFactura: string = '';
  fechaFactura: Date = new Date();
  clienteNombre: string = '';
  
  // Productos de la factura
  detallesFactura: DetalleFactura[] = [];

  // Cálculos de la factura
  subtotal: number = 0;
  iva: number = 0;
  totalFactura: number = 0;

  // Estados de carga
  loading: boolean = false;
  error: string | null = null;

  constructor(
    public config: DynamicDialogConfig,
    private _ventaService: VentaServicioService
  ) { }

  ngOnInit(): void {
    // Obtener el número de factura desde la configuración del diálogo
    this.numFactura = this.config.data?.numFactura || 0;
    this.numeroFactura = this.numFactura.toString();
    
    // Obtener datos adicionales si están disponibles
    this.clienteNombre = this.config.data?.clienteNombre || 'Cliente';
    this.fechaFactura = this.config.data?.fechaFactura ? new Date(this.config.data.fechaFactura) : new Date();
    
    // Buscar información de la factura
    if (this.numFactura > 0) {
      this.buscarInformacion(this.numFactura);
    }
  }

  /**
   * Busca la información completa de la factura
   * @param numFactura Número de la factura a buscar
   */
  buscarInformacion(numFactura: number): void {
    this.loading = true;
    this.error = null;
    
    this._ventaService.obtenrInfoVentas(numFactura).subscribe({
      next: (data: DetalleFactura[]) => {
        this.detallesFactura = data;
        this.calcularTotales();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener datos de ventas', err);
        this.error = 'Error al cargar la información de la factura. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  /**
   * Calcula los totales de la factura basado en los datos reales
   */
  private calcularTotales(): void {
    if (this.detallesFactura && this.detallesFactura.length > 0) {
      this.subtotal = this.detallesFactura.reduce((sum, item) => sum + item.total, 0);
      this.iva = this.subtotal * 0.19; // IVA del 19%
      this.totalFactura = this.subtotal + this.iva;
    } else {
      this.subtotal = 0;
      this.iva = 0;
      this.totalFactura = 0;
    }
  }

  /**
   * Recarga los datos de la factura
   */
  recargarDatos(): void {
    if (this.numFactura > 0) {
      this.buscarInformacion(this.numFactura);
    }
  }

  /**
   * Maneja el filtro global de la tabla
   * @param event Evento del input de búsqueda
   */
  onGlobalFilter(event: Event): void {
    const target = event.target as HTMLInputElement;
    const table = document.querySelector('.invoice-table') as any;
    if (table && table.dt) {
      table.dt.filterGlobal(target.value, 'contains');
    }
  }

  /**
   * Aplica filtro global a la tabla
   * @param table Referencia a la tabla
   * @param value Valor a filtrar
   */
  applyFilterGlobal(table: Table, value: string): void {
    table.filterGlobal(value, 'contains');
  }

  /**
   * Exporta la factura a PDF (implementación pendiente)
   */
  exportarPDF(): void {
    // Implementar exportación a PDF
    console.log('Exportando factura a PDF...');
  }

  /**
   * Imprime la factura
   */
  imprimirFactura(): void {
    window.print();
  }

  /**
   * Envía la factura por email (implementación pendiente)
   */
  enviarEmail(): void {
    // Implementar envío por email
    console.log('Enviando factura por email...');
  }

  /**
   * Obtiene el color del badge según la cantidad
   * @param cantidad Cantidad del producto
   * @returns Severidad del badge
   */
  getBadgeSeverity(cantidad: number): string {
    if (cantidad >= 10) return 'success';
    if (cantidad >= 5) return 'warning';
    return 'danger';
  }

  /**
   * Formatea números como moneda colombiana
   * @param value Valor numérico
   * @returns String formateado como moneda
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Obtiene el total de productos únicos
   */
  get totalProductos(): number {
    return this.detallesFactura?.length || 0;
  }

  /**
   * Obtiene la cantidad total de items
   */
  get cantidadTotalItems(): number {
    return this.detallesFactura?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
  }

  /**
   * Verifica si hay datos para mostrar
   */
  get tieneProductos(): boolean {
    return this.detallesFactura && this.detallesFactura.length > 0;
  }

  /**
   * Obtiene estadísticas de la factura
   */
  get estadisticasFactura() {
    if (!this.tieneProductos) {
      return null;
    }

    const productos = this.detallesFactura;
    const productoMasCaro = productos.reduce((prev, current) => 
      (prev.precio > current.precio) ? prev : current
    );
    const productoMasVendido = productos.reduce((prev, current) => 
      (prev.cantidad > current.cantidad) ? prev : current
    );

    return {
      productoMasCaro,
      productoMasVendido,
      promedioPrecios: productos.reduce((sum, item) => sum + item.precio, 0) / productos.length
    };
  }

  /**
   * Maneja errores y muestra mensajes apropiados
   */
  private manejarError(error: any): void {
    console.error('Error en el componente:', error);
    this.error = 'Ha ocurrido un error inesperado. Por favor, contacte al administrador.';
    this.loading = false;
  }
}