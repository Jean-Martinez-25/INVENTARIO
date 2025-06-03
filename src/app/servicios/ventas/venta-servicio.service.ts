import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CompraRequest,
  DatosVenta,
  DetalleFactura,
  ListadoCompra,
  ListadoFacturasPorMes,
  ListadoVenta
} from '../../interfaces/venta/venta-back';

@Injectable({
  providedIn: 'root'
})
export class VentaServicioService {
  // Proxy para solicitudes GET
  private proxyUrl: string = 'https://api.allorigins.win/raw?url=';

  private webApi: string = environment.endpoint;
  private api: string = 'api/Venta';
  private datosCliente: string = '/formulario-venta';
  private listadoVenta: string = '/listado-ventas';
  private infoVenta: string = '/info-ventas';
  private infoCompra: string = '/info-compras';
  private listadoCompra: string = '/listado-compras';
  private listadoCompraMes: string = "/listado-compras-por-mes";
  private listadoVentaMes: string = "/listado-ventas-por-mes";

  constructor(private http: HttpClient) { }

  private getProxiedUrl(endpoint: string): string {
    const fullUrl = `${this.webApi}${endpoint}`;
    return `${this.proxyUrl}${encodeURIComponent(fullUrl)}`;
  }

  private getProxiedUrlWithParams(endpoint: string, params: string): string {
    const fullUrl = `${this.webApi}${endpoint}?${params}`;
    return `${this.proxyUrl}${encodeURIComponent(fullUrl)}`;
  }

  private makeGetRequestWithParams<T>(endpoint: string, params: HttpParams): Observable<T> {
    const baseUrl = `${this.webApi}${endpoint}`;
    const fullUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    const proxiedUrl = `${this.proxyUrl}${encodeURIComponent(fullUrl)}`;
    return this.http.get<T>(proxiedUrl);
  }

  // POST sin proxy (no compatible con AllOrigins)
  registrarVenta(compra: CompraRequest): Observable<any> {
    const url = `${this.webApi}${this.api}`;
    return this.http.post(url, compra);
  }

  obtenerDatos(): Observable<DatosVenta> {
    return this.http.get<DatosVenta>(this.getProxiedUrl(`${this.api}${this.datosCliente}`));
  }

  obtenrListaVentas(): Observable<ListadoVenta[]> {
    return this.http.get<ListadoVenta[]>(this.getProxiedUrl(`${this.api}${this.listadoVenta}`));
  }

  obtenrInfoVentas(numFactura: number): Observable<DetalleFactura[]> {
    const params = `numFactura=${numFactura}`;
    return this.http.get<DetalleFactura[]>(this.getProxiedUrlWithParams(`${this.api}${this.infoVenta}`, params));
  }

  obtenerListaCompras(): Observable<ListadoCompra[]> {
    return this.http.get<ListadoCompra[]>(this.getProxiedUrl(`${this.api}${this.listadoCompra}`));
  }

  obtenrInfoCompras(numFactura: number): Observable<DetalleFactura[]> {
    const params = `numFactura=${numFactura}`;
    return this.http.get<DetalleFactura[]>(this.getProxiedUrlWithParams(`${this.api}${this.infoCompra}`, params));
  }

  listadoComprasMes(year: number, mes: number): Observable<ListadoFacturasPorMes[]> {
    let params = new HttpParams().set('year', year).set('mes', mes);
    return this.makeGetRequestWithParams<ListadoFacturasPorMes[]>(`${this.api}${this.listadoCompraMes}`, params);
  }

  listadoVentasMes(year: number, mes: number): Observable<ListadoFacturasPorMes[]> {
    let params = new HttpParams().set('year', year).set('mes', mes);
    return this.makeGetRequestWithParams<ListadoFacturasPorMes[]>(`${this.api}${this.listadoVentaMes}`, params);
  }
}
