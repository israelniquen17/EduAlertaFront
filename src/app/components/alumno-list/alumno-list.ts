import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlumnoService, Alumno } from '../../app/services/alumno';

@Component({
  selector: 'app-alumno-list',
  standalone: true,
  templateUrl: './alumno-list.html',
  styleUrls: ['./alumno-list.css'],
  imports: [CommonModule, FormsModule, RouterModule, QRCodeComponent]
})
export class AlumnoListComponent implements OnInit {
  filtro: string = '';
  alumnos: Alumno[] = [];
  alumnosFiltrados: Alumno[] = [];

  alumnoSeleccionado: any = null;
  mostrarModal: boolean = false;

  qrSeleccionado: string = '';
  mostrarModalQr: boolean = false;
  alumnoQr: Alumno | null = null;

  filtroNivel: string = '';
  filtroGrado: string = '';
  filtroSeccion: string = '';
  filtroEstado: string = 'ACTIVO';

  gradosInicial: string[] = ['3 años', '4 años', '5 años'];
  gradosPrimaria: string[] = ['1ro', '2do', '3ro', '4to', '5to', '6to'];
  gradosSecundaria: string[] = ['1ro', '2do', '3ro', '4to', '5to'];

  gradosEdicionDisponibles: string[] = [];

  constructor(private alumnoService: AlumnoService) {}

  niveles = [
    { id: 1, nombre: 'INICIAL' },
    { id: 2, nombre: 'PRIMARIA' },
    { id: 3, nombre: 'SECUNDARIA' }
  ];

  ngOnInit(): void {
    this.alumnoService.alumnos$.subscribe(data => {
      this.alumnos = data;
      this.filtrarAlumnos();
    });

    this.alumnoService.obtenerAlumnos().subscribe();
  }

  get gradosDisponibles(): string[] {
    return [...new Set(this.alumnos.map(a => a.grado).filter(Boolean))].sort();
  }

  get seccionesDisponibles(): string[] {
    return [...new Set(this.alumnos.map(a => a.seccion).filter(Boolean))].sort();
  }

  filtrarAlumnos() {
    const texto = this.filtro.trim().toLowerCase();

    this.alumnosFiltrados = this.alumnos.filter(a => {
      const coincideTexto =
        !texto ||
        a.nombres.toLowerCase().includes(texto) ||
        a.apellidos.toLowerCase().includes(texto) ||
        a.dni.includes(texto);

      const coincideNivel = this.filtroNivel
        ? a.nivel.nombre.trim().toUpperCase() === this.filtroNivel.trim().toUpperCase()
        : true;

      const coincideGrado = this.filtroGrado
        ? a.grado.trim().toUpperCase() === this.filtroGrado.trim().toUpperCase()
        : true;

      const coincideSeccion = this.filtroSeccion
        ? a.seccion.trim().toUpperCase() === this.filtroSeccion.trim().toUpperCase()
        : true;

      const coincideEstado = this.filtroEstado
        ? (a.estado || '').trim().toUpperCase() === this.filtroEstado.trim().toUpperCase()
        : true;

      return coincideTexto && coincideNivel && coincideGrado && coincideSeccion && coincideEstado;
    });
  }

  limpiarFiltros() {
    this.filtro = '';
    this.filtroNivel = '';
    this.filtroGrado = '';
    this.filtroSeccion = '';
    this.filtroEstado = 'ACTIVO';
    this.filtrarAlumnos();
  }

  trackByAlumno(index: number, alumno: Alumno): number | undefined {
    return alumno.id;
  }

  actualizarGradosEdicion() {
    if (!this.alumnoSeleccionado?.nivel?.id) {
      this.gradosEdicionDisponibles = [];
      return;
    }

    const nivelId = Number(this.alumnoSeleccionado.nivel.id);

    if (nivelId === 1) {
      this.gradosEdicionDisponibles = [...this.gradosInicial];
    } else if (nivelId === 2) {
      this.gradosEdicionDisponibles = [...this.gradosPrimaria];
    } else if (nivelId === 3) {
      this.gradosEdicionDisponibles = [...this.gradosSecundaria];
    } else {
      this.gradosEdicionDisponibles = [];
    }

    if (!this.gradosEdicionDisponibles.includes(this.alumnoSeleccionado.grado)) {
      this.alumnoSeleccionado.grado = '';
    }
  }

  abrirModal(alumno: Alumno) {
    this.alumnoSeleccionado = {
      ...alumno,
      nivel: alumno.nivel ? { ...alumno.nivel } : { id: null, nombre: '' },
      padres: alumno.padres && alumno.padres.length > 0
        ? alumno.padres.map((p: any) => ({ ...p }))
        : [
            {
              dni: '',
              nombres: '',
              apellidos: '',
              telefono: ''
            }
          ]
    };

    this.actualizarGradosEdicion();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.alumnoSeleccionado = null;
    this.gradosEdicionDisponibles = [];
  }

  guardarCambios() {
    if (!this.alumnoSeleccionado?.id) return;

    const nivelSeleccionado = this.niveles.find(
      n => n.id === Number(this.alumnoSeleccionado?.nivel?.id)
    );

    if (nivelSeleccionado) {
      this.alumnoSeleccionado.nivel = { ...nivelSeleccionado };
    }

    this.alumnoService.actualizarAlumno(
      this.alumnoSeleccionado.id,
      this.alumnoSeleccionado
    ).subscribe({
      next: () => {
        alert('Alumno actualizado correctamente');
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar alumno:', err);
        const mensaje = err?.error?.message || 'No se pudo actualizar el alumno';
        alert(mensaje);
      }
    });
  }

  eliminarAlumno(id?: number) {
    if (!id) return;

    if (!confirm('¿Seguro que deseas eliminar este alumno?')) return;

    this.alumnoService.eliminarAlumno(id).subscribe({
      next: () => {
        alert('Alumno eliminado correctamente');
      },
      error: (err) => {
        console.error('Error al eliminar alumno:', err);
        const mensaje = err?.error?.message || 'No se pudo eliminar el alumno';
        alert(mensaje);
      }
    });
  }

  abrirModalQr(alumno: Alumno) {
    this.alumnoQr = alumno;

    const qrGuardado = (alumno.codigoQr || '').trim();
    const esJsonValido = qrGuardado.startsWith('{') && qrGuardado.endsWith('}');

    if (esJsonValido) {
      this.qrSeleccionado = qrGuardado;
    } else {
      this.qrSeleccionado = JSON.stringify({
        dni: alumno.dni || '',
        nombres: alumno.nombres || '',
        apellidos: alumno.apellidos || '',
        grado: alumno.grado || '',
        seccion: alumno.seccion || '',
        nivel: alumno.nivel?.nombre || ''
      });
    }

    this.mostrarModalQr = true;
  }

  cerrarModalQr() {
    this.mostrarModalQr = false;
    this.qrSeleccionado = '';
    this.alumnoQr = null;
  }

  descargarQrPdf() {
    const elemento = document.getElementById('zona-imprimir-qr');
    const alumno = this.alumnoQr;

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
      alert('No se pudo generar el PDF del QR');
    });
  }
}