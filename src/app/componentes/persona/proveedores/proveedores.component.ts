import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProveedoresService } from '../../../servicios/personas/proveedores.service';
import { ProveedoresAdd, ProveedoresDto } from '../../../interfaces/personas/proveedores';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
  providers: [MessageService]
})
export class ProveedoresComponent implements OnInit {

  proveedorForm: FormGroup;
  proveedores: ProveedoresDto[] = [];
  editandoIndex: number | null = null;

  constructor(private fb: FormBuilder,
    private messageService: MessageService,
    private servicio: ProveedoresService
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  guardarProveedor(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario inválido' });
      return;
    }

    if (this.editandoIndex !== null) {
      const proveedorEditado: ProveedoresDto = {
        ...this.proveedores[this.editandoIndex],
        ...this.proveedorForm.value
      };

      this.servicio.editarProveedor(proveedorEditado.id, proveedorEditado).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Proveedor editado exitosamente' });
          this.obtenerProveedores();
          this.editandoIndex = null;
          this.proveedorForm.reset();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el proveedor' });
        }
      });

    } else {
      const nuevoProveedor: ProveedoresAdd = {
        ...this.proveedorForm.value
      };

      this.servicio.crearProveedor(nuevoProveedor).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Proveedor agregado exitosamente' });
          this.obtenerProveedores();
          this.proveedorForm.reset();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el proveedor' });
        }
      });
    }
  }



  campoInvalido(campo: string): boolean {
    const control = this.proveedorForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  editarProveedor(proveedor: any, index: number): void {
    this.proveedorForm.patchValue(proveedor);
    this.editandoIndex = index;
    this.messageService.add({ severity: 'info', summary: 'Editar', detail: 'Proveedor cargado para edición' });
  }
  obtenerProveedores() {
    this.servicio.listadoProveedores().subscribe({
      next: data => {
        this.proveedores = data;
      }
    })
  }
}