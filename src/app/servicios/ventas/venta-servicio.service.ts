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

  // POST
  registrarVenta(compra: CompraRequest): Observable<any> {
    const url = `${this.webApi}${this.api}`;
    return this.http.post(url, compra);
  }

  obtenerDatos(): Observable<DatosVenta> {
    return this.http.get<DatosVenta>(`${this.webApi}${this.api}${this.datosCliente}`);
  }

  obtenrListaVentas(): Observable<ListadoVenta[]> {
    return this.http.get<ListadoVenta[]>(`${this.webApi}${this.api}${this.listadoVenta}`);
  }

  obtenrInfoVentas(numFactura: number): Observable<DetalleFactura[]> {
    const params = new HttpParams().set('numFactura', numFactura);
    return this.http.get<DetalleFactura[]>(`${this.webApi}${this.api}${this.infoVenta}`, { params });
  }

  obtenerListaCompras(): Observable<ListadoCompra[]> {
    return this.http.get<ListadoCompra[]>(`${this.webApi}${this.api}${this.listadoCompra}`);
  }

  obtenrInfoCompras(numFactura: number): Observable<DetalleFactura[]> {
    const params = new HttpParams().set('numFactura', numFactura);
    return this.http.get<DetalleFactura[]>(`${this.webApi}${this.api}${this.infoCompra}`, { params });
  }

  listadoComprasMes(year: number, mes: number): Observable<ListadoFacturasPorMes[]> {
    const params = new HttpParams().set('year', year).set('mes', mes);
    return this.http.get<ListadoFacturasPorMes[]>(`${this.webApi}${this.api}${this.listadoCompraMes}`, { params });
  }

  listadoVentasMes(year: number, mes: number): Observable<ListadoFacturasPorMes[]> {
    const params = new HttpParams().set('year', year).set('mes', mes);
    return this.http.get<ListadoFacturasPorMes[]>(`${this.webApi}${this.api}${this.listadoVentaMes}`, { params });
  }
}
