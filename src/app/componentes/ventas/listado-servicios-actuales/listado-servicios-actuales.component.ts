import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosViewModel } from '../../../interfaces/venta/venta';
import { ServiciosEmpresaService } from '../../../servicios/ventas/servicios-empresa.service';

@Component({
  selector: 'app-listado-servicios-actuales',
  templateUrl: './listado-servicios-actuales.component.html',
  styleUrl: './listado-servicios-actuales.component.css'
})
export class ListadoServiciosActualesComponent implements OnInit {

  servicios: ServiciosViewModel[] = [];
  servicioForm: FormGroup;
  showForm = false;
  editingService: ServiciosViewModel | null = null;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServiciosEmpresaService
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: ['', [Validators.required, Validators.min(1)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.loadServicios();
  }

  loadServicios(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => {
        this.servicios = [...data]; // Nueva referencia para forzar renderizado
        this.closeForm();
      },  
      error: (err) => console.error('Error al obtener servicios:', err)
    });
  }

  openNewServiceForm(): void {
    this.isEditing = false;
    this.editingService = null;
    this.servicioForm.reset({
      nombre: '',
      descripcion: '',
      precio: '',
      estado: true
    });
    this.showForm = true;
  }

  openEditServiceForm(servicio: ServiciosViewModel): void {
    this.isEditing = true;
    this.editingService = servicio;
    this.servicioForm.patchValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      estado: servicio.estado
    });
    this.showForm = true;
  }

  saveService(): void {
    if (this.servicioForm.invalid) return;

    const formValue = this.servicioForm.value;

    if (this.isEditing && this.editingService) {
      const updatedServicio: ServiciosViewModel = {
        id: this.editingService.id,
        ...formValue
      };

      this.servicioService.actualizarServicio(updatedServicio).subscribe({
        next: () => {
          this.loadServicios();
        },
        error: (err) => console.error('Error al actualizar servicio:', err)
      });
    } else {
      this.servicioService.crearServicio(formValue).subscribe({
        next: () => {
          this.loadServiciosAndCloseForm();
        },
        error: (err) => console.error('Error al crear servicio:', err)
      });
    }
  }

  // Nueva función para esperar la recarga de servicios antes de cerrar el formulario
  loadServiciosAndCloseForm(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.closeForm(); // Solo cerramos el form cuando los servicios se han recargado
      },
      error: (err) => console.error('Error al recargar servicios:', err)
    });
  }

  toggleServiceStatus(id: number): void {
    const servicio = this.servicios.find(s => s.id === id);
    if (servicio) {
      const updated = { ...servicio, estado: !servicio.estado };
      this.servicioService.actualizarServicio(updated).subscribe({
        next: () => this.loadServicios(),
        error: (err) => console.error('Error al cambiar estado:', err)
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.servicioForm.reset();
    this.editingService = null;
    this.isEditing = false;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  get nombre() { return this.servicioForm.get('nombre'); }
  get descripcion() { return this.servicioForm.get('descripcion'); }
  get precio() { return this.servicioForm.get('precio'); }
}
