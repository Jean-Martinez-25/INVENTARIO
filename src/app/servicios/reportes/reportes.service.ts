import {
  MetodoPagoData,
  ProductoMasVendidoDto,
  ReporteInventario,
  ReporteSemanal,
  ResumenCierreCaja,
  ReporteBack,
  ReporteMensual,
  ResumenGeneralDTO
} from './../../interfaces/reportes/reporte-back';
import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleCompra, DetalleVenta } from '../../interfaces/detalles/detalle-venta';
import { PagoDeuda } from '../../interfaces/venta/deudas';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Reportes';

  constructor(private http: HttpClient) {}

  obtenerReporte(): Observable<ReporteBack> {
    return this.http.get<ReporteBack>(`${this.webApi}${this.api}/reporte`);
  }

  obtenerReporteMensual(year: number): Observable<ReporteMensual[]> {
    return this.http.get<ReporteMensual[]>(`${this.webApi}${this.api}/reporte-meses?year=${year}`);
  }

  obtenerReporteSemanal(year: number, mes: number): Observable<ReporteSemanal[]> {
    return this.http.get<ReporteSemanal[]>(`${this.webApi}${this.api}/reporte-semanal?year=${year}&mes=${mes}`);
  }

  obtenerReporteInventario(idPropietario: number): Observable<ReporteInventario[]> {
    return this.http.get<ReporteInventario[]>(`${this.webApi}${this.api}/reporte-inventario?idPropietario=${idPropietario}`);
  }

  getMarcas(): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(`${this.webApi}api/Producto/obtener-marca`);
  }

  getProductosMasVendidos(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params = params.set('fechaFin', fechaFin.toISOString());
    if (idMarca) params = params.set('idMarca', idMarca);

    return this.http.get<ProductoMasVendidoDto[]>(`${this.webApi}${this.api}/reporte-productos`, { params });
  }

  getProductosMasComprado(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params = params.set('fechaFin', fechaFin.toISOString());
    if (idMarca) params = params.set('idMarca', idMarca);

    return this.http.get<ProductoMasVendidoDto[]>(`${this.webApi}${this.api}/reporte-productos-comprados`, { params });
  }

  obtenerDetallesVenta(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.webApi}${this.api}/detalle-ventas`);
  }

  obtenerDetallesCompras(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(`${this.webApi}${this.api}/detalle-compras`);
  }

  obtenerCierreDeCajaDiario(): Observable<ResumenCierreCaja> {
    return this.http.get<ResumenCierreCaja>(`${this.webApi}${this.api}/cierre-de-caja-diario`);
  }

  obtenerEstadosDeCuenta(): Observable<MetodoPagoData[]> {
    return this.http.get<MetodoPagoData[]>(`${this.webApi}${this.api}/estados-de-cuenta`);
  }

  obtenerTotalesDeCuenta(): Observable<ResumenGeneralDTO> {
    return this.http.get<ResumenGeneralDTO>(`${this.webApi}${this.api}/total-compras-ventas`);
  }

  obtenerCierreCaja(idMes: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.webApi}${this.api}/cierre-caja?mes=${idMes}&year=${year}`);
  }

  getDeudas(): Observable<any> {
    return this.http.get<any>(`${this.webApi}${this.api}/listado-clientes-deudas`);
  }
   registrarPago(pago: PagoDeuda): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.webApi}${this.api}/registrar-pago`, pago);
  }
}
