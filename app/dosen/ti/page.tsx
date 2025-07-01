import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const TI = () => {
  return (
    <div>TI
        <Image src="/logo_dark.png" alt="ppmuhammadiyah" width="100" height="100"/>

        <Button variant="destructive" className='bg-sky-400'>Destructive</Button>
    </div>
  )
}

export default TI