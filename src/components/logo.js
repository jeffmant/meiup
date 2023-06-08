import { useMediaQuery } from '@mui/material'
import Image from 'next/image'

export const Logo = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  return (
    <Image
      src={lgUp ? '/assets/meumei-logo.png' : '/assets/meumei-icon.png'}
      width={224}
      height={50}
      alt='meumei Logo'
    />
  )
}
