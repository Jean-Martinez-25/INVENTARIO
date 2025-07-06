import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient } from '@angular/common/http';
import { ServiciosViewModel } from '../../interfaces/venta/venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosEmpresaService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Services';
  
  constructor(private http: HttpClient) { }

   // Obtener servicios activos
  obtenerServicios(): Observable<ServiciosViewModel[]> {
    return this.http.get<ServiciosViewModel[]>(`${this.webApi}${this.api}/listado-servicios-actuales`);
  }

  // Crear nuevo servicio
  crearServicio(servicio: Omit<ServiciosViewModel, 'id'>): Observable<any> {
    return this.http.post(`${this.webApi}${this.api}/crear`, servicio);
  }

  // Actualizar servicio existente
  actualizarServicio(servicio: ServiciosViewModel): Observable<any> {
    return this.http.put(`${this.webApi}${this.api}/actualizar`, servicio);
  }
}
