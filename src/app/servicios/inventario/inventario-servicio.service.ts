import { Injectable } from '@angular/core';
import { environment } from '../../envrioment/envrioment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FormProducto,
  InformacionProducto,
  Inventario,
  MovimientoInventarioRequest,
  ProductoAdd,
  ProductoViewModel,
  SimpleViewModel
} from '../../interfaces/inventario/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioServicioService {
  private webApi: string = environment.endpoint;
  private api: string = 'api/Inventario/';
  private apiProducto: string = 'api/Producto/';
  private apiMov: string = 'api/MovimientoInventario/';
  private listadoProductos: string = 'listado-productos-compra';
  private listadoProveedores: string = 'listado-proveedores';
  private informacionProductos: string = 'informacion-producto';
  private datosProducto: string = 'datos-producto';
  private select: string = 'select-form';
  private agregarProducto: string = 'Agregar-Producto';
  private listadoInventario: string = 'listado-inventario';
  private metodosPago: string = 'metodos-pago-compras';

  constructor(private http: HttpClient) { }

  enviarMovimientoInventario(payload: MovimientoInventarioRequest): Observable<any> {
    return this.http.post<any>(`${this.webApi}${this.apiMov}`, payload);
  }

  crearProducto(productoAdd: ProductoAdd): Observable<any> {
    return this.http.post<any>(
      `${this.webApi}${this.apiProducto}${this.agregarProducto}`,
      productoAdd
    );
  }

  editarProductoConAuditoria(idProducto: number, producto: any, cambios: any[]) {
    return this.http.put(`${this.webApi}${this.apiProducto}${idProducto}`, {
      producto,
      auditorias: cambios
    });
  }

  obtenerListadoInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.webApi}${this.api}${this.listadoInventario}`);
  }

  obtenerMetodosPago(): Observable<SimpleViewModel[]> {
    return this.http.get<SimpleViewModel[]>(`${this.webApi}${this.api}${this.metodosPago}`);
  }

  obtenerFormulario(): Observable<FormProducto> {
    return this.http.get<FormProducto>(`${this.webApi}${this.apiProducto}${this.select}`);
  }

  obtenerProductos(): Observable<ProductoViewModel[]> {
    return this.http.get<ProductoViewModel[]>(`${this.webApi}${this.api}${this.listadoProductos}`);
  }

  obtenerProveedores(): Observable<SimpleViewModel[]> {
    return this.http.get<SimpleViewModel[]>(`${this.webApi}${this.api}${this.listadoProveedores}`);
  }

  informacionProducto(idProducto: number): Observable<InformacionProducto> {
    const endpoint = `${this.webApi}${this.apiProducto}${this.informacionProductos}`;
    return this.http.get<InformacionProducto>(`${endpoint}?idProducto=${idProducto}`);
  }

  datosProductoEditar(idPropietario: number, idProducto: number): Observable<ProductoAdd> {
    const endpoint = `${this.webApi}${this.apiProducto}${this.datosProducto}`;
    return this.http.get<ProductoAdd>(`${endpoint}?idPropietario=${idPropietario}&idProducto=${idProducto}`);
  }
}
