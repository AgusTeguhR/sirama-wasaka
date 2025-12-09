<<<<<<< HEAD
'use client';
import React, { useEffect, useState } from 'react';
import { getAllPemasukan, getAllPengeluaran } from '../../services/KeuanganAPI';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, LineChart, Legend } from 'recharts';

// singkatan bulan (Bahasa Indonesia)
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// buat daftar 12 bulan terakhir (termasuk bulan sekarang)
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // "2025-11"
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`; // "Nov 25"
    months.push({ key, label, monthIndex: d.getMonth(), year: d.getFullYear() });
  }
  return months;
};

// tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md px-3 py-2 rounded-lg">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={`text-sm flex items-center gap-2 ${entry.name === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span>{entry.name === 'Pemasukan' ? '💰' : '💸'}</span>
            {entry.name}: Rp {Number(entry.value || 0).toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Grafik = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resPemasukan, resPengeluaran] = await Promise.all([getAllPemasukan(), getAllPengeluaran()]);

        const pemasukanArr = resPemasukan?.data?.data ?? resPemasukan?.data ?? [];
        const pengeluaranArr = resPengeluaran?.data?.data ?? resPengeluaran?.data ?? [];

        const months = getLast12Months();
        const map = {};
        months.forEach((m) => {
          map[m.key] = { name: m.label, Pemasukan: 0, Pengeluaran: 0 };
        });

        const safeNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };

        // agregasi pemasukan
        if (Array.isArray(pemasukanArr)) {
          pemasukanArr.forEach((it) => {
            try {
              const date = it?.periode ? new Date(it.periode) : null;
              if (!date || isNaN(date.getTime())) return;
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              if (!map[key]) return;
              map[key].Pemasukan += safeNum(it.jumlah ?? it.amount ?? 0);
            } catch (e) {
              // skip
            }
          });
        }

        // agregasi pengeluaran
        if (Array.isArray(pengeluaranArr)) {
          pengeluaranArr.forEach((it) => {
            try {
              const date = it?.periode ? new Date(it.periode) : null;
              if (!date || isNaN(date.getTime())) return;
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              if (!map[key]) return;
              map[key].Pengeluaran += safeNum(it.jumlah ?? it.amount ?? 0);
            } catch (e) {
              // skip
            }
          });
        }

        const formatted = months.map((m) => ({
          name: map[m.key].name,
          // pastikan number (Recharts membutuhkan number untuk scale)
          Pemasukan: Math.round(map[m.key].Pemasukan),
          Pengeluaran: Math.round(map[m.key].Pengeluaran)
        }));

        if (mounted) {
          // debugging: uncomment kalau mau lihat data di console
          // console.log('Grafik data:', formatted);
          setData(formatted);
        }
      } catch (err) {
        console.error('Gagal memuat data keuangan:', err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const lastData = data.length ? data[data.length - 1] : { Pemasukan: 0, Pengeluaran: 0 };

  return (
    // pastikan wrapper punya height eksplisit; Tailwind h-80 biasanya cukup,
    // namun berikan minHeight/style agar Recharts tidak collapse
    <div className="col-span-12 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-5 flex items-center gap-3 border-b border-gray-100 rounded-t-2xl">
        <div>
          <h3 className="font-semibold text-base tracking-wide">Laporan Keuangan</h3>
          <p className="text-xs">Ringkasan Pemasukan & Pengeluaran Bulanan (12 bulan terakhir)</p>
        </div>
      </div>

      {/* wrapper dengan style eksplisit untuk ukuran */}
      <div className="px-6 py-5" style={{ minHeight: 320, height: '20rem', position: 'relative' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">Memuat data...</div>
        ) : data.length > 0 ? (
          // ResponsiveContainer but ensure parent has explicit height (we set minHeight/height di atas)
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="pemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => {
                  const juta = v / 1000000;
                  return juta >= 1 ? `Rp ${juta.toFixed(1)} jt` : `Rp ${v.toLocaleString('id-ID')}`;
                }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 10, fontWeight: 500, fontSize: 12 }}
              />

              {/* jika data numeric = 0, garis tetap digambar; kalau tidak ada sama sekali, mencegah crash */}
              <Line
                type="monotone"
                dataKey="Pemasukan"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 6, fill: '#10b981' }}
                fill="url(#pemasukan)"
                fillOpacity={1}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="Pengeluaran"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ef4444' }}
                activeDot={{ r: 6, fill: '#ef4444' }}
                strokeDasharray="4 3"
                fill="url(#pengeluaran)"
                fillOpacity={1}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Tidak ada data keuangan yang tersedia</div>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-4 flex justify-between text-sm text-gray-600">
        <p className="text-gray-500">Total Bulan Terakhir:</p>
        <p className="font-semibold">
          Rp {Number(lastData.Pemasukan || 0).toLocaleString('id-ID')} Pemasukan - Rp{' '}
          {Number(lastData.Pengeluaran || 0).toLocaleString('id-ID')} Pengeluaran
        </p>
      </div>
    </div>
  );
};

export default Grafik;
=======
'use client';
import React, { useEffect, useState } from 'react';
import { getAllPemasukan, getAllPengeluaran } from '../../services/KeuanganAPI';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, LineChart, Legend } from 'recharts';

// singkatan bulan (Bahasa Indonesia)
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// buat daftar 12 bulan terakhir (termasuk bulan sekarang)
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // "2025-11"
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`; // "Nov 25"
    months.push({ key, label, monthIndex: d.getMonth(), year: d.getFullYear() });
  }
  return months;
};

// tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md px-3 py-2 rounded-lg">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={`text-sm flex items-center gap-2 ${entry.name === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span>{entry.name === 'Pemasukan' ? '💰' : '💸'}</span>
            {entry.name}: Rp {Number(entry.value || 0).toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Grafik = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resPemasukan, resPengeluaran] = await Promise.all([getAllPemasukan(), getAllPengeluaran()]);

        const pemasukanArr = resPemasukan?.data?.data ?? resPemasukan?.data ?? [];
        const pengeluaranArr = resPengeluaran?.data?.data ?? resPengeluaran?.data ?? [];

        const months = getLast12Months();
        const map = {};
        months.forEach((m) => {
          map[m.key] = { name: m.label, Pemasukan: 0, Pengeluaran: 0 };
        });

        const safeNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };

        // agregasi pemasukan
        if (Array.isArray(pemasukanArr)) {
          pemasukanArr.forEach((it) => {
            try {
              const date = it?.periode ? new Date(it.periode) : null;
              if (!date || isNaN(date.getTime())) return;
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              if (!map[key]) return;
              map[key].Pemasukan += safeNum(it.jumlah ?? it.amount ?? 0);
            } catch (e) {
              // skip
            }
          });
        }

        // agregasi pengeluaran
        if (Array.isArray(pengeluaranArr)) {
          pengeluaranArr.forEach((it) => {
            try {
              const date = it?.periode ? new Date(it.periode) : null;
              if (!date || isNaN(date.getTime())) return;
              const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              if (!map[key]) return;
              map[key].Pengeluaran += safeNum(it.jumlah ?? it.amount ?? 0);
            } catch (e) {
              // skip
            }
          });
        }

        const formatted = months.map((m) => ({
          name: map[m.key].name,
          // pastikan number (Recharts membutuhkan number untuk scale)
          Pemasukan: Math.round(map[m.key].Pemasukan),
          Pengeluaran: Math.round(map[m.key].Pengeluaran)
        }));

        if (mounted) {
          // debugging: uncomment kalau mau lihat data di console
          // console.log('Grafik data:', formatted);
          setData(formatted);
        }
      } catch (err) {
        console.error('Gagal memuat data keuangan:', err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const lastData = data.length ? data[data.length - 1] : { Pemasukan: 0, Pengeluaran: 0 };

  return (
    // pastikan wrapper punya height eksplisit; Tailwind h-80 biasanya cukup,
    // namun berikan minHeight/style agar Recharts tidak collapse
    <div className="col-span-12 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-5 flex items-center gap-3 border-b border-gray-100 rounded-t-2xl">
        <div>
          <h3 className="font-semibold text-base tracking-wide">Laporan Keuangan</h3>
          <p className="text-xs">Ringkasan Pemasukan & Pengeluaran Bulanan (12 bulan terakhir)</p>
        </div>
      </div>

      {/* wrapper dengan style eksplisit untuk ukuran */}
      <div className="px-6 py-5" style={{ minHeight: 320, height: '20rem', position: 'relative' }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">Memuat data...</div>
        ) : data.length > 0 ? (
          // ResponsiveContainer but ensure parent has explicit height (we set minHeight/height di atas)
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <defs>
                <linearGradient id="pemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={(v) => {
                  const juta = v / 1000000;
                  return juta >= 1 ? `Rp ${juta.toFixed(1)} jt` : `Rp ${v.toLocaleString('id-ID')}`;
                }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 10, fontWeight: 500, fontSize: 12 }}
              />

              {/* jika data numeric = 0, garis tetap digambar; kalau tidak ada sama sekali, mencegah crash */}
              <Line
                type="monotone"
                dataKey="Pemasukan"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 6, fill: '#10b981' }}
                fill="url(#pemasukan)"
                fillOpacity={1}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="Pengeluaran"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ef4444' }}
                activeDot={{ r: 6, fill: '#ef4444' }}
                strokeDasharray="4 3"
                fill="url(#pengeluaran)"
                fillOpacity={1}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Tidak ada data keuangan yang tersedia</div>
        )}
      </div>

      <div className="border-t border-gray-100 px-6 py-4 flex justify-between text-sm text-gray-600">
        <p className="text-gray-500">Total Bulan Terakhir:</p>
        <p className="font-semibold">
          Rp {Number(lastData.Pemasukan || 0).toLocaleString('id-ID')} Pemasukan - Rp{' '}
          {Number(lastData.Pengeluaran || 0).toLocaleString('id-ID')} Pengeluaran
        </p>
      </div>
    </div>
  );
};

export default Grafik;
>>>>>>> 02b36bfd101b72d785f910fe958186a012e6cc54
