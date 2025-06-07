import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoComprasComponent } from '../listado-compras/listado-compras.component';
import { ListadoVentasComponent } from '../listado-ventas/listado-ventas.component';

interface ResumenCajaItem {
  label: string;
  color1: string;
  color2: string;
  icon: string;
  totalValor: number;
  transacciones?: number;
}

@Component({
  selector: 'app-cierre-caja-mensual',
  templateUrl: './cierre-de-caja-mensual.component.html',
  styleUrls: ['./cierre-de-caja-mensual.component.scss']
})
export class CierreDeCajaMensualComponent implements OnInit {
  resumenCaja: ResumenCajaItem[] = [];
  resumenCajaBase: ResumenCajaItem[] = [];
  fechaSeleccionada: Date = new Date(); // Inicializa con el mes actual

  datos: any;

  displayedColumns: string[] = ['descripcion', 'valor'];
  tablaResumen: { descripcion: string, valor: number }[] = [];

  year: number = 0;
  mes: number = 0;

  chartData: any;
  chartOptions: any;

  // Opciones para selects
  anios: number[] = [];
  meses = [
    { label: 'Enero', value: 1 },
    { label: 'Febrero', value: 2 },
    { label: 'Marzo', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Mayo', value: 5 },
    { label: 'Junio', value: 6 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
    { label: 'Octubre', value: 10 },
    { label: 'Noviembre', value: 11 },
    { label: 'Diciembre', value: 12 },
  ];

  constructor(private servicio: ReportesService,
    private _dialogservices: DialogService
  ) {

  }

  ngOnInit(): void {
    // Inicializa tabla de resumen
    this.anios = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
    this.obtenerDatos();
  }
  onFechaChange(): void {
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.year = this.fechaSeleccionada.getFullYear();
    this.mes = this.fechaSeleccionada.getMonth() + 1; // getMonth es base 0


    // Reemplaza con tu servicio real
    this.servicio.obtenerCierreCaja(this.mes, this.year).subscribe({
      next: data => {
        this.datos = data;
        this.cargarGraficos();
      }
    })
  }
  cargarGraficos() {
    const valores = [
      this.datos.totalIngresosEfectivoMesActual,
      Math.abs(this.datos.totalEgresosEfectivoMesActual), // Valor absoluto para mejor visualización
      this.datos.totalVentasCreditoMesActual,
      this.datos.ingresosTransferenciaMesActual,
      this.datos.pagosTransferenciaMesActual + this.datos.retirosTransferenciaMesActual,
      this.datos.gananciasDelMesActual
    ];
    const colores = [
      '#10B981', // Verde para ingresos efectivo
      '#EF4444', // Rojo para egresos efectivo
      '#3B82F6', // Azul para ventas crédito
      '#F59E0B', // Naranja para ingresos transferencias
      '#8B5CF6', // Púrpura para egresos transferencias
      '#84CC16'  // Verde lima para ganancias
    ];
    this.tablaResumen = [
      { descripcion: 'Saldo Mes Anterior (Efectivo)', valor: this.datos.saldoMesAnteriorEfectivo },
      { descripcion: 'Ingresos en Efectivo', valor: this.datos.totalIngresosEfectivoMesActual },
      { descripcion: 'Egresos en Efectivo', valor: this.datos.totalEgresosEfectivoMesActual },
      { descripcion: 'Retiros de Efectivo', valor: this.datos.retirosEfecitvoMesActual },
      { descripcion: 'Ingresos por Transferencia', valor: this.datos.ingresosTransferenciaMesActual },
      { descripcion: 'Egresos por Transferencia', valor: this.datos.pagosTransferenciaMesActual },
      { descripcion: 'Retiros por Transferencia', valor: this.datos.retirosTransferenciaMesActual },
      { descripcion: 'Ventas a Crédito', valor: this.datos.totalVentasCreditoMesActual },
      { descripcion: 'Compras por cheque', valor: this.datos.saldoTotalCheques },
      { descripcion: 'Total de Ventas', valor: this.datos.totalVentasGeneralMesActual },
      { descripcion: 'Total de Compras', valor: this.datos.totalComprasGeneralMesActual },
      { descripcion: 'Saldo Total Efectivo', valor: this.datos.saldoTotalEfectivoMesActual },
      { descripcion: 'Saldo Total Transferencias', valor: this.datos.saldoTotalTransferenciaMesActual },
      { descripcion: 'Ganancias del Mes', valor: this.datos.gananciasDelMesActual },
    ];

    // Configuración de las 3 tarjetas base con datos reales
    this.resumenCajaBase = [
      {
        label: 'Saldo Mes Anterior (Efectivo)',
        totalValor: this.datos.saldoMesAnteriorEfectivo,
        icon: PrimeIcons.WALLET,
        color1: '#4CAF50',
        color2: '#C8E6C9',
      },
      {
        label: 'Ingresos en Efectivo',
        totalValor: this.datos.totalIngresosEfectivoMesActual,
        icon: PrimeIcons.ARROW_DOWN,
        color1: '#2E7D32',
        color2: '#A5D6A7',
      },
      {
        label: 'Egresos en Efectivo',
        totalValor: this.datos.totalEgresosEfectivoMesActual,
        icon: PrimeIcons.ARROW_UP,
        color1: '#C62828',
        color2: '#EF9A9A',
      },
      {
        label: 'Saldo Mes Anterior (Transferencias)',
        totalValor: this.datos.saldoMesAnteriorTransferencia,
        icon: PrimeIcons.WALLET,
        color1: '#4CAF50',
        color2: '#C8E6C9',
      },
      {
        label: 'Ingresos por Transferencia',
        totalValor: this.datos.ingresosTransferenciaMesActual,
        icon: PrimeIcons.MONEY_BILL,
        color1: '#2196F3',
        color2: '#BBDEFB',
      },
      {
        label: 'Egresos por Transferencia',
        totalValor: this.datos.pagosTransferenciaMesActual,
        icon: PrimeIcons.TIMES_CIRCLE,
        color1: '#3F51B5',
        color2: '#C5CAE9',
      }
    ];

    // Gráfica

    this.chartData = {
      labels: [
        'Ingresos\nEfectivo',
        'Egresos\nEfectivo',
        'Ventas\nCrédito',
        'Ingresos\nTransferencias',
        'Egresos\nTransferencias',
        'Ganancias\nMes'
      ],
      datasets: [
        {
          label: 'Valores Financieros ($COP)',
          backgroundColor: colores,
          borderColor: colores.map(color => color + '80'), // Agregar transparencia al borde
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          data: valores,
          // Gradientes para las barras

        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 20,
            font: {
              size: 14,
              weight: '600'
            },
            color: '#374151'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          titleFont: {
            size: 14 // Aumenta el tamaño del título del tooltip
          },
          bodyFont: {
            size: 13 // Aumenta el tamaño del cuerpo del tooltip
          },
          callbacks: {
            title: function (context: any) {
              return context[0].label.replace('\n', ' ');
            },
            label: function (context: any) {
              const value = context.raw;
              const percentage = ((value / valores.reduce((a, b) => Math.abs(a) + Math.abs(b), 0)) * 100).toFixed(1);
              return [
                `Valor: $${value.toLocaleString('es-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                `Participación: ${percentage}%`
              ];
            }
          }
        },
        // Plugin personalizado para mostrar valores en las barras
        datalabels: false // Desactivamos si existe el plugin datalabels
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 13,
              weight: '500'
            },
            maxRotation: 0,
            callback: function (value: any, index: any) {
              // Dividir etiquetas largas en múltiples líneas
              const labels = [
                'Ingresos\nEfectivo',
                'Egresos\nEfectivo',
                'Ventas\nCrédito',
                'Ingresos\nTransferencias',
                'Egresos\nTransferencias',
                'Ganancias'
              ];
              return labels[index] || '';
            }
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            color: '#F3F4F6',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 12
            },
            callback: function (value: any) {
              return '$' + value.toLocaleString('es-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              });
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      // Configuración adicional para mejorar la apariencia
      layout: {
        padding: {
          top: 30,
          bottom: 20,
          left: 15,
          right: 15
        }
      }
    };

    // Tarjetas para métodos de pago y otros
    this.resumenCaja = [
      {
        label: 'Ingresos Efectivo',
        color1: '#4CAF50',
        color2: '#81C784',
        icon: PrimeIcons.MONEY_BILL,
        totalValor: this.datos.totalIngresosEfectivoMesActual
      },
      {
        label: 'Egresos Efectivo',
        color1: '#F44336',
        color2: '#E57373',
        icon: PrimeIcons.TIMES_CIRCLE,
        totalValor: this.datos.totalEgresosEfectivoMesActual
      },
      {
        label: 'Ventas Crédito',
        color1: '#007bff',
        color2: '#64B5F6',
        icon: PrimeIcons.CREDIT_CARD,
        totalValor: this.datos.totalVentasCreditoMesActual
      },
      {
        label: 'Ingresos Transferencia',
        color1: '#fd7e14',
        color2: '#FFD54F',
        icon: PrimeIcons.WALLET,
        totalValor: this.datos.totalVentasTransferenciaMesActual
      },
      {
        label: 'Egresos Transferencia',
        color1: '#17a2b8',
        color2: '#FFD54F',
        icon: PrimeIcons.WALLET,
        totalValor: this.datos.pagosTransferenciaMesActual + this.datos.retirosTransferenciaMesActual,
      },
      {
        label: 'Ganancias del Mes',
        color1: '#6f42c1',
        color2: '#BA68C8',
        icon: PrimeIcons.CHART_LINE,
        totalValor: this.datos.gananciasDelMesActual
      }
    ];
  }
  consultarCompras(): void {
    this._dialogservices.open(ListadoComprasComponent, {
      header: "Listado de ventas del mes " + this.nombreMesYAnio,
      width: '70%',
      data: {
        mes: this.mes,
        year: this.year
      }
    });
  }

  get nombreMesYAnio(): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${meses[this.mes - 1]} ${this.year}`;
  }

  consultarVentas(): void {
    this._dialogservices.open(ListadoVentasComponent, {
      header: "Listado de ventas del mes " + this.nombreMesYAnio,
      width: '70%',
      data: {
        mes: this.mes,
        year: this.year
      }
    });
  }

  consultarRetiros(): void {
    console.log('Consultando retiros de caja y transferencias...');
    // this.router.navigate(['/ruta-a-retiros'], { queryParams: { mes, anio } });
  }
  obtenerEstadisticasGrafico() {
    const ingresos = this.datos.totalIngresosEfectivoMesActual + this.datos.ingresosTransferenciaMesActual;
    const egresos = Math.abs(this.datos.totalEgresosEfectivoMesActual) +
      (this.datos.pagosTransferenciaMesActual + this.datos.retirosTransferenciaMesActual);
    const flujoNeto = ingresos - egresos;

    return {
      totalIngresos: ingresos,
      totalEgresos: egresos,
      flujoNeto: flujoNeto,
      margenGanancia: this.datos.totalVentasGeneralMesActual > 0 ?
        (this.datos.gananciasDelMesActual / this.datos.totalVentasGeneralMesActual * 100).toFixed(1) : '0'
    };
  }
}
