import Image from 'next/image'

export const Logo = ({ dark }) => {
  return (
    <Image
      src={dark ? '/assets/meumei-logo-dark.png' : '/assets/meumei-logo.png'}
      width={158}
      height={35}
      alt='meumei Logo'
    />
  )
}
