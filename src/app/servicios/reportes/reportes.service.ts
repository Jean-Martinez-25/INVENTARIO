import {
  MetodoPagoData,
  ProductoMasVendidoDto,
  ReporteInventario,
  ReporteSemanal,
  ResumenCierreCaja,
  ReporteBack,
  ReporteMensual
} from './../../interfaces/reportes/reporte-back';
import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleCompra, DetalleVenta } from '../../interfaces/detalles/detalle-venta';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private proxyUrl: string = 'https://api.allorigins.win/raw?url=';
  private webApi: string = environment.endpoint;
  private api: string = 'api/Reportes';

  constructor(private http: HttpClient) {}

  private proxiedUrl(endpoint: string): string {
    return `${this.proxyUrl}${encodeURIComponent(`${this.webApi}${endpoint}`)}`;
  }

  obtenerReporte(): Observable<ReporteBack> {
    return this.http.get<ReporteBack>(this.proxiedUrl(`${this.api}/reporte`));
  }

  obtenerReporteMensual(year: number): Observable<ReporteMensual[]> {
    const url = `${this.api}/reporte-meses?year=${year}`;
    return this.http.get<ReporteMensual[]>(this.proxiedUrl(url));
  }

  obtenerReporteSemanal(year: number, mes: number): Observable<ReporteSemanal[]> {
    const url = `${this.api}/reporte-semanal?year=${year}&mes=${mes}`;
    return this.http.get<ReporteSemanal[]>(this.proxiedUrl(url));
  }

  obtenerReporteInventario(idPropietario: number): Observable<ReporteInventario[]> {
    const url = `${this.api}/reporte-inventario?idPropietario=${idPropietario}`;
    return this.http.get<ReporteInventario[]>(this.proxiedUrl(url));
  }

  getMarcas(): Observable<{ id: number, nombre: string }[]> {
    return this.http.get<{ id: number, nombre: string }[]>(this.proxiedUrl('api/Producto/obtener-marca'));
  }

  getProductosMasVendidos(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params = params.set('fechaFin', fechaFin.toISOString());
    if (idMarca) params = params.set('idMarca', idMarca);

    const fullUrl = `${this.webApi}${this.api}/reporte-productos?${params.toString()}`;
    return this.http.get<ProductoMasVendidoDto[]>(`${this.proxyUrl}${encodeURIComponent(fullUrl)}`);
  }

  getProductosMasComprado(idMarca?: number, fechaInicio?: Date, fechaFin?: Date): Observable<ProductoMasVendidoDto[]> {
    let params = new HttpParams();
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio.toISOString());
    if (fechaFin) params = params.set('fechaFin', fechaFin.toISOString());
    if (idMarca) params = params.set('idMarca', idMarca);

    const fullUrl = `${this.webApi}${this.api}/reporte-productos-comprados?${params.toString()}`;
    return this.http.get<ProductoMasVendidoDto[]>(`${this.proxyUrl}${encodeURIComponent(fullUrl)}`);
  }

  obtenerDetallesVenta(): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(this.proxiedUrl(`${this.api}/detalle-ventas`));
  }

  obtenerDetallesCompras(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(this.proxiedUrl(`${this.api}/detalle-compras`));
  }

  obtenerCierreDeCajaDiario(): Observable<ResumenCierreCaja> {
    return this.http.get<ResumenCierreCaja>(this.proxiedUrl(`${this.api}/cierre-de-caja-diario`));
  }

  obtenerEstadosDeCuenta(): Observable<MetodoPagoData[]> {
    return this.http.get<MetodoPagoData[]>(this.proxiedUrl(`${this.api}/estados-de-cuenta`));
  }

  obtenerCierreCaja(idMes: number, year: number): Observable<any> {
    const url = `${this.api}/cierre-caja?mes=${idMes}&year=${year}`;
    return this.http.get<any>(this.proxiedUrl(url));
  }
}
