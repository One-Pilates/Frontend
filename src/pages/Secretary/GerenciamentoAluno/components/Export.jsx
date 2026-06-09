import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const abrirModalDownload = async (students, calculateAge) => {
  const result = await Swal.fire({
    title: 'Exportar Relatório de Alunos',
    html: `
      <div style="text-align: left; padding: 10px;">
        <p style="margin-bottom: 15px; color: #666;">
          Selecione o formato desejado para exportar a lista de alunos:
        </p>
        <p style="font-size: 14px; color: #999;">
          Total de registros: <strong>${students.length}</strong>
        </p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    showDenyButton: true,
    denyButtonColor: '#1D6F42',
    confirmButtonText: 'Baixar PDF',
    denyButtonText: 'Baixar XLSX',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    try {
      await gerarPDF(students, calculateAge);
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Falha ao gerar PDF.');
    }
  } else if (result.isDenied) {
    try {
      gerarXLSX(students, calculateAge);
      toast.success('Excel gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar XLSX:', error);
      toast.error('Falha ao gerar Excel.');
    }
  }
};

async function gerarPDF(students, calculateAge) {
  if (!Array.isArray(students)) students = [];

  const doc = new jsPDF();
  const primaryColor = [247, 116, 51]; // #F77433 - Laranja One Pilates
  const secondaryColor = [30, 41, 59]; // Slate 900
  const lightGray = [241, 245, 249]; // Slate 100

  // Função para carregar imagem e converter para base64 com dimensões
  const getLogoData = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve({
          data: canvas.toDataURL('image/png'),
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => resolve(null);
      img.src = url;
      setTimeout(() => resolve(null), 3000);
    });
  };

  const logoInfo = await getLogoData('/logoOriginal.png');

  // --- CABEÇALHO ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 3, 'F');

  if (logoInfo) {
    try {
      const maxWidth = 40;
      const maxHeight = 15;
      let width = logoInfo.width;
      let height = logoInfo.height;

      // Mantém proporção
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      const finalW = width * ratio;
      const finalH = height * ratio;

      doc.addImage(logoInfo.data, 'PNG', 196 - finalW, 10, finalW, finalH);
    } catch (e) { console.error('Erro addImage:', e); }
  }

  doc.setFontSize(22);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Alunos', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('One Pilates Studio - Gestão Inteligente', 14, 27);

  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.1);
  doc.line(14, 32, 196, 32);

  // --- RESUMO ---
  const ativos = students.filter(a => a.status === true || a.status === 'ATIVO' || a.status === 'Ativo').length;
  const inativos = students.length - ativos;
  const limitacoes = students.filter(a => a.alunoComLimitacoesFisicas).length;

  doc.setFillColor(...lightGray);
  doc.roundedRect(14, 38, 182, 22, 2, 2, 'F');

  const drawSummaryItem = (label, value, x) => {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(label.toUpperCase(), x, 46);
    doc.setFontSize(12);
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x, 53);
  };

  drawSummaryItem('Total de Alunos', students.length, 25);
  drawSummaryItem('Alunos Ativos', ativos, 75);
  drawSummaryItem('Alunos Inativos', inativos, 120);
  drawSummaryItem('Com Limitações', limitacoes, 165);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(150, 150, 150);
  const dataAtual = new Date().toLocaleString('pt-BR');
  doc.text(`Relatório extraído em: ${dataAtual}`, 14, 68);

  // --- TABELA ---
  const tableData = students.map((aluno) => {
    const isAtivo = aluno.status === true || aluno.status === 'ATIVO' || aluno.status === 'Ativo';
    return [
      aluno.nome || aluno.nomeCompleto || '',
      aluno.email || '',
      aluno.cpf || '',
      String(calculateAge ? calculateAge(aluno.dataNascimento) : ''),
      isAtivo ? 'ATIVO' : 'INATIVO',
      aluno.alunoComLimitacoesFisicas ? 'SIM' : 'NÃO',
    ];
  });

  try {
    autoTable(doc, {
      startY: 72,
      head: [['Nome Completo', 'Email', 'CPF', 'Idade', 'Status', 'Limitações']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [252, 252, 252],
        textColor: primaryColor,
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: 50,
        cellPadding: 3,
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [254, 254, 254]
      },
      columnStyles: {
        0: { cellWidth: 55, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 50, halign: 'left' },
        2: { cellWidth: 26, halign: 'center' },
        3: { cellWidth: 14, halign: 'center' },
        4: { cellWidth: 17, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
      },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw === 'ATIVO') {
            data.cell.styles.textColor = [16, 185, 129];
          } else {
            data.cell.styles.textColor = [225, 29, 72];
          }
        }
      },
      margin: { left: 14, right: 14 },
    });
  } catch (err) {
    console.error('Erro na tabela:', err);
    doc.text('Erro ao gerar tabela. Verifique os dados.', 14, 80);
  }

  // --- RODAPÉ ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(240, 240, 240);
    doc.line(14, 285, 196, 285);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount}`, 14, 290);
    doc.text('One Pilates Studio - Relatório Confidencial', 196, 290, { align: 'right' });
  }

  doc.save(`Relatorio_Alunos_${new Date().getTime()}.pdf`);
}

function gerarXLSX(students, calculateAge) {
  if (!Array.isArray(students)) students = [];

  // Ordenar por nome alfabeticamente
  const sortedStudents = [...students].sort((a, b) => 
    (a.nome || a.nomeCompleto || '').localeCompare(b.nome || b.nomeCompleto || '')
  );

  // --- ABA 1: LISTA DETALHADA ---
  const worksheetData = sortedStudents.map((aluno, index) => ({
    '#': index + 1,
    'Nome Completo': aluno.nome || aluno.nomeCompleto || '',
    'Email': aluno.email || 'N/A',
    'Telefone': aluno.tipoContato || aluno.telefone || 'N/A',
    'CPF': aluno.cpf || 'N/A',
    'Idade': calculateAge ? calculateAge(aluno.dataNascimento) : 'N/A',
    'Data Nasc.': aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : 'N/A',
    'Status': (aluno.status === true || aluno.status === 'ATIVO' || aluno.status === 'Ativo') ? 'Ativo' : 'Inativo',
    'Limitações Físicas': aluno.alunoComLimitacoesFisicas ? 'Sim' : 'Não',
    'CEP': aluno.endereco?.cep || 'N/A',
    'Endereço': `${aluno.endereco?.rua || ''}, ${aluno.endereco?.numero || ''}`,
    'Bairro': aluno.endereco?.bairro || '',
    'Cidade/UF': `${aluno.endereco?.cidade || ''}/${aluno.endereco?.uf || ''}`,
    'Observações': aluno.observacao || aluno.observacoes || ''
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Ajuste de largura das colunas
  worksheet['!cols'] = [
    { wch: 4 },  // #
    { wch: 35 }, // Nome
    { wch: 30 }, // Email
    { wch: 15 }, // Telefone
    { wch: 15 }, // CPF
    { wch: 6 },  // Idade
    { wch: 12 }, // Data Nasc
    { wch: 10 }, // Status
    { wch: 15 }, // Limitações
    { wch: 10 }, // CEP
    { wch: 35 }, // Endereço
    { wch: 20 }, // Bairro
    { wch: 15 }, // Cidade/UF
    { wch: 40 }, // Observações
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Alunos');

  // --- ABA 2: ESTATÍSTICAS E DASHBOARD ---
  const total = students.length;
  const ativos = students.filter((a) => a.status === true || a.status === 'ATIVO' || a.status === 'Ativo').length;
  const inativos = total - ativos;
  const comLimitacao = students.filter((a) => a.alunoComLimitacoesFisicas).length;

  const statsData = [
    { Indicador: 'RELATÓRIO GERAL', Valor: '' },
    { Indicador: 'Sistema', Valor: 'One Pilates Studio' },
    { Indicador: 'Data de Extração', Valor: new Date().toLocaleString('pt-BR') },
    { Indicador: '', Valor: '' },
    { Indicador: 'KPIs DE ALUNOS', Valor: '' },
    { Indicador: 'Total de Alunos', Valor: total },
    { Indicador: 'Alunos Ativos', Valor: ativos },
    { Indicador: 'Alunos Inativos', Valor: inativos },
    { Indicador: 'Taxa de Atividade', Valor: total > 0 ? `${((ativos/total)*100).toFixed(1)}%` : '0%' },
    { Indicador: 'Alunos com Limitações', Valor: comLimitacao },
    { Indicador: 'Média de Idade', Valor: total > 0 ? (students.reduce((acc, a) => acc + (calculateAge(a.dataNascimento) || 0), 0) / total).toFixed(1) : 0 }
  ];

  const statsWorksheet = XLSX.utils.json_to_sheet(statsData);
  statsWorksheet['!cols'] = [{ wch: 30 }, { wch: 30 }];
  
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Estatísticas');

  // Salvar arquivo
  const timestamp = new Date().getTime();
  XLSX.writeFile(workbook, `Base_Alunos_OnePilates_${timestamp}.xlsx`);
}
