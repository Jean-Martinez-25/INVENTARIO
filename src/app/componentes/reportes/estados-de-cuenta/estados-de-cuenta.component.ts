import { Component, OnInit } from '@angular/core';
import { MetodoPagoData } from '../../../interfaces/reportes/reporte-back';
import { PrimeIcons } from 'primeng/api';
import { ReportesService } from '../../../servicios/reportes/reportes.service';

interface CustomMeterGroupItem {
  label: string;
  color1: string; // Primer color para el degradado o color de fondo
  color2: string; // Segundo color para el degradado
  value: number; // Será el porcentaje para la barra
  icon: string; // Icono de PrimeIcons
  // Puedes añadir más propiedades si las necesitas, como el totalValor original o cantidadTransacciones
  totalValorOriginal: number;
  cantidadTransaccionesOriginal: number;
}

@Component({
  selector: 'app-estados-de-cuenta',
  templateUrl: './estados-de-cuenta.component.html',
  styleUrl: './estados-de-cuenta.component.css'
})
export class EstadosDeCuentaComponent implements OnInit {
  backendData!: MetodoPagoData[];

  meterGroupDisplayValues: CustomMeterGroupItem[] = []; // Usaremos esta nueva estructura
  totalGeneral: number = 0; // Para calcular el total y los porcentajes

  constructor(private service: ReportesService) {

  }

  ngOnInit(): void {
    this.obtenerEstadosCuenta();
  }

  obtenerEstadosCuenta(): void {
    this.service.obtenerEstadosDeCuenta().subscribe({
      next: (data) => {
        this.backendData = data;
        this.calculateDisplayValues();
      }
    })
  }

  calculateDisplayValues(): void {
    // 1. Calcular la suma absoluta de todos los valores para usar como base de porcentaje
    const totalAbsoluto = this.backendData.reduce((sum, item) => sum + Math.abs(item.totalValor), 0);

    // 2. Mapear backendData a meterGroupDisplayValues
    this.meterGroupDisplayValues = this.backendData.map(item => {
      const porcentaje = totalAbsoluto > 0 ? (Math.abs(item.totalValor) / totalAbsoluto) * 100 : 0;
      let color1: string = '';
      let color2: string = '';
      let icon: string = '';

      // Asigna colores e íconos basados en el método de pago
      switch (item.metodoPago) {
        case 'Efectivo':
          color1 = '#4CAF50'; // Verde
          color2 = '#81C784';
          icon = PrimeIcons.MONEY_BILL;
          break;
        case 'Crédito':
          color1 = '#2196F3'; // Azul
          color2 = '#64B5F6';
          icon = PrimeIcons.CREDIT_CARD;
          break;
        case 'Transferencia':
          color1 = '#FFC107'; // Amarillo
          color2 = '#FFD54F';
          icon = PrimeIcons.WALLET;
          break;
        default:
          color1 = '#9E9E9E'; // Gris
          color2 = '#BDBDBD';
          icon = PrimeIcons.QUESTION;
          break;
      }

      return {
        label: item.metodoPago,
        color1: color1,
        color2: color2,
        value: parseFloat(porcentaje.toFixed(2)), // valor siempre positivo
        icon: icon,
        totalValorOriginal: item.totalValor, // aquí sí puede ser negativo
        cantidadTransaccionesOriginal: item.cantidadTransacciones
      };
    });
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
      return 'efectivo'; // clase por defecto
  }
}

getIconClass(primeIcon: string): string {
  // Mapea los iconos de PrimeNG a Font Awesome
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
      return 'fas fa-question-circle';
  }
}
}