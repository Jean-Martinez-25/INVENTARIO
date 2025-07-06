export interface Venta {
}

export interface ProductoVentaViewModel{
    IdProducto: number,
    Cantidad: number
}
export interface ProductoVentaViewModelTable {
    IdProducto: number,
    nombre?: string,
    precio?: number,
    cantidad: number,
    marca?: string
}
export interface DatosViewModel {
    IdPropietario: number,
    IdCliente: number,
    IdUsuario: number,
    IdMetodoPago:  number
}

export interface VentaViewModel{
    producto: ProductoVentaViewModel[],
    IdPropietario: number,
    IdCliente: number,
    IdUsuario: number,
    IdMetodoPago:  number
}

export interface SimpleViewModel{
    id: number,
    nombre: string
}

export interface ServiciosViewModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: boolean;
}