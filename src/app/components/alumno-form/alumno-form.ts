import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { AlumnoService } from '../../app/services/alumno';
import { AuthService } from '../../app/services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-alumno-form',
  standalone: true,
  templateUrl: './alumno-form.html',
  styleUrls: ['./alumno-form.css'],
  imports: [CommonModule, FormsModule, QRCodeComponent]
})
export class AlumnoFormComponent implements OnInit {

  alumno: any = {
    dni: '',
    nombres: '',
    apellidos: '',
    grado: '',
    seccion: '',
    nivel: {
      id: null,
      nombre: ''
    },
    curso: '',
    docente: '',
    padres: [
      {
        dni: '',
        nombres: '',
        apellidos: '',
        telefono: ''
      }
    ]
  };

  qrGenerado: string = '';
  mostrarQrFinal: boolean = false;
  alumnoRegistrado: any = null;

  gradosInicial: string[] = ['3 años', '4 años', '5 años'];
  gradosPrimaria: string[] = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  gradosSecundaria: string[] = ['1ro', '2do', '3ro', '4to', '5to'];

  gradosDisponibles: string[] = [];

  secciones: string[] = ['A', 'B', 'C', 'D'];

  niveles = [
    { id: 1, nombre: 'INICIAL' },
    { id: 2, nombre: 'PRIMARIA' },
    { id: 3, nombre: 'SECUNDARIA' }
  ];

  esAdministrador: boolean = false;

  constructor(
    private alumnoService: AlumnoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.esAdministrador = usuario.rol === 'ADMIN';
    }

    this.actualizarGradosPorNivel();
  }

  actualizarGradosPorNivel(): void {
    const nivelId = Number(this.alumno.nivel.id);

    if (nivelId === 1) {
      this.gradosDisponibles = [...this.gradosInicial];
    } else if (nivelId === 2) {
      this.gradosDisponibles = [...this.gradosPrimaria];
    } else if (nivelId === 3) {
      this.gradosDisponibles = [...this.gradosSecundaria];
    } else {
      this.gradosDisponibles = [];
    }

    if (!this.gradosDisponibles.includes(this.alumno.grado)) {
      this.alumno.grado = '';
    }
  }

  get qrData(): string {
    const nivelSeleccionado = this.niveles.find(
      n => n.id === Number(this.alumno.nivel.id)
    );

    return JSON.stringify({
      dni: this.alumno.dni || '',
      nombres: this.alumno.nombres || '',
      apellidos: this.alumno.apellidos || '',
      grado: this.alumno.grado || '',
      seccion: this.alumno.seccion || '',
      nivel: nivelSeleccionado ? nivelSeleccionado.nombre : ''
    });
  }

  guardar(): void {
    this.alumno.nivel.id = Number(this.alumno.nivel.id);

    this.alumnoService.crearAlumno(this.alumno).subscribe({
      next: (res: any) => {
        this.alumnoRegistrado = res;
        this.qrGenerado = res.codigoQr || this.qrData;
        this.mostrarQrFinal = true;
        alert('Alumno registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar alumno:', err);
        const mensaje = err?.error?.message || 'Error al registrar alumno';
        alert(mensaje);
      }
    });
  }

  descargarQrPdf(): void {
    const elemento = document.getElementById('zona-imprimir');
    const alumno = this.alumnoRegistrado;

    if (!elemento || !alumno) return;

    html2canvas(elemento, {
      scale: 2,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const margin = 20;
      const contentWidth = pdfWidth - margin * 2;

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 20;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('QR del Alumno', pdfWidth / 2, y, { align: 'center' });

      y += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text(`Alumno: ${alumno.nombres} ${alumno.apellidos}`, pdfWidth / 2, y, { align: 'center' });

      y += 6;
      pdf.text(`DNI: ${alumno.dni}`, pdfWidth / 2, y, { align: 'center' });

      y += 6;
      pdf.text(`Grado: ${alumno.grado}   Sección: ${alumno.seccion}`, pdfWidth / 2, y, { align: 'center' });

      y += 10;
      pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);

      pdf.save(`QR_${alumno.dni}.pdf`);
    }).catch(err => {
      console.error('Error al generar PDF:', err);
      alert('No se pudo generar el PDF');
    });
  }

  imprimirQr(): void {
    const contenido = document.getElementById('zona-imprimir');
    if (!contenido) return;

    const ventana = window.open('', '_blank', 'width=800,height=600');
    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Imprimir QR</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 30px;
            }
            .titulo {
              margin-bottom: 10px;
            }
            .subtitulo {
              margin-bottom: 20px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <h2 class="titulo">QR del Alumno</h2>
          <p class="subtitulo">${this.alumnoRegistrado?.nombres || ''} ${this.alumnoRegistrado?.apellidos || ''}</p>
          ${contenido.innerHTML}
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  }

  limpiarFormulario(): void {
    this.alumno = {
      dni: '',
      nombres: '',
      apellidos: '',
      grado: '',
      seccion: '',
      nivel: { id: null, nombre: '' },
      curso: '',
      docente: '',
      padres: [
        { dni: '', nombres: '', apellidos: '', telefono: '' }
      ]
    };

    this.qrGenerado = '';
    this.mostrarQrFinal = false;
    this.alumnoRegistrado = null;
    this.actualizarGradosPorNivel();
  }
}