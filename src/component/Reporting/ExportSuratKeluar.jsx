<<<<<<< HEAD
import React from "react";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { FiPrinter } from "react-icons/fi";

const ExportExcelButton = ({ data, fileName = "Data_Surat_Keluar" }) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada data",
        text: "Belum ada data untuk diekspor!",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Bentuk data yang akan diekspor
    const dataToExport = data.map((item, index) => ({
      No: index + 1,
      Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      "Nomor Surat": item.no_surat,
      "Tujuan Surat": item.tujuan,
      Perihal: item.perihal,
    }));

    // Proses export menggunakan XLSX
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Surat Keluar");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(
      dataBlob,
      `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    // Notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data Surat Keluar diekspor ke Excel!",
      timer: 1200,
      showConfirmButton: false,
      customClass: {
        popup: "small-alert",
      },
    });
  };

  return (
    <button
      onClick={exportToExcel}
      className="w-9 h-9 flex items-center justify-center rounded-md bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
      title="Export ke Excel"
    >
      <FiPrinter size={18} />
    </button>
  );
};

export default ExportExcelButton;
=======
import React from "react";
import { FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { FiPrinter } from "react-icons/fi";

const ExportExcelButton = ({ data, fileName = "Data_Surat_Keluar" }) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada data",
        text: "Belum ada data untuk diekspor!",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Bentuk data yang akan diekspor
    const dataToExport = data.map((item, index) => ({
      No: index + 1,
      Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      "Nomor Surat": item.no_surat,
      "Tujuan Surat": item.tujuan,
      Perihal: item.perihal,
    }));

    // Proses export menggunakan XLSX
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Surat Keluar");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(
      dataBlob,
      `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    // Notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data Surat Keluar diekspor ke Excel!",
      timer: 1200,
      showConfirmButton: false,
      customClass: {
        popup: "small-alert",
      },
    });
  };

  return (
    <button
      onClick={exportToExcel}
      className="w-9 h-9 flex items-center justify-center rounded-md bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
      title="Export ke Excel"
    >
      <FiPrinter size={18} />
    </button>
  );
};

export default ExportExcelButton;
>>>>>>> 02b36bfd101b72d785f910fe958186a012e6cc54
