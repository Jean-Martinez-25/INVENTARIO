export interface Deuda {
  idVenta: number;
  valor: number;
  numeroFactura: number;
  metodoPagoNombre: string;
  clienteNombre: string;
  fecha: string;
}
export interface PagoDeuda {
  idVenta: number;
  numeroFactura: number;
  clienteNombre: string;
  valorOriginal: number;
  valorPago: number;
  metodoPagoId: number;
  fechaPago: string;
}
