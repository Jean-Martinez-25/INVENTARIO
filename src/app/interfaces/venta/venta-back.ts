export interface Cliente {
    id: number;
    nombre: string;
  }
  
  export interface MetodoPago {
    id: number;
    nombre: string;
  }

  export interface Empleado{
    id: number,
    nombre: string
  }

  export interface Producto {
    idProducto: number;
    nombre: string;
    codigo: string;
    precio: number;
    cantidad: number;
    marca: string;
  }

    export interface ProductoTable {
    idProducto: number;
    nombre: string;
    cantidad: string;
    precio: number;
    marca: string;
  }
  
  export interface DatosVenta {
    clientes: Cliente[];
    metodosPago: MetodoPago[];
    productos: Producto[]; 
  }

   export interface DatosServicio {
    clientes: Cliente[];
    metodosPago: MetodoPago[];
    productos: Producto[];
    empleados: Empleado[];
    servicios: Servicios[];
  }

  export interface Servicios{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number
  }

  export interface ListadoFacturasPorMes{
    id: number;
    numFactura: string;
    valor: number;
    fecha: string;
    persona: string;
  }

  export interface ListadoVenta{
    id: number;
    numFactura: string;
    valor: number;
    fecha: string;
    persona: string;
  }
  export interface ListadoCompra{
    id: number;
    numFactura: string;
    valor: number;
    fecha: string;
    persona: string;
  }
  export interface DetalleFactura {
  numFactura: number;
  producto: string;
  codigo?: string,
  marca?: string;
  cantidad: number;
  precio: number;
  total: number;
  medida?: string;
}
export interface CompraRequest {
  producto: ProductoAddInt[];
  metodosPago: { idMetodoPago: number; valor: number }[];
  idCliente: number;
  idUsuario: number;
  valorTotal: number;
}
export interface ProductoAddInt {
  idProducto: number,
  cantidad: number
}
export interface CrearServicioPrestadoDto {
  idTipoServicio: number;
  idCliente: number;
  valorPagado: number;
  fechaARealizar: Date;
  idEmpleado: number;
  producto: DetalleProductoDto[];
  metodosPago: MetodoPagoDto[];
}
export interface DetalleProductoDto {
  idProducto: number;
  cantidad: number;
}

export interface MetodoPagoDto {
  idMetodoPago: number;
  valor: number;
}
export interface ServiciosActuales {
  id: number;
  direccionRealizar: string;
  nombreCliente: string;
  fechaPrestar: Date;
  nombreEmpleado: string;
  numFactura: string;
  tipoServicio: string;
  valor: number;
  estadoServicio: string;
  telefono?: string;
  descripcion?: string;
}

export interface ServiciosAgenda {
  id: number;
  direccionRealizar: string;
  nombreCliente: string;
  fechaPrestar: Date;
  nombreEmpleado: string;
  numFactura: string;
  tipoServicio: string;
  valor: number;
  estadoServicio: number;
  telefono?: string;
  descripcion?: string;
}

export interface ServiciosActualizar {
  id: number;
  fechaPrestar: Date;
  estadoServicio: number;
}
