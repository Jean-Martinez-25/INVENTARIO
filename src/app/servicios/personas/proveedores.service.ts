import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProveedoresAdd, ProveedoresDto } from '../../interfaces/personas/proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Proveedores';
  private listadoProveedore: string = '/listado-proveedores'

  constructor(private http: HttpClient) { }

  listadoProveedores(): Observable<ProveedoresDto[]> {
    return this.http.get<ProveedoresDto[]>(`${this.webApi}${this.api}${this.listadoProveedore}`);
  }
  crearProveedor(proveedor: ProveedoresAdd) {
    return this.http.post(`${this.webApi}${this.api}`, proveedor);
  }
  editarProveedor(id: number, proveedor: ProveedoresDto) {
    return this.http.put(`${this.webApi}${this.api}/${id}`, proveedor);
  }
}
