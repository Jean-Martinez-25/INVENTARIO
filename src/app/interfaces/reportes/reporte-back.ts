export interface ReporteBack {
  ganancia: number,
  compras: number,
  venta: number
}
export interface ReporteMensual {
  mes: string,
  compras: number,
  venta: number
  ganancia: number
}

export interface ReporteSemanal {
  semana: string;
  compras: number,
  venta: number,
  ganancia: number
}
export interface ReporteInventario {
  id: number,
  nombre: string,
  marca: string,
  cantidad: number,
  precioCompra: number,
  precioVenta: number
}
export interface ProductoMasVendidoDto {
  nombre: string,
  marca: string,
  cantidadVendida: number,
  totalVenta: number
}

export interface MetodoPagoTotal {
  idMetodo: number;
  metodoPago: string;
  total: number;
}
export interface ResumenCierreCaja {
  totalVentasDiario: MetodoPagoTotal[];
  totalComprasDiario: MetodoPagoTotal[];
  facturasVentas: any[];   // puedes definir estos luego si los usas
  facturasCompras: any[];
}
export interface MetodoPagoData {
  metodoPago: string;
  totalValor: number;
  cantidadTransacciones: number;
}
export interface CierreCajaData {
  saldoMesAnteriorEfectivo: number;
  totalIngresosEfectivoMesActual: number;
  totalEgresosEfectivoMesActual: number;
  saldoTotalEfectivoMesActual: number;
  totalVentasCreditoMesActual: number;
  totalVentasTransferenciaMesActual: number;
  totalComprasGeneralMesActual: number;
  totalVentasGeneralMesActual: number;
  gananciasDelMesActual: number;
}

export interface ResumenMetodoPagoDTO {
  nombreMetodoPago: string;
  totalTransacciones: number;
  totalValor: number;
}

export interface IngresoMetodoPagoDTO {
  nombreMetodoPago: string;
  totalIngresado: number;
}

export interface ResumenGeneralDTO {
  totalCompras: number;
  valorTotalCompras: number;
  detalleCompras: ResumenMetodoPagoDTO[];
  totalVentas: number;
  valorTotalVentas: number;
  detalleVentas: ResumenMetodoPagoDTO[];
  totalPagosCredito: number;
  detallePagosCredito: ResumenMetodoPagoDTO[];
  ingresosPorMetodoPago: IngresoMetodoPagoDTO[];
}
