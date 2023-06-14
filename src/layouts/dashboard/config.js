import ChartPieIcon from '@heroicons/react/24/solid/ChartPieIcon'
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon'
import ClipboardDocumentListIcon from '@heroicons/react/24/solid/ClipboardDocumentListIcon'
import DocumentChartBarIcon from '@heroicons/react/24/solid/DocumentChartBarIcon'
import { SvgIcon } from '@mui/material'

export const items = [
  {
    title: 'Transações',
    path: '/',
    icon: (
      <SvgIcon fontSize='small'>
        <ChartPieIcon />
      </SvgIcon>
    )
  },
  {
    title: 'NFS-e (em breve)',
    path: '/nfse',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <NewspaperIcon />
      </SvgIcon>
    )
  },
  {
    title: 'DAS (em breve)',
    path: '/das',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <ClipboardDocumentListIcon />
      </SvgIcon>
    )
  },
  {
    title: 'DASN (em breve)',
    path: '/dasn',
    disabled: true,
    icon: (
      <SvgIcon fontSize='small'>
        <DocumentChartBarIcon />
      </SvgIcon>
    )
  }
]
