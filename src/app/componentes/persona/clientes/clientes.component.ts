import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProveedoresService } from '../../../servicios/personas/proveedores.service';
import { Clientes, ClientesBack } from '../../../interfaces/personas/proveedores';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers: [MessageService]
})
export class ClientesComponent implements OnInit {

  clienteForm: FormGroup;
  clientes: Clientes[] = [];
  editandoIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private servicio: ProveedoresService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario inválido' });
      return;
    }

    if (this.editandoIndex !== null) {
      const clienteEditado: Clientes = {
        ...this.clientes[this.editandoIndex],
        ...this.clienteForm.value
      };

      this.servicio.editarCliente(clienteEditado.id, clienteEditado).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente editado exitosamente' });
          this.obtenerClientes();
          this.editandoIndex = null;
          this.clienteForm.reset();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo editar el cliente' });
        }
      });

    } else {
      const nuevoCliente: ClientesBack = {
        ...this.clienteForm.value
      };

      this.servicio.crearCliente(nuevoCliente).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Cliente agregado exitosamente' });
          this.obtenerClientes();
          this.clienteForm.reset();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el cliente' });
        }
      });
    }
  }

  campoInvalido(campo: string): boolean {
    const control = this.clienteForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  editarCliente(cliente: Clientes, index: number): void {
    this.clienteForm.patchValue(cliente);
    this.editandoIndex = index;
    this.messageService.add({ severity: 'info', summary: 'Editar', detail: 'Cliente cargado para edición' });
  }

  obtenerClientes(): void {
    this.servicio.listadoClientes().subscribe({
      next: data => {
        this.clientes = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los clientes' });
      }
    });
  }
}
