import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { footerItems } from '@/constants';

export const Footer = () => {
  return (
    <footer className='contain pb-12'>
      <div className='mb-12 h-[2px] bg-secondary-100' />

      <div className='flex flex-wrap gap-y-16 gap-x-24 sm:justify-between'>
        <ul className='flex flex-col gap-4'>
          <p className='font-medium text-gray-500'>Project</p>
          {footerItems.project.map((item) => (
            <Link href={item.href} key={item.name}>
              <a className='transition-colors hover:text-gray-300'>
                {item.name}
              </a>
            </Link>
          ))}
        </ul>

        <ul className='flex flex-col gap-4'>
          <p className='font-medium text-gray-500'>Contribute</p>
          {footerItems.contribute.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-gray-300'
            >
              {item.name}
            </a>
          ))}
        </ul>

        <div className='flex flex-col gap-4'>
          <p className='font-medium text-gray-500'>Contact</p>
          <a
            href='mailto:contact@joshxfi.tech'
            className='transition-colors hover:text-gray-300'
          >
            contact@joshxfi.tech
          </a>
        </div>

        <div className='relative hidden h-6 w-32 sm:block'>
          <Image src='/assets/logo.svg' layout='fill' objectFit='contain' />
        </div>
      </div>

      <div className='mt-20 flex flex-col items-center'>
        <div className='relative mb-4 h-6 w-32 sm:hidden'>
          <Image src='/assets/logo.svg' layout='fill' objectFit='contain' />
        </div>
        <p className='text-xs font-medium text-gray-500 sm:text-sm md:text-base'>
          Created with 💖 by{' '}
          <a
            href='https://github.com/joshxfi'
            target='_blank'
            rel='noreferrer noopener'
            className='hover:underline'
          >
            Josh Daniel Bañares
          </a>{' '}
          &{' '}
          <a
            href='https://github.com/joshxfi/umamin/graphs/contributors'
            target='_blank'
            rel='noreferrer noopener'
            className='hover:underline'
          >
            Contributors
          </a>
        </p>
      </div>
    </footer>
  );
};
