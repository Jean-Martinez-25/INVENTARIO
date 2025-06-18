import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CompraRequest,
  CrearServicioPrestadoDto,
  DatosServicio,
  DatosVenta,
  DetalleFactura,
  ListadoCompra,
  ListadoFacturasPorMes,
  ListadoVenta,
  ServiciosActuales,
  ServiciosActualizar,
  ServiciosAgenda
} from '../../interfaces/venta/venta-back';

@Injectable({
  providedIn: 'root'
})
export class VentaServicioService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Venta';
  private crearServicio: string = '/crear-servicio'
  private listadoServicio: string = '/listado-servicios'
  private datosCliente: string = '/formulario-venta';
  private datosServicios: string = '/formulario-servicio';
  private listadoVenta: string = '/listado-ventas';
  private infoVenta: string = '/info-ventas';
  private infoCompra: string = '/info-compras';
  private listadoCompra: string = '/listado-compras';
  private listadoCompraMes: string = "/listado-compras-por-mes";
  private listadoVentaMes: string = "/listado-ventas-por-mes";
  private disponibilidad: string = "/verificar-disponibilidad"
  constructor(private http: HttpClient) { }

  // POST
  registrarVenta(compra: CompraRequest): Observable<any> {
    const url = `${this.webApi}${this.api}`;
    return this.http.post(url, compra);
  }

  obtenerDatos(): Observable<DatosVenta> {
    return this.http.get<DatosVenta>(`${this.webApi}${this.api}${this.datosCliente}`);
  }

  obtenerDatosServicios(): Observable<DatosServicio> {
    return this.http.get<DatosServicio>(`${this.webApi}${this.api}${this.datosServicios}`);
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
  // Ejemplo de método en tu servicio (esto iría en tu servicio)
  verificarDisponibilidad(empleadoId: number, fechaHora: Date): Observable<{ disponible: boolean, mensaje: string }> {
    // Convertir la fecha a formato para comparación
    const horaSeleccionada = fechaHora.getHours() * 60 + fechaHora.getMinutes(); // minutos desde medianoche
    const fechaSeleccionada = new Date(fechaHora);
    fechaSeleccionada.setHours(0, 0, 0, 0); // solo la fecha sin hora

    // Hacer la petición HTTP a tu backend
    return this.http.post<{ disponible: boolean, mensaje: string }>(`${this.webApi}${this.api}${this.disponibilidad}`, {
      empleadoId: empleadoId,
      fecha: fechaSeleccionada.toISOString().split('T')[0], // formato YYYY-MM-DD
      hora: fechaHora.toTimeString().split(' ')[0] // formato HH:MM:SS
    });
  }
  crearServicioPrestado(dto: CrearServicioPrestadoDto) {
    return this.http.post<{ mensaje: string }>(`${this.webApi}${this.api}${this.crearServicio}`, dto);
  }
  listadoServicios(): Observable<ServiciosActuales[]> {
    return this.http.get<ServiciosActuales[]>(`${this.webApi}${this.api}${this.listadoServicio}`)
  }
  listadoServiciosAgenda(): Observable<ServiciosAgenda[]> {
    return this.http.get<ServiciosAgenda[]>(`${this.webApi}${this.api}${this.listadoServicio}`)
  }
  actualizarServicio(servicio: ServiciosActualizar): Observable<any> {
    return this.http.put(`${this.webApi}${this.api}/${servicio.id}`, servicio,)
  }
}
