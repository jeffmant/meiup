import Image from 'next/image'

export const Logo = ({ dark }) => {
  return (
    <Image
      src='/assets/meiup-logo.png'
      width={158}
      height={35}
      alt='MeiUP Logo'
    />
  )
}
