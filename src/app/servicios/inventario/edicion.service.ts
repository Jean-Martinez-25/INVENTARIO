// src/app/servicios/edicion.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../envrioment/envrioment';

export interface TableItem {
  id: number;
  nombre: string;
  documento?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EdicionService {

  private webApi: string = environment.endpoint;
  private api: string = 'api/Edicion';
  private baseUrl = `${this.webApi}${this.api}`

  constructor(private http: HttpClient) {}

  // ------- SECCIONES -------
  getSecciones(): Observable<TableItem[]> {
    return this.http.get<TableItem[]>(`${this.baseUrl}/secciones`);
  }

  addSeccion(item: TableItem): Observable<TableItem> {
    return this.http.post<TableItem>(`${this.baseUrl}/secciones`, item);
  }

  updateSeccion(id: number, item: TableItem): Observable<TableItem> {
    return this.http.put<TableItem>(`${this.baseUrl}/secciones/${id}`, item);
  }

  // ------- EMPLEADOS -------
  getEmpleados(): Observable<TableItem[]> {
    return this.http.get<TableItem[]>(`${this.baseUrl}/empleados`);
  }

  addEmpleado(item: TableItem): Observable<TableItem> {
    return this.http.post<TableItem>(`${this.baseUrl}/add-empleados`, item);
  }

  updateEmpleado(id: number, item: TableItem): Observable<TableItem> {
    return this.http.put<TableItem>(`${this.baseUrl}/empleados/${id}`, item);
  }

  // ------- MARCAS -------
  getMarcas(): Observable<TableItem[]> {
    return this.http.get<TableItem[]>(`${this.baseUrl}/marcas`);
  }

  addMarca(item: TableItem): Observable<TableItem> {
    return this.http.post<TableItem>(`${this.baseUrl}/marcas`, item);
  }

  updateMarca(id: number, item: TableItem): Observable<TableItem> {
    return this.http.put<TableItem>(`${this.baseUrl}/marcas/${id}`, item);
  }

  // ------- MEDIDAS -------
  getMedidas(): Observable<TableItem[]> {
    return this.http.get<TableItem[]>(`${this.baseUrl}/medidas`);
  }

  addMedida(item: TableItem): Observable<TableItem> {
    return this.http.post<TableItem>(`${this.baseUrl}/medidas`, item);
  }

  updateMedida(id: number, item: TableItem): Observable<TableItem> {
    return this.http.put<TableItem>(`${this.baseUrl}/medidas/${id}`, item);
  }
}
