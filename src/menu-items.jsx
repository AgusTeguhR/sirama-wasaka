/* eslint-disable */
import React from 'react';
// assets - icon imports
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// tambahan icon yang diperlukan untuk menu baru
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FormatColorTextOutlinedIcon from '@mui/icons-material/FormatColorTextOutlined';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon,
  // tambahan
  FolderOutlinedIcon: FolderOutlinedIcon,
  MailOutlineOutlinedIcon: MailOutlineOutlinedIcon,
  ArchiveOutlinedIcon: ArchiveOutlinedIcon,
  DescriptionOutlinedIcon: DescriptionOutlinedIcon,
  InsertDriveFileOutlinedIcon: InsertDriveFileOutlinedIcon,
  PeopleOutlinedIcon: PeopleOutlinedIcon,
  CreditCardOutlinedIcon: CreditCardOutlinedIcon,
  BarChartOutlinedIcon: BarChartOutlinedIcon,
  Inventory2OutlinedIcon: Inventory2OutlinedIcon,
  FormatColorTextOutlinedIcon: FormatColorTextOutlinedIcon
};

// ==============================|| MENU ITEMS ||============================== //

export default {
  items: [
    {
      id: 'main',
      title: 'Main Menu',
      caption: 'Navigation',
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard',
          icon: icons['HomeOutlinedIcon']
        },
        {
          id: 'administrasi',
          title: 'Administrasi',
          type: 'collapse',
          icon: icons['FolderOutlinedIcon'],
          children: [
            {
              id: 'surat-masuk',
              title: 'Surat',
              type: 'item',
              url: '/surat-masuk',
              icon: icons['MailOutlineOutlinedIcon']
            },
            {
              id: 'arsip-kegiatan',
              title: 'Arsip Kegiatan',
              type: 'item',
              url: '/arsip',
              icon: icons['ArchiveOutlinedIcon']
            },
            {
              id: 'lpj-pengurus',
              title: 'LPJ Pengurus',
              type: 'item',
              url: '/administrasi/lpj',
              icon: icons['DescriptionOutlinedIcon']
            },
            {
              id: 'file-asrama',
              title: 'File Asrama',
              type: 'item',
              url: '/administrasi/file',
              icon: icons['InsertDriveFileOutlinedIcon']
            }
          ]
        },
        {
          id: 'anggota',
          title: 'Anggota',
          type: 'item',
          url: '/anggota',
          icon: icons['PeopleOutlinedIcon']
        },
        {
          id: 'tagihan',
          title: 'Tagihan',
          type: 'item',
          url: '/tagihan',
          icon: icons['CreditCardOutlinedIcon']
        },
        {
          id: 'keuangan',
          title: 'Keuangan',
          type: 'item',
          url: '/keuangan',
          icon: icons['BarChartOutlinedIcon']
        },
        {
          id: 'inventaris',
          title: 'Inventarisasi',
          type: 'item',
          url: '/inventaris',
          icon: icons['Inventory2OutlinedIcon']
        }
      ]
    },
    // tetap sisakan group Utils & Support jika diperlukan di project Anda
    // {
    //   id: 'utils',
    //   title: 'Utils',
    //   type: 'group',
    //   icon: icons['AccountTreeOutlinedIcon'],
    //   children: [
    //     {
    //       id: 'util-icons',
    //       title: 'Icons',
    //       type: 'item',
    //       url: 'https://mui.com/material-ui/material-icons/',
    //       icon: icons['AppsOutlinedIcon'],
    //       external: true,
    //       target: true
    //     },
    //     {
    //       id: 'util-typography',
    //       title: 'Typography',
    //       type: 'item',
    //       url: '/utils/util-typography',
    //       icon: icons['FormatColorTextOutlinedIcon']
    //     }
    //   ]
    // },
    // {
    //   id: 'support',
    //   title: 'Support',
    //   type: 'group',
    //   icon: icons['ContactSupportOutlinedIcon'],
    //   children: [
    //     {
    //       id: 'disabled-menu',
    //       title: 'Disabled Menu',
    //       type: 'item',
    //       url: '#',
    //       icon: icons['BlockOutlinedIcon'],
    //       disabled: true
    //     },
    //     {
    //       id: 'documentation',
    //       title: 'Documentation',
    //       type: 'item',
    //       url: 'https://codedthemes.gitbook.io/materially-react-material-documentation/',
    //       icon: icons['HelpOutlineOutlinedIcon'],
    //       external: true,
    //       target: true
    //     }
    //   ]
    // }
  ]
};
