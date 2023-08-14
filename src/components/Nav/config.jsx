import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon'
import BanknotesIcon from '@heroicons/react/24/solid/BanknotesIcon'
import BookOpenIcon from '@heroicons/react/24/solid/BookOpenIcon'
import BuildingStorefrontIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon'
import UserIcon from '@heroicons/react/24/solid/UserIcon'
import { SvgIcon } from '@mui/material'

export const items = [
  {
    title: 'Início',
    path: '/',
    icon: (
      <SvgIcon fontSize='small'>
        <BuildingStorefrontIcon />
      </SvgIcon>
    )
  },
  {
    title: 'NFS-e (em breve)',
    path: '/nfse',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <ArchiveBoxIcon />
      </SvgIcon>
    )
  },
  {
    title: 'DAS (em breve)',
    path: '/das',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <BanknotesIcon />
      </SvgIcon>
    )
  },
  {
    title: 'DASN (em breve)',
    path: '/dasn',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <BookOpenIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Configurações',
    path: '/account',
    disabled: false,
    icon: (
      <SvgIcon fontSize='small'>
        <UserIcon />
      </SvgIcon>
    )
  }
]
