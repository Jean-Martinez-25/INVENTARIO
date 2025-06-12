import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioServicioService } from '../../../servicios/inventario/inventario-servicio.service';
import { Inventario } from '../../../interfaces/inventario/inventario';
import { MatDialog } from '@angular/material/dialog';
import { InformacionProductoComponent } from '../informacion-producto/informacion-producto.component';
import { EditarProductoAuditoriaComponent } from '../editar-producto-auditoria/editar-producto-auditoria.component';

@Component({
  selector: 'app-listado-inventario',
  templateUrl: './listado-inventario.component.html',
  styleUrl: './listado-inventario.component.css',
})
export class ListadoInventarioComponent implements OnInit {

  inventario!: Inventario[];
  inventarioFiltrado: Inventario[] = [];
  searchTerm: string = '';

  mostrarDialogoProducto: boolean = false;
  modoFormulario: 'crear' | 'editar' = 'crear';
  productoSeleccionado: Inventario | null = null;

  constructor(private fb: FormBuilder,
    private inventarioService: InventarioServicioService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let id = 1;
    this.obtenerListado();
  }

  filtrarInventario() {
    const termino = this.searchTerm.toLowerCase();
    this.inventarioFiltrado = this.inventario.filter(
      (item) =>
        item.codigo.toLocaleLowerCase().includes(termino)||
        item.nombre.toLowerCase().includes(termino) ||
        item.marca.toLowerCase().includes(termino) ||
        item.medida.toLowerCase().includes(termino)||
        item.seccion.toLocaleLowerCase().includes(termino)
    );
  }
  obtenerEstadoProducto(cantidad: number): string {
    if (cantidad === 0) return 'Agotado';
    if (cantidad > 0 && cantidad <= 10) return 'Próximo a acabar';
    return 'Disponible';
  }

  verProducto(producto: Inventario) {
    let idProducto = producto.id
    this.dialog.open(InformacionProductoComponent, {
      width: '600px',
      data: { idProducto }
    });
  }

  abrirDialogoEditar(producto: Inventario) {
    let idProducto = producto.id
    const dialogRef = this.dialog.open(EditarProductoAuditoriaComponent, {
      width: '600px',
      data: { idProducto }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // Aquí llamas al método que quieras ejecutar después del cierre
        this.obtenerListado(); // o el método que tengas para actualizar los datos
      }
    });
  }

  loading: boolean = false;

// Agregar este método para las estadísticas
getProductosPorEstado(estado: 'disponible' | 'proximo' | 'agotado'): number {
  if (!this.inventario) return 0;
  
  return this.inventario.filter(producto => {
    switch (estado) {
      case 'disponible':
        return producto.cantidad > 10;
      case 'proximo':
        return producto.cantidad > 0 && producto.cantidad <= 10;
      case 'agotado':
        return producto.cantidad === 0;
      default:
        return false;
    }
  }).length;
}

// Modificar el método obtenerListado para incluir loading
obtenerListado() {
  this.loading = true;
  this.inventarioService.obtenerListadoInventario().subscribe({
    next: data => {
      this.inventario = data;
      this.filtrarInventario();
      this.loading = false;
    },
    error: error => {
      console.error('Error al obtener inventario:', error);
      this.loading = false;
    }
  });
}

  crearProducto() {
    this.modoFormulario = 'crear';
    this.productoSeleccionado = null;
    this.mostrarDialogoProducto = true;
  }

  onProductoGuardado(producto: Inventario) {
    if (this.modoFormulario === 'crear') {
      this.inventario.push(producto);
    } else {
      const index = this.inventario.findIndex(p => p.id === producto.id);
      if (index > -1) {
        this.inventario[index] = producto;
      }
    }

    this.filtrarInventario();
    this.mostrarDialogoProducto = false;
  }
}
