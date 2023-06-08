import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      src='/assets/meumei-logo.png'
      width={158}
      height={35}
      alt='meumei Logo'
    />
  )
}
