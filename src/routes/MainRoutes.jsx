import React, { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SuratMasuk = Loadable(lazy(() => import('views/Surat/SuratMasuk')));
const SuratKeluar = Loadable(lazy(() => import('views/Surat/SuratKeluar')));
const Anggota = Loadable(lazy(() => import('views/Anggota/Index')));
const Keuangan = Loadable(lazy(() => import('views/Keuangan/Index')));
const Arsip = Loadable(lazy(() => import('views/Arsip/Index')));
const Tagihan = Loadable(lazy(() => import('views/Keuangan/Tagihan')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },

    { path: '/utils/util-typography', element: <UtilsTypography /> },
    { path: '/surat-masuk', element: <SuratMasuk /> },
    { path: '/surat-keluar', element: <SuratKeluar /> },
    { path: '/anggota', element: <Anggota /> },
    { path: '/keuangan', element: <Keuangan /> },
    { path: '/arsip', element: <Arsip /> },
    { path: '/tagihan', element: <Tagihan /> }
  ]
};

export default MainRoutes;
