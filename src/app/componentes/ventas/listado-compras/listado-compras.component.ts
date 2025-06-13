import { ListadoVenta } from './../../../interfaces/venta/venta-back';
import { Component, OnInit, ViewChild } from '@angular/core';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InformacionFacturasComponent } from '../informacion-facturas/informacion-facturas.component';
import { MessageService } from 'primeng/api';

interface ProveedorOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-listado-compras',
  templateUrl: './listado-compras.component.html',
  styleUrl: './listado-compras.component.css'
})
export class ListadoComprasComponent implements OnInit {
  facturas: ListadoVenta[] = [];
  facturasOriginal: ListadoVenta[] = [];
  idPropietario: number = 1;
  loading: boolean = false;
  rowsPerPage: number = 10;

  // Filtros
  selectedProveedor: string = '';
  fechaFiltro: Date | null = null;
  proveedorOptions: ProveedorOption[] = [];

  @ViewChild('dt') dt!: Table;

  constructor(
    private _serviciosVenta: VentaServicioService,
    private _dialogservices: DialogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerListado();
  }

  onGlobalFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt.filterGlobal(input.value, 'contains');
  }

  obtenerListado() {
    this.loading = true;
    this._serviciosVenta.obtenerListaCompras().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasOriginal = [...data];
        this.generarOpcionesProveedores();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener listado de compras:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el listado de facturas de compra'
        });
        this.loading = false;
      }
    });
  }

  generarOpcionesProveedores() {
    const proveedoresUnicos = [...new Set(this.facturas.map(f => f.persona))];
    this.proveedorOptions = proveedoresUnicos.map(proveedor => ({
      label: proveedor,
      value: proveedor
    }));
  }

  calcularTotalCompras(): number {
    return this.facturas.reduce((total, factura) => total + factura.valor, 0);
  }

  calcularComprasAltas(): number {
    return this.facturas.filter(f => f.valor > 100000).length;
  }

  filtrarPorProveedor() {
    if (this.selectedProveedor) {
      this.facturas = this.facturasOriginal.filter(f => f.persona === this.selectedProveedor);
    } else {
      this.facturas = [...this.facturasOriginal];
    }
    this.aplicarFiltroFecha();
  }

  filtrarPorFecha() {
    this.aplicarFiltroFecha();
  }

  private aplicarFiltroFecha() {
    if (this.fechaFiltro) {
      const fechaSeleccionada = new Date(this.fechaFiltro);
      this.facturas = this.facturas.filter(f => {
        const fechaFactura = new Date(f.fecha);
        return fechaFactura.toDateString() === fechaSeleccionada.toDateString();
      });
    }
  }

  limpiarFiltros() {
    this.selectedProveedor = '';
    this.fechaFiltro = null;
    this.facturas = [...this.facturasOriginal];
    this.dt.clear();
  }

  obtenerFechaRelativa(fecha: string): string {
    const fechaFactura = new Date(fecha);
    const hoy = new Date();
    const diferenciaDias = Math.floor((hoy.getTime() - fechaFactura.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) return 'Hoy';
    if (diferenciaDias === 1) return 'Ayer';
    if (diferenciaDias < 7) return `Hace ${diferenciaDias} días`;
    if (diferenciaDias < 30) return `Hace ${Math.floor(diferenciaDias / 7)} semanas`;
    return `Hace ${Math.floor(diferenciaDias / 30)} meses`;
  }

  obtenerIniciales(nombre: string): string {
    return nombre.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  verFactura(numFactura: string) {
    const texto = `🧾 Detalle de Factura de Compra N° ${numFactura}`;
    this._dialogservices.open(InformacionFacturasComponent, {
      header: texto,
      width: '70%',
      data: {
        numFactura: numFactura,
        tipo: 2 // Agregar tipo para distinguir en el componente
      }
    });
  }

  descargarFactura(numFactura: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Descarga',
      detail: `Descargando factura de compra ${numFactura}...`
    });

    // Aquí puedes implementar la lógica real de descarga
    // Por ejemplo, llamar a un servicio que genere el PDF
  }

  enviarFactura(numFactura: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Envío',
      detail: `Factura de compra ${numFactura} enviada por email`
    });

    // Aquí puedes implementar la lógica real de envío
    // Por ejemplo, llamar a un servicio que envíe el email
  }

  // Método para exportar datos (opcional)
  exportarDatos() {
    this.messageService.add({
      severity: 'info',
      summary: 'Exportación',
      detail: 'Exportando datos de compras...'
    });
  }

  isCompraAlta(valor: number): boolean {
    return valor > 100000;
  }

  getValorClass(valor: number): any {
    return {
      'valor-bajo': valor <= 50000,
      'valor-medio': valor > 50000 && valor <= 100000,
      'valor-alto': valor > 100000
    };
  }

  // Método para obtener la clase CSS del ícono del valor
  getValorIconClass(valor: number): any {
    return {
      'pi-arrow-down text-green-600': valor <= 50000,
      'pi-minus text-yellow-600': valor > 50000 && valor <= 100000,
      'pi-arrow-up text-red-600': valor > 100000
    };
  }
}