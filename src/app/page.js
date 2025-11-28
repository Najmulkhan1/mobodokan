import React from 'react'
import Hero from '../components/(home)/Hero'
import LatestProducts from '@/components/(home)/LatestProducts'
import FeaturesMobodokan from '@/components/(home)/FeaturesMobodokan'
import TestimonialsMobodokan from '@/components/(home)/TestimonialsMobodokan'

export default function page() {
  return (
    <div>
      <Hero />
      <LatestProducts/>
      <FeaturesMobodokan />
      <TestimonialsMobodokan />
    </div>
  )
}
