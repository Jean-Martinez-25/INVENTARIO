import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { EdicionService, TableItem } from '../../../servicios/inventario/edicion.service';

interface TableConfig {
  name: string;
  displayName: string;
  columns: string[];
  data: TableItem[];
}

@Component({
  selector: 'app-edicion',
  templateUrl: './edicion.component.html',
  styleUrl: './edicion.component.css'
})
export class EdicionComponent implements OnInit {

  selectedTable: string = 'secciones';

  tables: { [key: string]: TableConfig } = {
    secciones: {
      name: 'secciones',
      displayName: 'Secciones',
      columns: ['id', 'nombre'],
      data: []
    },
    empleados: {
      name: 'empleados',
      displayName: 'Empleados',
      columns: ['id', 'nombre', 'documento', 'estado'],
      data: []
    },
    marcas: {
      name: 'marcas',
      displayName: 'Marcas',
      columns: ['id', 'nombre'],
      data: []
    },
    medidas: {
      name: 'medidas',
      displayName: 'Medidas',
      columns: ['id', 'nombre'],
      data: []
    }
  };

  displayDialog: boolean = false;
  isEditing: boolean = false;
  currentItem: TableItem = { id: 0, nombre: '' };

  constructor(
    private dialog: MatDialog,
    private messageService: MessageService,
    private edicionService: EdicionService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.edicionService.getSecciones().subscribe(data => this.tables['secciones'].data = data);
    this.edicionService.getEmpleados().subscribe(data => this.tables['empleados'].data = data);
    this.edicionService.getMarcas().subscribe(data => this.tables['marcas'].data = data);
    this.edicionService.getMedidas().subscribe(data => this.tables['medidas'].data = data);
  }

  getCurrentTable(): TableConfig {
    return this.tables[this.selectedTable];
  }

  addNew() {
    this.currentItem = { id: 0, nombre: '' };
    this.isEditing = false;
    this.displayDialog = true;
  }

  editItem(item: TableItem) {
    this.currentItem = { ...item };
    this.isEditing = true;
    this.displayDialog = true;
  }

  saveItem() {
    if (!this.currentItem.nombre.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es requerido'
      });
      return;
    }

    const table = this.getCurrentTable();
    const item = { ...this.currentItem };
    const isEditing = this.isEditing;

    const serviceCall = () => {
      switch (this.selectedTable) {
        case 'secciones':
          return isEditing
            ? this.edicionService.updateSeccion(item.id, item)
            : this.edicionService.addSeccion(item);
        case 'empleados':
          return isEditing
            ? this.edicionService.updateEmpleado(item.id, item)
            : this.edicionService.addEmpleado(item);
        case 'marcas':
          return isEditing
            ? this.edicionService.updateMarca(item.id, item)
            : this.edicionService.addMarca(item);
        case 'medidas':
          return isEditing
            ? this.edicionService.updateMedida(item.id, item)
            : this.edicionService.addMedida(item);
        default:
          return null;
      }
    };

    const observable = serviceCall();
    if (!observable) return;

    observable.subscribe({
      next: result => {
        if (isEditing) {
          const index = table.data.findIndex(i => i.id === result.id);
          if (index !== -1) table.data[index] = result;
        } else {
          table.data.push(result);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: isEditing ? 'Elemento actualizado' : 'Elemento agregado'
        });

        this.displayDialog = false;
        this.currentItem = { id: 0, nombre: '' };
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el elemento'
        });
      }
    });
    this.loadData();
  }

  cancelEdit() {
    this.displayDialog = false;
    this.currentItem = { id: 0, nombre: '' };
  }

  onTableChange(event: any) {
    this.selectedTable = event.value;
  }
}
