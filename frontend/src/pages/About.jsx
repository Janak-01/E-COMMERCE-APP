import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero incidunt atque sint corrupti. Quisquam nam maxime placeat dolores distinctio officia.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste doloremque iure ipsa molestias tenetur ex, maiores similique nisi dignissimos voluptatum ut molestiae hic reiciendis pariatur?</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis saepe numquam quo facilis corrupti laborum corporis explicabo dolorum, repudiandae ducimus est magni ipsam alias voluptates aperiam voluptatibus, vel adipisci molestiae?</p>

        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />

      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600' >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis animi voluptatum impedit odit odio et nihil iste pariatur ad obcaecati!</p>
        </div>

        <div className='px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>

          <b>Convenience:</b>
          <p className='text-gray-600' >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis animi voluptatum impedit odit odio et nihil iste pariatur ad obcaecati!</p>

        </div>

        <div className='px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>

          <b>Exception Customer Service:</b>
          <p className='text-gray-600' >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis animi voluptatum impedit odit odio et nihil iste pariatur ad obcaecati!</p>
        </div>

      </div>

      <NewsLetterBox />


    </div>
  )
}

export default About
