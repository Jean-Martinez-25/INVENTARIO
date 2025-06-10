import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { Deuda, PagoDeuda } from '../../../interfaces/venta/deudas';

@Component({
  selector: 'app-pago-deudas',
  templateUrl: './pago-deudas.component.html',
  styleUrl: './pago-deudas.component.css'
})
export class PagoDeudasComponent implements OnInit{
    paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PagoDeudasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { deuda: Deuda, metodosPago: SimpleViewModel[] },
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      metodoPagoId: ['', Validators.required],
      valorPago: ['', [Validators.required, Validators.min(1), Validators.max(data.deuda.valor)]]
    });
  }

  ngOnInit() {
    // Pre-llenar el valor total de la deuda
    this.paymentForm.patchValue({
      valorPago: this.data.deuda.valor
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  getRemainingBalance(): number {
    const valorPago = this.paymentForm.get('valorPago')?.value || 0;
    return Math.max(0, this.data.deuda.valor - valorPago);
  }

  onSubmit() {
    if (this.paymentForm.valid) {
      const pagoData: PagoDeuda = {
        idVenta: this.data.deuda.idVenta,
        numeroFactura: this.data.deuda.numeroFactura,
        clienteNombre: this.data.deuda.clienteNombre,
        valorOriginal: this.data.deuda.valor,
        valorPago: this.paymentForm.get('valorPago')?.value,
        metodoPagoId: this.paymentForm.get('metodoPagoId')?.value,
        fechaPago: new Date().toISOString()
      };

      this.dialogRef.close(pagoData);
    }
  }
}
