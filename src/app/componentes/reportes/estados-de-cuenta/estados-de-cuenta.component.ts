// estados-de-cuenta.component.ts
import { Component, OnInit } from '@angular/core';
import { MetodoPagoData, ResumenGeneralDTO } from '../../../interfaces/reportes/reporte-back';
import { PrimeIcons } from 'primeng/api';
import { ReportesService } from '../../../servicios/reportes/reportes.service';

interface CustomMeterGroupItem {
  label: string;
  color1: string;
  color2: string;
  value: number;
  icon: string;
  totalValorOriginal: number;
  cantidadTransaccionesOriginal: number;
}

interface MetodoDetalle {
  metodo: string;
  ventas: { valor: number; transacciones: number };
  compras: { valor: number; transacciones: number };
  ingresos: number;
  balance: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-estados-de-cuenta',
  templateUrl: './estados-de-cuenta.component.html',
  styleUrl: './estados-de-cuenta.component.css'
})
export class EstadosDeCuentaComponent implements OnInit {
  backendData!: MetodoPagoData[];
  resumen: ResumenGeneralDTO | null = null;
  
  meterGroupDisplayValues: CustomMeterGroupItem[] = [];
  totalGeneral: number = 0;
  
  // Nuevas propiedades para el dashboard mejorado
  metodosDetalle: MetodoDetalle[] = [];
  balanceNeto: number = 0;

  // Configuración de colores e iconos
  private colorMap: { [key: string]: string } = {
    'Efectivo': '#4CAF50',
    'Transferencia': '#FFC107',
    'Crédito': '#2196F3'
  };

  private iconMap: { [key: string]: string } = {
    'Efectivo': 'fas fa-money-bill-wave',
    'Transferencia': 'fas fa-wallet',
    'Crédito': 'fas fa-credit-card'
  };

  constructor(private service: ReportesService) {}

  ngOnInit(): void {
    this.obtenerEstadosCuenta();
    this.obtenerTotales();
  }

  obtenerEstadosCuenta(): void {
    this.service.obtenerEstadosDeCuenta().subscribe({
      next: (data) => {
        this.backendData = data;
        this.calculateDisplayValues();
      }
    });
  }

  obtenerTotales(): void {
    this.service.obtenerTotalesDeCuenta().subscribe({
      next: (data) => {
        this.resumen = data;
        console.log(this.resumen);
        this.procesarDatosResumen();
      }
    });
  }

  calculateDisplayValues(): void {
    const totalAbsoluto = this.backendData.reduce((sum, item) => sum + Math.abs(item.totalValor), 0);

    this.meterGroupDisplayValues = this.backendData.map(item => {
      const porcentaje = totalAbsoluto > 0 ? (Math.abs(item.totalValor) / totalAbsoluto) * 100 : 0;
      const color1 = this.colorMap[item.metodoPago] || '#9E9E9E';
      const icon = this.getIconClass(this.iconMap[item.metodoPago] || 'fas fa-question-circle');

      return {
        label: item.metodoPago,
        color1: color1,
        color2: this.lightenColor(color1, 20),
        value: parseFloat(porcentaje.toFixed(2)),
        icon: icon,
        totalValorOriginal: item.totalValor,
        cantidadTransaccionesOriginal: item.cantidadTransacciones
      };
    });
  }

  // Nuevo método para procesar datos del resumen
  procesarDatosResumen(): void {
    if (!this.resumen) return;

    this.balanceNeto = this.resumen.valorTotalVentas - this.resumen.valorTotalCompras;
    
    // Crear array de métodos únicos
    const metodosUnicos = new Set<string>();
    
    this.resumen.detalleVentas?.forEach(v => metodosUnicos.add(v.nombreMetodoPago));
    this.resumen.detalleCompras?.forEach(c => metodosUnicos.add(c.nombreMetodoPago));
    this.resumen.ingresosPorMetodoPago?.forEach(i => metodosUnicos.add(i.nombreMetodoPago));

    // Procesar detalles por método
    this.metodosDetalle = Array.from(metodosUnicos).map(metodo => {
      const venta = this.resumen!.detalleVentas?.find(v => v.nombreMetodoPago === metodo);
      const compra = this.resumen!.detalleCompras?.find(c => c.nombreMetodoPago === metodo);
      const ingreso = this.resumen!.ingresosPorMetodoPago?.find(i => i.nombreMetodoPago === metodo);

      const ventaValor = venta?.totalValor || 0;
      const compraValor = compra?.totalValor || 0;

      return {
        metodo,
        ventas: {
          valor: ventaValor,
          transacciones: venta?.totalTransacciones || 0
        },
        compras: {
          valor: compraValor,
          transacciones: compra?.totalTransacciones || 0
        },
        ingresos: ingreso?.totalIngresado || 0,
        balance: ventaValor - compraValor,
        color: this.colorMap[metodo] || '#9E9E9E',
        icon: this.iconMap[metodo] || 'fas fa-question-circle'
      };
    });
  }

  // Métodos auxiliares
  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  getCardClass(metodoPago: string): string {
    switch (metodoPago.toLowerCase()) {
      case 'efectivo':
        return 'efectivo';
      case 'crédito':
      case 'credito':
        return 'credito';
      case 'transferencia':
        return 'transferencia';
      default:
        return 'efectivo';
    }
  }

  getIconClass(primeIcon: string): string {
    switch (primeIcon) {
      case 'pi pi-money-bill':
        return 'fas fa-money-bill-wave';
      case 'pi pi-credit-card':
        return 'fas fa-credit-card';
      case 'pi pi-wallet':
        return 'fas fa-wallet';
      case 'pi pi-question':
        return 'fas fa-question-circle';
      default:
        return primeIcon; // Ya viene con el formato correcto
    }
  }

  // Métodos para obtener emoji por método
  getEmojiForMetodo(metodo: string): string {
    switch (metodo) {
      case 'Efectivo': return '💵';
      case 'Transferencia': return '🏦';
      case 'Crédito': return '💳';
      default: return '❓';
    }
  }

  // Métodos para obtener el porcentaje de un método específico
  getPorcentajeVentas(metodo: string): number {
    if (!this.resumen) return 0;
    const detalle = this.resumen.detalleVentas?.find(v => v.nombreMetodoPago === metodo);
    return detalle ? (detalle.totalValor / this.resumen.valorTotalVentas) * 100 : 0;
  }

  getPorcentajeCompras(metodo: string): number {
    if (!this.resumen) return 0;
    const detalle = this.resumen.detalleCompras?.find(c => c.nombreMetodoPago === metodo);
    return detalle ? (detalle.totalValor / this.resumen.valorTotalCompras) * 100 : 0;
  }
}