import { Component, OnInit } from '@angular/core';

export interface Deuda {
  idVenta: number;
  valor: number;
  numeroFactura: number;
  metodoPagoNombre: string;
  clienteNombre: string;
  fecha: string;
}

@Component({
  selector: 'app-listado-deudas',
  templateUrl: './listado-deudas.component.html',
  styleUrl: './listado-deudas.component.css'
})
export class ListadoDeudasComponent implements OnInit{
  deudas: Deuda[] = [
    {
      "idVenta": 3,
      "valor": 163863,
      "numeroFactura": 202506003,
      "metodoPagoNombre": "Crédito",
      "clienteNombre": "Isabela Silva",
      "fecha": "2025-06-05T23:15:09.273163"
    },
    {
      "idVenta": 4,
      "valor": 68544,
      "numeroFactura": 202506004,
      "metodoPagoNombre": "Crédito",
      "clienteNombre": "Isabela Silva",
      "fecha": "2025-06-06T02:06:01.3206625"
    },
    {
      "idVenta": 6,
      "valor": 369495,
      "numeroFactura": 202506006,
      "metodoPagoNombre": "Crédito",
      "clienteNombre": "Isabela Silva",
      "fecha": "2025-06-06T11:37:02.27911"
    }
  ];

  ngOnInit() {
    // Aquí podrías hacer la llamada al servicio para obtener las deudas
    // this.loadDeudas();
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
    console.log('Registrar pago de deuda:', deuda);
    // Implementar lógica para registrar pago
  }

  printDebt(deuda: Deuda) {
    console.log('Imprimir deuda:', deuda);
    // Implementar lógica para imprimir
  }

  // Método para cargar deudas desde el servicio
  // private loadDeudas() {
  //   this.debtService.getDeudas().subscribe({
  //     next: (deudas) => {
  //       this.deudas = deudas;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar deudas:', error);
  //     }
  //   });
  // }
}
