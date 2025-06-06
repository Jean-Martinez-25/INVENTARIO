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
