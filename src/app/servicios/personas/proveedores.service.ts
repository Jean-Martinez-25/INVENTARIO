import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clientes, ClientesBack, ProveedoresAdd, ProveedoresDto } from '../../interfaces/personas/proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Proveedores';

  constructor(private http: HttpClient) {}

  // ---------- PROVEEDORES ----------
  listadoProveedores(): Observable<ProveedoresDto[]> {
    return this.http.get<ProveedoresDto[]>(`${this.webApi}${this.api}/listado-proveedores`);
  }

  crearProveedor(proveedor: ProveedoresAdd) {
    return this.http.post(`${this.webApi}${this.api}/crear-proveedor`, proveedor);
  }

  editarProveedor(id: number, proveedor: ProveedoresDto) {
    return this.http.put(`${this.webApi}${this.api}/editar-proveedor/${id}`, proveedor);
  }

  // ---------- CLIENTES ----------
  listadoClientes(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(`${this.webApi}${this.api}/listado-clientes`);
  }

  crearCliente(cliente: ClientesBack) {
    return this.http.post(`${this.webApi}${this.api}/crear-cliente`, cliente);
  }

  editarCliente(id: number, cliente: ClientesBack) {
    return this.http.put(`${this.webApi}${this.api}/editar-cliente/${id}`, cliente);
  }
}
