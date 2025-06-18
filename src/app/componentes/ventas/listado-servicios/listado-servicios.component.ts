import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ServiciosActuales } from '../../../interfaces/venta/venta-back';
import { VentaServicioService } from '../../../servicios/ventas/venta-servicio.service';

@Component({
  selector: 'app-listado-servicios',
  templateUrl: './listado-servicios.component.html',
  styleUrl: './listado-servicios.component.css'
})
export class ListadoServiciosComponent implements OnInit {
  servicios: ServiciosActuales[] = [];
  serviciosFiltrados: ServiciosActuales[] = [];
  searchTerm: string = '';
  filtroEstado: string = '';
  isLoading: boolean = true;

  // Variables para el modal
  mostrarModal: boolean = false;
  servicioSeleccionado: ServiciosActuales | null = null;
  modoEdicion: boolean = false;
  guardandoCambios: boolean = false;

  constructor(private servicio: VentaServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.servicio.listadoServicios().subscribe({
      next: (data: ServiciosActuales[]) => {
        console.log('Datos recibidos:', data);
        this.servicios = data.map(servicio => ({
          ...servicio,
          // Asegúrate de que fechaPrestar sea un objeto Date si viene como string
          fechaPrestar: servicio.fechaPrestar ? new Date(servicio.fechaPrestar) : new Date(),
          estadoServicio: this.mapearEstado(servicio.estadoServicio)
        }));
        this.serviciosFiltrados = [...this.servicios];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
        this.isLoading = false;
        this.mostrarNotificacion('Error al cargar los servicios', 'error');
      },
      complete: () => {
        console.log('Carga de servicios completada');
      }
    });
  }

  filtrarServicios(): void {
    this.serviciosFiltrados = this.servicios.filter(servicio => {
      const matchesSearch = !this.searchTerm ||
        servicio.nombreCliente?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        servicio.nombreEmpleado?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        servicio.tipoServicio?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.filtroEstado || servicio.estadoServicio === this.filtroEstado;

      return matchesSearch && matchesStatus;
    });
  }

  filtrarPorEstado(estado: string): void {
    this.filtroEstado = estado;
    this.filtrarServicios();
  }

  // Métodos para el modal
  abrirModal(servicio: ServiciosActuales, modo: 'ver' | 'editar'): void {
    // Clonamos el objeto para trabajar sobre una copia en el modal
    this.servicioSeleccionado = { ...servicio };
    // Convertimos la fecha a un formato adecuado para el input datetime-local si es necesario
    if (this.servicioSeleccionado.fechaPrestar && typeof this.servicioSeleccionado.fechaPrestar === 'string') {
      this.servicioSeleccionado.fechaPrestar = new Date(this.servicioSeleccionado.fechaPrestar);
    }
    this.modoEdicion = modo === 'editar';
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden'; // Evitar scroll del body
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.servicioSeleccionado = null;
    this.modoEdicion = false;
    this.guardandoCambios = false;
    document.body.style.overflow = 'auto';
  }

  guardarCambios(): void {
    if (!this.servicioSeleccionado) return;

    this.guardandoCambios = true;
    // Prepara el objeto para enviar a la API.
    // Solo enviamos los campos que queremos actualizar
    const servicioParaActualizar = {
      id: this.servicioSeleccionado.id,
      fechaPrestar: this.servicioSeleccionado.fechaPrestar,
      estadoServicio: this.mapearEstadoANumero(this.servicioSeleccionado.estadoServicio) // Mapear a número para el backend
    };

    this.servicio.actualizarServicio(servicioParaActualizar).subscribe({
      next: (response) => {
        console.log('Servicio actualizado:', response);
        // Recargar la lista completa para reflejar cambios
        this.cargarServicios();
        this.guardandoCambios = false;
        this.cerrarModal();
        this.messageService.add({
          severity: 'success',
          summary: 'Disponible',
          detail: `Estado actualizado correctamente.`
        });
      },
      error: (error) => {
        console.error('Error al actualizar servicio:', error);
        this.guardandoCambios = false;
        this.mostrarNotificacion('Error al actualizar el servicio', 'error');
      }
    });
  }

  // Método para mostrar notificaciones
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error'): void {
    console.log(`${tipo.toUpperCase()}: ${mensaje}`);
    if (tipo === 'error') {
      alert(`Error: ${mensaje}`);
    } else {
      alert(`Éxito: ${mensaje}`);
    }
  }

  // Métodos auxiliares
  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined) return '$0'; // Manejo de valores nulos/indefinidos
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pendiente': return 'status-pendiente';
      case 'En Progreso': return 'status-progreso';
      case 'Completado': return 'status-completado';
      default: return 'status-default';
    }
  }

  trackByFn(index: number, item: ServiciosActuales): number {
    return item.id;
  }

  mapearEstado(estado: number | string): string {
    const estadoNumerico = typeof estado === 'string' ? parseInt(estado, 10) : estado;
    switch (estadoNumerico) {
      case 1: return 'Pendiente';
      case 2: return 'En Progreso';
      case 3: return 'Completado';
      default: return 'Desconocido';
    }
  }

  mapearEstadoANumero(estado: string): number {
    switch (estado) {
      case 'Pendiente': return 1;
      case 'En Progreso': return 2;
      case 'Completado': return 3;
      default: return 1; // Valor por defecto si el estado no coincide
    }
  }

  // Método para manejar clics en el overlay del modal
  onModalOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }

  // Método para obtener el conteo de servicios por estado
  getServiciosPorEstado(estado: string): number {
    return this.servicios.filter(servicio => servicio.estadoServicio === estado).length;
  }
}