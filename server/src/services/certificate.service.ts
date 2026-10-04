import PDFDocument from 'pdfkit';
import type { Writable } from 'node:stream';
import { env } from '../config/env.js';

type CertInput = {
  studentName: string;
  courseTitle: string;
  level: string;
  hours: number;
  instructor: string;
  completedAt: Date;
  code: string;
};

export function renderCertificate(out: Writable, c: CertInput) {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
  doc.pipe(out);
  const { width: W, height: H } = doc.page;

  doc.rect(0, 0, W, H).fill('#ffffff');
  doc.rect(20, 20, W - 40, H - 40).lineWidth(3).stroke('#4f46e5');
  doc.rect(32, 32, W - 64, H - 64).lineWidth(1).stroke('#c7d2fe');
  doc.rect(0, 0, W, 10).fill('#4f46e5');
  doc.rect(0, H - 10, W, 10).fill('#f59e0b');

  doc.fillColor('#4f46e5').font('Helvetica-Bold').fontSize(16).text('ENGLISH ACADEMY', 0, 70, { align: 'center', characterSpacing: 4 });
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(38).text('Certificado de Finalización', 0, 110, { align: 'center' });
  doc.fillColor('#64748b').font('Helvetica').fontSize(14).text('Se otorga a', 0, 175, { align: 'center' });
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(34).text(c.studentName, 0, 200, { align: 'center' });
  doc.moveTo(W / 2 - 180, 245).lineTo(W / 2 + 180, 245).lineWidth(1).stroke('#cbd5e1');
  doc.fillColor('#334155').font('Helvetica').fontSize(14)
    .text('por completar satisfactoriamente el curso', 0, 265, { align: 'center' });
  doc.fillColor('#4f46e5').font('Helvetica-Bold').fontSize(24).text(c.courseTitle, 60, 290, { align: 'center', width: W - 120 });
  doc.fillColor('#334155').font('Helvetica').fontSize(12)
    .text(`Nivel ${c.level} (MCER)  ·  ${c.hours} horas`, 0, 335, { align: 'center' });

  const date = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(c.completedAt);
  doc.fontSize(11).fillColor('#0f172a');
  doc.text(date, 110, H - 130, { width: 220, align: 'center' });
  doc.moveTo(110, H - 110).lineTo(330, H - 110).stroke('#94a3b8');
  doc.fillColor('#64748b').text('Fecha', 110, H - 102, { width: 220, align: 'center' });

  doc.fillColor('#0f172a').text(c.instructor, W - 330, H - 130, { width: 220, align: 'center' });
  doc.moveTo(W - 330, H - 110).lineTo(W - 110, H - 110).stroke('#94a3b8');
  doc.fillColor('#64748b').text('Instructor', W - 330, H - 102, { width: 220, align: 'center' });

  doc.fillColor('#94a3b8').fontSize(9)
    .text(`Código de verificación: ${c.code}  ·  ${env.CLIENT_URL}`, 0, H - 55, { align: 'center' });
  doc.end();
}
