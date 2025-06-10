import { MatDialog } from '@angular/material/dialog';
import { SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { ReportesService } from './../../../servicios/reportes/reportes.service';
import { Component, OnInit } from '@angular/core';
import { PagoDeudasComponent } from '../pago-deudas/pago-deudas.component';
import { Deuda, PagoDeuda } from '../../../interfaces/venta/deudas';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-listado-deudas',
  templateUrl: './listado-deudas.component.html',
  styleUrl: './listado-deudas.component.css'
})
export class ListadoDeudasComponent implements OnInit{
  deudas: Deuda[] = [];

   metodosPago: SimpleViewModel[] = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Transferencia' }
  ];

  constructor(private reporteService: ReportesService,
    private dialog: MatDialog,
    private messageService: MessageService // si usas PrimeNG
  ) {
  
  }

  ngOnInit() {
    // Aquí podrías hacer la llamada al servicio para obtener las deudas
    this.loadDeudas();
  }

  getTotalDebt(): number {
    return this.deudas.reduce((total, deuda) => total + deuda.valor, 0);
  }

  getUniqueClients(): number {
    const uniqueClients = new Set(this.deudas.map(deuda => deuda.clienteNombre));
    return uniqueClients.size;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  viewDebt(deuda: Deuda) {
    console.log('Ver deuda:', deuda);
    // Implementar lógica para ver detalles de la deuda
  }

  payDebt(deuda: Deuda) {
  const dialogRef = this.dialog.open(PagoDeudasComponent, {
    width: '500px',
    data: { 
      deuda: deuda, 
      metodosPago: this.metodosPago 
    }
  });

  dialogRef.afterClosed().subscribe((result: PagoDeuda) => {
    if (result) {
      this.reporteService.registrarPago(result).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Pago registrado',
            detail: res.mensaje
          });

          this.loadDeudas();
        },
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al registrar el pago';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje
          });
        }
      });
    }
  });
}

  printDebt(deuda: Deuda) {
    console.log('Imprimir deuda:', deuda);
    // Implementar lógica para imprimir
  }

  private loadDeudas() {
    this.reporteService.getDeudas().subscribe({
      next: (deudas) => {
        this.deudas = deudas;
      },
      error: (error) => {
        console.error('Error al cargar deudas:', error);
      }
    });
  }
}