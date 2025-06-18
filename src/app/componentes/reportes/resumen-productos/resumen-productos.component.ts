import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../servicios/reportes/reportes.service';
import { ProductoMasVendidoDto } from '../../../interfaces/reportes/reporte-back';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-resumen-productos',
  templateUrl: './resumen-productos.component.html',
  styleUrls: ['./resumen-productos.component.css']
})
export class ResumenProductosComponent implements OnInit {
  // Datos principales
  productos: ProductoMasVendidoDto[] = [];
  productosOriginal: ProductoMasVendidoDto[] = [];
  marcas: { id: number, nombre: string }[] = [];

  // Filtros
  marcaSeleccionada: number[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  cantidadMinima: number = 0;

  // Vista y configuración
  vistaActual: string = 'tabla';
  cargando: boolean = false;

  // Métricas calculadas
  totalProductos: number = 0;
  totalVentas: number = 0;
  ventaPromedio: number = 0;
  marcaLider: string = '';

  // Gráficos
  graficoVentas!: ChartData<'bar'>;
  graficoMarcas!: ChartData<'doughnut'>;

  // Opciones de gráficos
  chartOptionsVentas: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Ventas: ${this.formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
          maxRotation: 45,
          minRotation: 0
        },
        grid: { color: '#ebedef' }
      },
      y: {
        ticks: {
          color: '#495057',
          callback: (value) => this.formatCurrency(Number(value))
        },
        grid: { color: '#ebedef' },
        beginAtZero: true
      }
    }
  };

  chartOptionsMarcas: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.inicializarComponente();
  }

  private async inicializarComponente(): Promise<void> {
    this.cargando = true;
    try {
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al inicializar componente:', error);
    } finally {
      this.cargando = false;
    }
  }

  private async cargarDatos(): Promise<void> {
    try {
      // Cargar productos más vendidos
      this.reportesService.getProductosMasVendidos().subscribe({
        next : data => {
          this.productosOriginal = data;
          this.productos = [...this.productosOriginal];
          // Extraer marcas únicas
          this.extraerMarcas();
          this.calcularMetricas();
          this.generarGraficos();
        }
      })
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.productos = [];
      this.productosOriginal = [];
    }
  }

  private extraerMarcas(): void {
    const marcasUnicas = [...new Set(this.productos.map(p => p.marca))];
    this.marcas = marcasUnicas.map((marca, index) => ({
      id: index + 1,
      nombre: marca
    }));
  }

  // Métodos para métricas principales
  getTotalProductos(): number {
    return this.productos.reduce((total, p) => total + p.cantidadVendida, 0);
  }

  getTotalVentas(): number {
    return this.productos.reduce((total, p) => total + p.totalVenta, 0);
  }

  getPromedioVenta(): number {
    const total = this.getTotalVentas();
    const cantidad = this.getTotalProductos();
    return cantidad > 0 ? total / cantidad : 0;
  }

  getMarcaTop(): string {
    if (this.productos.length === 0) return '';
    
    const ventasPorMarca = this.productos.reduce((acc, p) => {
      acc[p.marca] = (acc[p.marca] || 0) + p.totalVenta;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(ventasPorMarca).reduce((a, b) => 
      ventasPorMarca[a] > ventasPorMarca[b] ? a : b
    );
  }

  getPorcentajeCambio(): number {
    // Simulado - aquí deberías comparar con período anterior
    return Math.floor(Math.random() * 20) + 5;
  }

  getIncrementoVentas(): number {
    // Simulado - aquí deberías comparar con período anterior
    return Math.floor(Math.random() * 15) + 8;
  }

  getVariacionPromedio(): number {
    // Simulado - aquí deberías comparar con período anterior
    return Math.floor(Math.random() * 10) - 5;
  }

  getParticipacionMarca(): number {
    const marcaTop = this.getMarcaTop();
    const totalVentas = this.getTotalVentas();
    const ventasMarcaTop = this.productos
      .filter(p => p.marca === marcaTop)
      .reduce((total, p) => total + p.totalVenta, 0);
    
    return totalVentas > 0 ? Math.round((ventasMarcaTop / totalVentas) * 100) : 0;
  }

  // Métodos para información del período
  getPeriodoActual(): string {
    const ahora = new Date();
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    return `${this.formatearMes(mesAnterior)} ${mesAnterior.getFullYear()}`;
  }

  getFechaActualizacion(): string {
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getFiltrosActivos(): number {
    let count = 0;
    if (this.marcaSeleccionada.length > 0) count++;
    if (this.fechaInicio) count++;
    if (this.fechaFin) count++;
    if (this.cantidadMinima > 0) count++;
    return count;
  }

  // Métodos para la tabla
  getRankingClass(index: number): string {
    if (index === 0) return 'ranking-gold';
    if (index === 1) return 'ranking-silver';
    if (index === 2) return 'ranking-bronze';
    return 'ranking-default';
  }

  getVentaPromedioPorUnidad(producto: ProductoMasVendidoDto): number {
    return producto.cantidadVendida > 0 ? producto.totalVenta / producto.cantidadVendida : 0;
  }

  getParticipacion(producto: ProductoMasVendidoDto): number {
    const totalVentas = this.getTotalVentas();
    return totalVentas > 0 ? Math.round((producto.totalVenta / totalVentas) * 100) : 0;
  }

  getTendenciaClass(producto: ProductoMasVendidoDto): string {
    // Simulado - aquí deberías tener datos históricos
    const tendencia = Math.random();
    if (tendencia > 0.6) return 'tendencia-positiva';
    if (tendencia < 0.4) return 'tendencia-negativa';
    return 'tendencia-neutral';
  }

  getTendenciaIcon(producto: ProductoMasVendidoDto): string {
    const tendencia = Math.random();
    if (tendencia > 0.6) return 'trending_up';
    if (tendencia < 0.4) return 'trending_down';
    return 'trending_flat';
  }

  getTendenciaTexto(producto: ProductoMasVendidoDto): string {
    const tendencia = Math.random();
    if (tendencia > 0.6) return 'Al alza';
    if (tendencia < 0.4) return 'A la baja';
    return 'Estable';
  }

  // Métodos para filtros
  filtrarProductos(): void {
    this.productos = this.productosOriginal.filter(producto => {
      // Filtro por marca
      if (this.marcaSeleccionada.length > 0) {
        const marcasNombres = this.marcaSeleccionada.map(id => 
          this.marcas.find(m => m.id === id)?.nombre
        );
        if (!marcasNombres.includes(producto.marca)) {
          return false;
        }
      }

      // Filtro por cantidad mínima
      if (this.cantidadMinima > 0 && producto.cantidadVendida < this.cantidadMinima) {
        return false;
      }

      // Aquí podrías añadir filtros por fecha si tienes esa información en tus datos

      return true;
    });

    this.calcularMetricas();
    this.generarGraficos();
  }

  limpiarFiltros(): void {
    this.marcaSeleccionada = [];
    this.fechaInicio = null;
    this.fechaFin = null;
    this.cantidadMinima = 0;
    this.productos = [...this.productosOriginal];
    this.calcularMetricas();
    this.generarGraficos();
  }

  exportarDatos(): void {
    // Implementar exportación a Excel/CSV
    const csvContent = this.convertirACSV();
    this.descargarArchivo(csvContent, 'productos-mas-vendidos.csv', 'text/csv');
  }

  // Métodos de utilidad
  private calcularMetricas(): void {
    this.totalProductos = this.getTotalProductos();
    this.totalVentas = this.getTotalVentas();
    this.ventaPromedio = this.getPromedioVenta();
    this.marcaLider = this.getMarcaTop();
  }

  private generarGraficos(): void {
    this.generarGraficoVentas();
    this.generarGraficoMarcas();
  }

  private generarGraficoVentas(): void {
    const top10 = this.productos.slice(0, 10);
    
    this.graficoVentas = {
      labels: top10.map(p => p.nombre),
      datasets: [{
        label: 'Ventas',
        data: top10.map(p => p.totalVenta),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1
      }]
    };
  }

  private generarGraficoMarcas(): void {
    const ventasPorMarca = this.productos.reduce((acc, p) => {
      acc[p.marca] = (acc[p.marca] || 0) + p.totalVenta;
      return acc;
    }, {} as Record<string, number>);

    const marcasOrdenadas = Object.entries(ventasPorMarca)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 marcas

    this.graficoMarcas = {
      labels: marcasOrdenadas.map(([marca]) => marca),
      datasets: [{
        data: marcasOrdenadas.map(([, ventas]) => ventas),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#C9CBCF', '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#C9CBCF', '#4BC0C0'
        ]
      }]
    };
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP' // Cambia por tu moneda
    }).format(value);
  }

  private formatearMes(fecha: Date): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[fecha.getMonth()];
  }

  private convertirACSV(): string {
    const headers = ['Ranking', 'Producto', 'Marca', 'Cantidad', 'Total Ventas', 'Participacion'];
    const csvRows = [headers.join(',')];

    this.productos.forEach((producto, index) => {
      const row = [
        index + 1,
        `"${producto.nombre}"`,
        `"${producto.marca}"`,
        producto.cantidadVendida,
        producto.totalVenta,
        `${this.getParticipacion(producto)}%`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  private descargarArchivo(contenido: string, nombreArchivo: string, tipo: string): void {
    const blob = new Blob([contenido], { type: tipo });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
    window.URL.revokeObjectURL(url);
  }
}