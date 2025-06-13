import { ListadoVenta } from './../../../interfaces/venta/venta-back';
import { Component, OnInit, ViewChild } from '@angular/core';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { Table } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InformacionFacturasComponent } from '../informacion-facturas/informacion-facturas.component';
import { MessageService } from 'primeng/api';

interface ClienteOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  styleUrl: './listado-ventas.component.css'
})
export class ListadoVentasComponent implements OnInit {
  facturas: ListadoVenta[] = [];
  facturasOriginal: ListadoVenta[] = [];
  idPropietario: number = 1;
  loading: boolean = false;
  rowsPerPage: number = 10;

  // Filtros
  selectedCliente: string = '';
  fechaFiltro: Date | null = null;
  clienteOptions: ClienteOption[] = [];

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
    this._serviciosVenta.obtenrListaVentas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasOriginal = [...data];
        this.generarOpcionesClientes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener listado:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el listado de facturas'
        });
        this.loading = false;
      }
    });
  }

  generarOpcionesClientes() {
    const clientesUnicos = [...new Set(this.facturas.map(f => f.persona))];
    this.clienteOptions = clientesUnicos.map(cliente => ({
      label: cliente,
      value: cliente
    }));
  }

  calcularTotalVentas(): number {
    return this.facturas.reduce((total, factura) => total + factura.valor, 0);
  }

  filtrarPorCliente() {
    if (this.selectedCliente) {
      this.facturas = this.facturasOriginal.filter(f => f.persona === this.selectedCliente);
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
    this.selectedCliente = '';
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
    const texto = `🧾 Detalle de Factura N° ${numFactura}`;
    this._dialogservices.open(InformacionFacturasComponent, {
      header: texto,
      width: '70%',
      data: {
        numFactura: numFactura,
        tipo: 1
      }
    });
  }

  descargarFactura(numFactura: string) {
    // Implementar lógica de descarga
    this.messageService.add({
      severity: 'info',
      summary: 'Descarga',
      detail: `Descargando factura ${numFactura}...`
    });

    // Aquí puedes implementar la lógica real de descarga
    // Por ejemplo, llamar a un servicio que genere el PDF
  }

  enviarFactura(numFactura: string) {
    // Implementar lógica de envío por email
    this.messageService.add({
      severity: 'success',
      summary: 'Envío',
      detail: `Factura ${numFactura} enviada por email`
    });

    // Aquí puedes implementar la lógica real de envío
    // Por ejemplo, llamar a un servicio que envíe el email
  }

  // Método para exportar datos (opcional)
  exportarDatos() {
    // Implementar exportación a Excel/CSV
    this.messageService.add({
      severity: 'info',
      summary: 'Exportación',
      detail: 'Exportando datos...'
    });
  }
  calcularVentasAltas(): number {
    return this.facturas.filter(f => f.valor > 100000).length;
  }

  isVentaAlta(valor: number): boolean {
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