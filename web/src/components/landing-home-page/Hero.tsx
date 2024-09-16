import Image from 'next/image';
import Button from './Button';

const Hero = () => {
  return (
    <section className=' max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row'>
      {/* <div className='hero-map' /> */}

      <div className='relative z-20 flex flex-1 flex-col xl:w-1/2 items-center'>
        {/* <Image 
          src="/camp.svg"
          alt="camp"
          width={50}
          height={50}
          className="absolute left-[-5px] top-[-30px] w-10 lg:w-[50px]"
        /> */}
        <h1 className='bold-52 lg:bold-88 font-sans text-center'>
          Empowering <span className='text-green-700'>Informed</span> Choices
        </h1>
        <p className='regular-16 mt-6 text-center text-gray-30 xl:max-w-[520px]'>
          Better Health is a Gen AI-powered platform that provides personalized,
          verified insights into the health and environmental impact of consumer
          goods, promoting conscious and sustainable choices.
        </p>

        <div className=' flex flex-col w-full gap-3 sm:flex-row items-center justify-center mt-5'>
          {/* <Button type='button' title='Get Started' variant='btn_green' icon='/right-arrow.svg' /> */}
          <Button
            type='button'
            title='Get Started'
            icon='/right-arrow.svg'
            variant='btn_green'
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
