import { Component, OnInit } from '@angular/core';
import { ServiciosActuales, ServiciosAgenda } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-agenda-servicios',
  templateUrl: './agenda-servicios.component.html',
  styleUrl: './agenda-servicios.component.css'
})
export class AgendaServiciosComponent implements OnInit{
  servicios: ServiciosAgenda[] = [];
  serviciosFiltrados: ServiciosAgenda[] = [];
  servicioSeleccionado: ServiciosAgenda | null = null;
  
  fechaSeleccionada: Date | null = null;
  estadoSeleccionado: number | null = null;
  mostrarDetalles = false;
  
  estadosServicio = [
    { label: 'Pendiente', value: 1 },
    { label: 'En Progreso', value: 2 },
    { label: 'Completado', value: 3 },
    { label: 'Cancelado', value: 4 }
  ];

  constructor(private servicio: VentaServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicio.listadoServiciosAgenda().subscribe({
      next: (data: ServiciosAgenda[]) => {
        this.servicios = data.map(servicio => ({
          ...servicio,
          // Asegúrate de que fechaPrestar sea un objeto Date si viene como string
          fechaPrestar: servicio.fechaPrestar ? new Date(servicio.fechaPrestar) : new Date(),
        }));
        this.serviciosFiltrados = [...this.servicios];
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      },
      complete: () => {
        console.log('Carga de servicios completada');
      }
    });
  }
  filtrarPorFecha() {
    this.filtrarServicios();
  }

  filtrarServicios() {
    this.serviciosFiltrados = this.servicios.filter(servicio => {
      let pasaFiltroFecha = true;
      let pasaFiltroEstado = true;

      if (this.fechaSeleccionada) {
        const fechaServicio = new Date(servicio.fechaPrestar);
        const fechaFiltro = new Date(this.fechaSeleccionada);
        pasaFiltroFecha = fechaServicio.toDateString() === fechaFiltro.toDateString();
      }

      if (this.estadoSeleccionado !== null) {
        pasaFiltroEstado = servicio.estadoServicio === this.estadoSeleccionado;
      }

      return pasaFiltroFecha && pasaFiltroEstado;
    });
  }

  limpiarFiltros() {
    this.fechaSeleccionada = null;
    this.estadoSeleccionado = null;
    this.serviciosFiltrados = [...this.servicios];
  }

  verDetalles(servicio: ServiciosAgenda) {
    this.servicioSeleccionado = servicio;
    this.mostrarDetalles = true;
  }

  editarServicio(servicio: ServiciosAgenda) {
    // Implementar lógica de edición
    console.log('Editar servicio:', servicio);
  }

  cerrarDetalles() {
    this.mostrarDetalles = false;
    this.servicioSeleccionado = null;
  }

  getEstadoClass(estado: number): string {
    switch (estado) {
      case 1: return 'pendiente';
      case 2: return 'en-progreso';
      case 3: return 'completado';
      case 4: return 'cancelado';
      default: return 'pendiente';
    }
  }

  getEstadoIcon(estado: number): string {
    switch (estado) {
      case 1: return 'schedule';
      case 2: return 'hourglass_empty';
      case 3: return 'check_circle';
      case 4: return 'cancel';
      default: return 'schedule';
    }
  }

  getEstadoLabel(estado: number): string {
    switch (estado) {
      case 1: return 'Pendiente';
      case 2: return 'En Progreso';
      case 3: return 'Completado';
      case 4: return 'Cancelado';
      default: return 'Pendiente';
    }
  }

  getEstadoSeverity(estado: number): 'success' | 'info' | 'warning' | 'danger' {
    switch (estado) {
      case 1: return 'warning';
      case 2: return 'info';
      case 3: return 'success';
      case 4: return 'danger';
      default: return 'warning';
    }
  }
}
