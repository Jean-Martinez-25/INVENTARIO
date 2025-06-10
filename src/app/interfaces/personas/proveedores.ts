export interface ProveedoresDto {
  id: number;
  nombre: string;
  documento: string;
  correo: string;
  direccion: string;
  telefono: string;
  fechaCreacion: string; // o Date, dependiendo de cómo lo manejes
  estado: boolean;
}
export interface ProveedoresAdd {
  nombre: string;
  documento: string;
  correo: string;
  direccion: string;
  telefono: string;
}
export interface ClientesBack{
  nombre: string;
  documento: string;
  correo: string;
}

export interface Clientes{
  id: number;
  nombre: string;
  documento: string;
  correo: string;
  fechaCreacion: string;
}