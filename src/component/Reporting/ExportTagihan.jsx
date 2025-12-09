// ExportTagihan.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import LogoULMImg from '../../assets/images/Logo ULM.png';
import LogoAsramaImg from '../../assets/images/Logo Asrama.png';
import TTD1Img from '../../assets/images/TTD1.png';
import TTD2Img from '../../assets/images/TTD2.png';

/**
 * Fungsi untuk menghasilkan surat tagihan berformat formal
 * dan menampilkannya di browser (preview PDF, bukan langsung download)
 */
const ExportTagihan = async (dataTagihan) => {
  // ====== NOMOR SURAT OTOMATIS ======
  const lastNumber = parseInt(localStorage.getItem('nomorSuratTagihan') || '0', 10);
  const nextNumber = lastNumber + 1;
  localStorage.setItem('nomorSuratTagihan', nextNumber.toString());

  // ====== KONVERSI BULAN KE ROMAWI ======
  const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const bulanSaatIni = new Date().getMonth();
  const bulanRomawiSekarang = bulanRomawi[bulanSaatIni];
  const tahunSekarang = new Date().getFullYear();

  const nomorSurat = `${String(nextNumber).padStart(3, '0')}/ST/AW-I/${bulanRomawiSekarang}/${tahunSekarang}`;

  const doc = new jsPDF('p', 'mm', 'a4');

  const tanggal = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // ====== HITUNG JATUH TEMPO (7 HARI SETELAH SURAT DIEKSPORT) ======
  const jatuhTempoDate = new Date();
  jatuhTempoDate.setDate(jatuhTempoDate.getDate() + 7);
  const jatuhTempoFormatted = jatuhTempoDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // ====== LOAD GAMBAR (LOGO & TTD) ======
  const loadImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const [logoULM, logoAsrama, ttdFawwaz, ttdAgus] = await Promise.all([
    loadImageAsBase64(LogoULMImg),
    loadImageAsBase64(LogoAsramaImg),
    loadImageAsBase64(TTD1Img),
    loadImageAsBase64(TTD2Img)
  ]);

  // ====== KOP SURAT ======
  doc.addImage(logoULM, 'PNG', 18, 10, 20, 20); // kiri
  doc.addImage(logoAsrama, 'PNG', 172, 10, 20, 20); // kanan

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('UNIVERSITAS LAMBUNG MANGKURAT', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('ASRAMA MAHASISWA ULM WASAKA-1', 105, 22, { align: 'center' });
  doc.text('BANJARBARU', 105, 28, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Alamat: Jl. Unlam I No.13 Banjarbaru, Kalimantan Selatan 70713', 105, 33, { align: 'center' });
  doc.setLineWidth(0.6);
  doc.line(15, 36, 195, 36);

  // ====== IDENTITAS SURAT ======
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.text(`Banjarbaru, ${tanggal}`, 140, 45);
  doc.text(`Nomor   : ${nomorSurat}`, 15, 55);
  doc.text('Perihal : Status Pembayaran Penghuni Asrama', 15, 60);

  // ====== TUJUAN SURAT ======
  doc.text('Kepada Yth.', 15, 78);
  doc.text('Seluruh Penghuni Asrama ULM Wasaka-1', 15, 84);
  doc.text('Di-', 15, 90);
  doc.text('Tempat', 25, 90);

  // ====== PEMBUKAAN ======
  doc.text('Assalamu’alaikum Wr. Wb.', 15, 103);
  doc.text('Dengan hormat,', 15, 110);
  doc.setFontSize(11);
  doc.text(
    'Bersama dengan surat ini, kami pengurus Asrama Wasaka-1 Universitas Lambung Mangkurat memberitahukan bahwa berikut merupakan rincian status pembayaran iuran bulanan asrama untuk seluruh penghuni.',
    15,
    118,
    { maxWidth: 180, align: 'justify' }
  );

  // ====== TABEL TAGIHAN (TANPA KOLOM JATUH TEMPO) ======
  const tableColumn = ['No', 'Periode', 'Nama Penghuni', 'Kamar', 'Jumlah (Rp)', 'Status'];
  const tableRows = [];

  if (!dataTagihan || dataTagihan.length === 0) {
    tableRows.push(['-', '-', 'Data tagihan tidak tersedia', '-', '-', '-']);
  } else {
    dataTagihan.forEach((row, index) => {
      const formatPeriode = (periodeStr) => {
        if (!periodeStr) return '-';
        const [year, month] = periodeStr.split('-');
        const date = new Date(`${year}-${month}-01`);
        return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      };

      tableRows.push([
        index + 1,
        formatPeriode(row.periode),
        row.nama_penghuni,
        row.id_kamar,
        `Rp ${Number(row.jumlah).toLocaleString('id-ID')}`,
        row.status
      ]);
    });
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 135,
    styles: { fontSize: 9, font: 'times', cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], halign: 'center' },
    bodyStyles: { halign: 'center' }
  });

  // ====== PENUTUP ======
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(
    `Demikian surat ini kami sampaikan. Diharapkan kepada seluruh penghuni asrama yang masih belum melunasi iuran bulanannya agar segera melakukan pelunasan hingga tanggal ${jatuhTempoFormatted}. Jika masih belum bisa melunasi hingga tanggal yang telah ditentukan, harap konfirmasi untuk alasan yang jelas. Apabila tidak melunasi tanpa konfirmasi yang jelas maka akan diberikan surat peringatan sesuai ketentuan yang berlaku.`,
    15,
    finalY,
    { maxWidth: 180, align: 'justify' }
  );

  const ttdY = finalY + 20;
  doc.text('Wassalamu’alaikum Wr. Wb.', 15, ttdY);

  // ====== TANDA TANGAN ======
  const signY = ttdY + 15;
  doc.text('Hormat kami,', 140, signY);
  doc.text('Pengurus Asrama Wasaka-1', 140, signY + 6);

  doc.text('Ketua,', 35, signY + 20);
  doc.text('Sekretaris,', 140, signY + 20);

  // Gambar tanda tangan
  doc.addImage(ttdFawwaz, 'PNG', 25, signY + 25, 35, 18);
  doc.addImage(ttdAgus, 'PNG', 135, signY + 25, 35, 18);

  doc.text('(Fawwaz)', 32, signY + 47);
  doc.text('NIM. 2010715310007', 25, signY + 52);

  doc.text('(Agus Teguh Riadi)', 140, signY + 47);
  doc.text('NIM. 2111016110011', 135, signY + 52);

  // ====== FOOTER ======
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text('Asrama Mahasiswa ULM Wasaka-1 | Universitas Lambung Mangkurat | Email: wasaka1@ulm.ac.id', 105, 290, { align: 'center' });

  // ====== PREVIEW PDF (BUKAN DOWNLOAD LANGSUNG) ======
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};

export default ExportTagihan;
