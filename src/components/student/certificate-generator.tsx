
'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useUser } from "@/firebase";

interface CertificateGeneratorProps {
  courseName: string;
}

// Extend jsPDF interface to include autoTable method for TypeScript
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export function CertificateGenerator({ courseName }: CertificateGeneratorProps) {
  const { user } = useUser();
  const studentName = user?.displayName || "Formando";

  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Borders
    doc.setDrawColor(33, 150, 243); // Primary color
    doc.setLineWidth(2);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    // 2. Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 150, 243);
    doc.text("CONEXÃO ACADÊMICA", pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Formação e Consultoria", pageWidth / 2, 32, { align: 'center' });

    // 3. Main Title
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 52, 98); // Dark blue color
    doc.text("CERTIFICADO", pageWidth / 2, 60, { align: 'center' });
    doc.setFontSize(18);
    doc.text("CERTIFICATE", pageWidth / 2, 70, { align: 'center' });

    // 4. Main Body Text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const bodyText = `Certificamos que, para os devidos efeitos, o(a) formando(a):`;
    doc.text(bodyText, pageWidth / 2, 120, { align: 'center' });

    // 5. Student Name
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, pageWidth / 2, 140, { align: 'center' });
    
    // 6. Course Conclusion Text
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const courseText = `Concluiu com sucesso a formação em:`;
    doc.text(courseText, pageWidth / 2, 160, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(courseName, pageWidth / 2, 175, { align: 'center' });
    
    // 7. Signature Line
    doc.setLineWidth(0.5);
    doc.line(70, 220, pageWidth - 70, 220);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("A Direção Pedagógica", pageWidth / 2, 225, { align: 'center' });

    // 8. Footer with logos (as text placeholders)
    doc.setFontSize(8);
    doc.text("ANPG | mirempet | AMPP | STCW | nebosh | SpRAT | IADC | CompTIA | ISO", pageWidth / 2, pageHeight - 15, { align: 'center' });

    // 9. Save the PDF
    doc.save(`Certificado_${courseName.replace(/ /g, '_')}_${studentName.replace(/ /g, '_')}.pdf`);
  };

  return (
    <Button variant="default" size="sm" onClick={generatePdf}>
      <Download className="mr-2 h-4 w-4" /> Emitir
    </Button>
  );
}
