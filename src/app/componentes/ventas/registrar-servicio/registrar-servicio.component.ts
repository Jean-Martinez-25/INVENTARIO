import { VentaServicioService } from './../../../servicios/ventas/venta-servicio.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente, CompraRequest, DatosServicio, DatosVenta, Empleado, MetodoPago, Producto, ProductoAddInt, Servicios } from '../../../interfaces/venta/venta-back';
import { MessageService } from 'primeng/api';
import { SimpleViewModel } from '../../../interfaces/inventario/inventario';
import { randomInt } from 'crypto';

@Component({
  selector: 'app-registrar-servicio',
  templateUrl: './registrar-servicio.component.html',
  styleUrl: './registrar-servicio.component.css'
})
export class RegistrarServicioComponent implements OnInit {
  opcionesCantidadPago = Array.from({ length: 5 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));

  // Opciones de porcentaje de ganancia
  opcionesPorcentaje = [
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 },
    { label: '25%', value: 25 },
    { label: '30%', value: 30 },
    { label: '35%', value: 35 },
    { label: '40%', value: 40 },
    { label: '45%', value: 45 },
    { label: '50%', value: 50 }
  ];

  compraForm!: FormGroup;
  productoForm!: FormGroup;
  productoDialogVisible: boolean = false;
  productosAdd: ProductoAddInt[] = [];

  productosDisponibles!: Producto[];
  clientes!: Cliente[];
  metodosPagos!: MetodoPago[];

  empleados!: Empleado[];
  servicios!: Servicios[];

  descripcionSeleccionada: string = '';
  precioSeleccionado: number = 0;


  datosForm!: DatosServicio;

  // Variables para ganancia
  gananciaPorcentaje: number = 0;
  valorGanancia: number = 0;

  constructor(private fb: FormBuilder,
    private servicio: VentaServicioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.obtenerDatos();
    this.compraForm = this.fb.group({
      cliente: [null, Validators.required],
      fechaHora: [new Date()],
      empleados: [null, Validators.required],
      servicio: [null, Validators.required],
      productos: this.fb.array([]),
      metodosPago: this.fb.array([]),
      deseaGanancia: [false],
      porcentajeGanancia: [null]
    });
    this.crearProductoForm();
  }

  onServicioChange(servicioSeleccionado: Servicios) {
    if (servicioSeleccionado) {
      this.descripcionSeleccionada = servicioSeleccionado.descripcion;
      this.precioSeleccionado = servicioSeleccionado.precio;
    } else {
      this.descripcionSeleccionada = '';
      this.precioSeleccionado = 0;
    }
  }


  obtenerDatos() {
    this.servicio.obtenerDatosServicios().subscribe({
      next: (data) => {
        this.datosForm = data;
        this.productosDisponibles = this.datosForm.productos;
        this.clientes = this.datosForm.clientes;
        this.metodosPagos = this.datosForm.metodosPago;
        this.empleados = this.datosForm.empleados;
        this.servicios = this.datosForm.servicios;
      }
    });
  }

  get productos(): FormArray {
    return this.compraForm.get('productos') as FormArray;
  }

  crearProductoForm() {
    this.productoForm = this.fb.group({
      codigo: [null, Validators.required],
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      cantidadProducto: [{ value: 0, disabled: true }, [Validators.min(0)]],
      precio: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      descuento: [0, [Validators.min(0)]],
      iva: [{ value: 19, disabled: true }]
    });
  }

  abrirDialogoProducto() {
    this.productoForm.reset({ iva: 19, cantidad: 1, descuento: 0, precio: 0 });
    this.productoDialogVisible = true;
  }

  confirmarAgregarProducto() {
    const cantidad = this.productoForm.get('cantidad')?.value;
    const cantidadProducto = this.productoForm.get('cantidadProducto')?.value;

    if (cantidad > cantidadProducto) {
      this.messageService.add({
        severity: 'info',
        summary: 'Cantidad excedida',
        detail: 'La cantidad ingresada supera la cantidad disponible.'
      });
      return;
    }

    if (this.productoForm.valid) {
      const productoSeleccionado = this.productoForm.get('codigo')?.value as Producto;
      const cantidad = this.productoForm.get('cantidad')?.value;

      const newProducto = this.fb.group({
        codigo: [productoSeleccionado.codigo],
        descripcion: [productoSeleccionado.nombre],
        cantidad: [cantidad],
        precio: [productoSeleccionado.precio],
        descuento: [this.productoForm.get('descuento')?.value],
        iva: [19],
        total: [0]
      });

      this.calcularTotal(newProducto);
      this.productos.push(newProducto);
      this.productoDialogVisible = false;

      // Actualizar cálculos de ganancia
      this.calcularGanancia();

      const idProveedor = this.compraForm.get('cliente')?.value?.id;
      if (idProveedor) {
        const producto: ProductoAddInt = {
          idProducto: productoSeleccionado.idProducto,
          cantidad: cantidad
        };
        this.productosAdd.push(producto);
      }
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  productosFiltrados: Producto[] = [];

  filtrarProductos(event: any) {
    const query = event.query.toLowerCase();
    this.productosFiltrados = this.productosDisponibles.filter(producto =>
      `${producto.codigo} - ${producto.nombre}`.toLowerCase().includes(query)
    );
  }

  productoSeleccionado(producto: Producto) {
    this.productoForm.patchValue({
      descripcion: producto.nombre,
      precio: producto.precio,
      cantidadProducto: producto.cantidad
    });
  }

  calcularTotal(productoForm: FormGroup) {
    const cantidad = productoForm.get('cantidad')?.value || 0;
    const precio = productoForm.get('precio')?.value || 0;
    const iva = productoForm.get('iva')?.value || 0;
    const descuento = productoForm.get('descuento')?.value || 0;

    const subtotal = cantidad * precio;
    const totalConIva = subtotal + (subtotal * iva / 100);
    const totalFinal = totalConIva - (subtotal * descuento / 100);

    productoForm.get('total')?.setValue(totalFinal);
  }

  eliminarProducto(index: number) {
    const productoForm = this.productos.at(index);
    const idProducto = productoForm.get('codigo')?.value;

    this.productos.removeAt(index);

    // Eliminar también del array de inventario
    const idxInventario = this.productosAdd.findIndex(i => i.idProducto === idProducto);
    if (idxInventario !== -1) {
      this.productosAdd.splice(idxInventario, 1);
    }

    // Recalcular ganancia después de eliminar producto
    this.calcularGanancia();
  }

  enviando: boolean = false;

  guardarServicioPrestado(): void {
    if (this.compraForm.invalid || this.productos.length === 0 || this.metodosPago.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, completa todos los campos requeridos.'
      });
      this.compraForm.markAllAsTouched();
      return;
    }

    const metodosPagoDto = this.metodosPago.controls.map(metodo => ({
      idMetodoPago: metodo.get('tipo')?.value,
      valor: metodo.get('valor')?.value
    }));

    const totalPagado = metodosPagoDto.reduce((acc, m) => acc + m.valor, 0);
    if (totalPagado !== this.totalConGanancia) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Inconsistencia de pago',
        detail: 'El valor total pagado no coincide con el total del servicio.'
      });
      return;
    }

    const formValue = { ...this.compraForm.value };

    const fechaLocal: Date = formValue.fechaHora;

    if (fechaLocal instanceof Date) {
      const fechaLocalIso = new Date(
        fechaLocal.getTime() - (fechaLocal.getTimezoneOffset() * 60000)
      ).toISOString().slice(0, 19);

      formValue.fechaARealizar = fechaLocalIso;
    }

    const servicioDto = {
      idTipoServicio: this.compraForm.get('servicio')?.value?.id,
      idCliente: this.compraForm.get('cliente')?.value?.id,
      valorPagado: this.totalConGanancia,
      fechaARealizar: formValue.fechaARealizar,
      idEmpleado: this.compraForm.get('empleados')?.value?.id,
      producto: this.productosAdd.map(p => ({
        idProducto: p.idProducto,
        cantidad: p.cantidad
      })),
      metodosPago: metodosPagoDto
    };

    this.enviando = true;
    this.servicio.crearServicioPrestado(servicioDto).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Servicio registrado',
          detail: 'El servicio fue guardado correctamente.'
        });
        this.resetearFormulario();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al registrar el servicio.'
        });
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }


  resetearFormulario() {
    this.compraForm.reset();
    this.productos.clear();
    this.metodosPago.clear();
    this.productosAdd = [];
    this.gananciaPorcentaje = 0;
    this.valorGanancia = 0;

    // Resetear valores específicos
    this.compraForm.patchValue({
      deseaGanancia: false,
      porcentajeGanancia: null
    });
  }

  get totalGeneral(): number {
    const totalProductos = this.productos.controls.reduce((acc, producto) => {
      return acc + (producto.get('total')?.value || 0);
    }, 0);

    // Suma el precio del servicio seleccionado
    return totalProductos + (this.precioSeleccionado || 0);
  }

  get totalConGanancia(): number {
    return this.totalGeneral + this.valorGanancia;
  }

  actualizarCantidadMetodosPago(cantidad: number) {
    const metodosArray = this.metodosPago;
    metodosArray.clear();

    for (let i = 0; i < cantidad; i++) {
      metodosArray.push(this.fb.group({
        tipo: [null, Validators.required],
        valor: [null, [Validators.required, Validators.min(0.01)]]
      }));
    }
    this.asignarValorAMetodosPago();
  }

  get metodosPago(): FormArray {
    return this.compraForm.get('metodosPago') as FormArray;
  }

  getMetodoFormGroup(index: number): FormGroup {
    return this.metodosPago.at(index) as FormGroup;
  }

  // Métodos para manejar la ganancia
  onGananciaChange(event: any) {
    if (!event.checked) {
      this.compraForm.get('porcentajeGanancia')?.setValue(null);
      this.gananciaPorcentaje = 0;
      this.valorGanancia = 0;
    }
  }

  onPorcentajeChange(porcentaje: number) {
    this.gananciaPorcentaje = porcentaje || 0;
    this.calcularGanancia();
    this.asignarValorAMetodosPago();
  }

  calcularGanancia() {
    if (this.gananciaPorcentaje > 0) {
      this.valorGanancia = (this.totalGeneral * this.gananciaPorcentaje) / 100;
    } else {
      this.valorGanancia = 0;
    }
  }
  asignarTotalDivididoAGruposPago() {
    const cantidad = this.metodosPago.length;
    if (cantidad > 0) {
      const valorDividido = this.totalConGanancia / cantidad;

      this.metodosPago.controls.forEach((metodo, index) => {
        metodo.get('valor')?.setValue(valorDividido);
      });
    }
  }
  asignarValorAMetodosPago() {
    const cantidad = this.metodosPago.length;

    if (cantidad === 1) {
      // Si hay solo un método de pago, asignar todo
      this.metodosPago.at(0).get('valor')?.setValue(this.totalConGanancia);
    } else if (cantidad > 1) {
      // Si hay varios, dividir el total entre todos
      this.asignarTotalDivididoAGruposPago();
    }
  }
  onEmpleadoFechaChange(): void {
    const empleadoSeleccionado = this.compraForm.get('empleados')?.value;
    const fechaHoraSeleccionada = this.compraForm.get('fechaHora')?.value;

    // Verificar que ambos campos tengan valores
    if (empleadoSeleccionado && fechaHoraSeleccionada) {
      this.verificarDisponibilidadEmpleado(empleadoSeleccionado, fechaHoraSeleccionada);
    }
  }

  // Método para verificar la disponibilidad del empleado
  verificarDisponibilidadEmpleado(empleado: any, fechaHora: Date): void {
    this.servicio.verificarDisponibilidad(empleado.id, fechaHora).subscribe({
      next: (respuesta: { disponible: boolean, mensaje: string }) => {
        if (!respuesta.disponible) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Empleado ocupado',
            detail: respuesta.mensaje || `${empleado.nombre} no está disponible en el horario seleccionado.`
          });

          // Limpiar la selección de fecha si está ocupado
          this.compraForm.get('fechaHora')?.setValue(null);
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Disponible',
            detail: respuesta.mensaje || `${empleado.nombre} está disponible en el horario seleccionado.`
          });
        }
      },
      error: (error) => {
        console.error('Error al verificar disponibilidad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo verificar la disponibilidad del empleado.'
        });
      }
    });
  }

}
