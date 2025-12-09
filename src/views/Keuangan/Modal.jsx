import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { create, edit } from "../../services/TagihanAPI";
import { getAll } from "../../services/AnggotaAPI";

// 🧩 Helper Functions
const formatDate = (date) => date.toISOString().split("T")[0];
const getDueDate = (startDate) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + 10);
  return formatDate(date);
};
const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const Modal = ({ isOpen, onClose, onSuccess, editData }) => {
  const [tagihan, setTagihan] = useState({
    id_tagihan: "",
    id_penghuni: "",
    id_kamar: "",
    periode: "",
    jumlah: "",
    status: "Belum",
    tgl_tagihan: "",
    jatuh_tempo: "",
  });

  const [anggotaList, setAnggotaList] = useState([]);

  useEffect(() => {
    if (editData) {
      setTagihan({
        id_tagihan: editData.id_tagihan || "",
        id_penghuni: editData.id_penghuni || "",
        id_kamar: editData.id_kamar || "",
        periode: editData.periode || "",
        jumlah: editData.jumlah || "",
        status: editData.status || "Belum",
        tgl_tagihan: editData.tgl_tagihan || "",
        jatuh_tempo: editData.jatuh_tempo || "",
      });
    } else {
      const today = new Date();
      const todayStr = formatDate(today);
      const dueDateStr = getDueDate(today);
      const monthStr = getCurrentMonth();

      setTagihan({
        id_tagihan: "",
        id_penghuni: "",
        id_kamar: "",
        periode: monthStr,
        jumlah: 100000,
        status: "Belum",
        tgl_tagihan: todayStr,
        jatuh_tempo: dueDateStr,
      });
    }
  }, [editData]);

  useEffect(() => {
    fetchAnggota();
  }, []);

  const fetchAnggota = async () => {
    try {
      const res = await getAll();
      const list = res.data?.data || [];
      setAnggotaList(list);
    } catch (error) {
      console.error("❌ Gagal memuat data anggota:", error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tgl_tagihan") {
      setTagihan((prev) => ({
        ...prev,
        [name]: value,
        jatuh_tempo: getDueDate(value),
      }));
    } else {
      setTagihan((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      console.log(res);
      if (editData) {
        res = await edit(editData.id_tagihan, tagihan);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data tagihan berhasil diperbarui!",
          timer: 1500,
          showConfirmButton: false,
          width: "260px",
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: {
            popup: "small-alert",
            confirmButton: "btn-confirm-red",
            cancelButton: "btn-cancel",
          },
          
        });
      } else {
        res = await create(tagihan);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data tagihan berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
          width: "260px",
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: {
            popup: "small-alert",
            confirmButton: "btn-confirm-red",
            cancelButton: "btn-cancel",
          },
        });
      }

      if (onSuccess) await onSuccess();

      // Reset form jika tambah data
      if (!editData) {
        const today = new Date();
        const todayStr = formatDate(today);
        const dueDateStr = getDueDate(today);
        const monthStr = getCurrentMonth();

        setTagihan({
          id_tagihan: "",
          id_penghuni: "",
          id_kamar: "",
          periode: monthStr,
          jumlah: 100000,
          status: "Belum",
          tgl_tagihan: todayStr,
          jatuh_tempo: dueDateStr,
        });
      }
    } catch (error) {
      console.error("Gagal simpan:", error.response?.data || error.message);

      const serverMessage = error.response?.data?.serverMessage || "";

      // 🧩 Cek apakah error dari duplikat data
      if (serverMessage.includes("Duplicate entry")) {
        const penghuni = anggotaList.find(
          (a) => String(a.id_penghuni) === String(tagihan.id_penghuni)
        );

        const nama = penghuni ? penghuni.nama : "penghuni";
        Swal.fire({
          icon: "warning",
          title: "Tagihan Sudah Ada",
          text: `Tagihan ${nama} pada periode ${tagihan.periode} sudah ada.`,
          timer: 2000,
          showConfirmButton: false,
          width: "300px",
          backdrop: `rgba(0,0,0,0.4) blur(5px)`,
          customClass: {
            popup: "small-alert",
            confirmButton: "btn-confirm-red",
            cancelButton: "btn-cancel",
          },
        });
      } else {
        // 🧩 Error lain
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menyimpan data!",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Konten Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          {editData ? "Edit Tagihan" : "Tambah Tagihan"}
        </h2>

        <form
          className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm"
          onSubmit={handleSubmit}
        >
          {/* Nama Penghuni */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nama Penghuni
            </label>
            <select
              name="id_penghuni"
              value={tagihan.id_penghuni || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            >
              <option value="">Pilih Penghuni</option>
              {Array.isArray(anggotaList) && anggotaList.length > 0 ? (
                anggotaList.map((a, index) => (
                  <option key={a.id_penghuni || index} value={a.id_penghuni}>
                    {a.nama}
                  </option>
                ))
              ) : (
                <option disabled>Data tidak tersedia</option>
              )}
            </select>
          </div>

          {/* ID Kamar */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              No Kamar
            </label>
            <input
              type="text"
              name="id_kamar"
              value={tagihan.id_kamar}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Periode */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Periode
            </label>
            <input
              type="month"
              name="periode"
              value={tagihan.periode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              name="jumlah"
              value={tagihan.jumlah}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              name="status"
              value={tagihan.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            >
              <option value="Belum">Belum</option>
              <option value="Lunas">Lunas</option>
            </select>
          </div>

          {/* ✅ Tampilkan hanya jika tambah (bukan edit) */}
          {!editData && (
            <>
              {/* Tanggal Tagihan */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Tanggal Tagihan
                </label>
                <input
                  type="date"
                  name="tgl_tagihan"
                  value={tagihan.tgl_tagihan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  required
                />
              </div>

              {/* Jatuh Tempo */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  name="jatuh_tempo"
                  value={tagihan.jatuh_tempo}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>
            </>
          )}

          {/* Tombol */}
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm rounded-md bg-violet-500 text-white hover:bg-violet-600"
            >
              {editData ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
