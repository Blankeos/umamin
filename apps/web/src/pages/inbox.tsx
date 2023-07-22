import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { IoIosCopy } from 'react-icons/io';
import { useSession } from 'next-auth/react';
import { RiSettings3Fill } from 'react-icons/ri';

import { useLogEvent } from '@/hooks';
import { SettingsDialog } from '@/components/Dialog';
import { Layout, Create, ImageFill } from '@/components';
import { Recent, Seen, Sent } from '@/components/InboxTabs';
import { InboxProvider, useInboxContext } from '@/contexts/InboxContext';
import type { NextPageWithLayout } from '..';

const AdContainer = dynamic(() => import('@/components/AdContainer'), {
  ssr: false,
});

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const Inbox: NextPageWithLayout = () => {
  const { push } = useRouter();
  const [settingsModal, setSettingsModal] = useState(false);

  const { user, isUserLoading } = useInboxContext();
  const { data, status } = useSession();
  const triggerEvent = useLogEvent();

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/to/${user?.username}`
    );
    toast.success('Copied to clipboard');

    triggerEvent('copy_link');
  };

  const categories = [
    {
      title: 'Recent',
      Component: Recent,
    },
    {
      title: 'Old',
      Component: Seen,
    },
    {
      title: 'Sent',
      Component: Sent,
    },
  ];

  if (status === 'unauthenticated') {
    push('/login');
  }

  if (isUserLoading) {
    return (
      <div className='mt-52 flex justify-center'>
        <span className='loader-2' />
      </div>
    );
  }

  return (
    <section className='mx-auto max-w-lg'>
      {!user?.username ? (
        <Create />
      ) : (
        <>
          <SettingsDialog isOpen={settingsModal} setIsOpen={setSettingsModal} />

          <div className='mb-5 flex w-full items-center justify-between px-4'>
            <ImageFill
              alt='profile picture'
              src={data?.user?.image}
              unoptimized
              className='dark:border-secondary-100 h-[80px] w-[80px] object-cover rounded-full border-2 border-gray-400 sm:h-[120px] sm:w-[120px]'
            />
            <div className='flex flex-col items-end gap-2'>
              <div className='flex items-center gap-4'>
                <p className='text-lg md:text-xl'>{user?.username}</p>
                <button
                  onClick={() => setSettingsModal(true)}
                  type='button'
                  className='dark:border-secondary-100 flex items-center gap-3 rounded-lg border-2 border-gray-400 px-4 py-2'
                >
                  <p>Settings</p>
                  <RiSettings3Fill className='text-primary-100 flex-none' />
                </button>
              </div>

              <button
                type='button'
                onClick={copyLink}
                className='dark:border-secondary-100 flex items-center justify-center gap-3 truncate rounded-lg border-2 border-gray-400 px-4 py-2'
              >
                <p>
                  {window.location.host}/to/{user?.username}
                </p>
                <IoIosCopy className='text-primary-100 flex-none' />
              </button>
            </div>
          </div>

          <div className='w-full pb-16'>
            <AdContainer slotId='7607907295' className='mb-4' />
            <Tab.Group>
              <Tab.List className='mb-4 flex space-x-6'>
                {categories.map(({ title }) => (
                  <Tab
                    key={title}
                    className={({ selected }) =>
                      classNames(
                        'rounded-full py-2 px-8 font-semibold text-white outline-none',
                        selected
                          ? 'bg-primary-200'
                          : 'text-[#8B8B8B]'
                      )
                    }
                  >
                    {title}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className='mt-2'>
                {categories.map(({ title, Component }) => (
                  <Tab.Panel key={title}>
                    <Component />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
      )}
    </section>
  );
};

Inbox.getLayout = (page: React.ReactElement) => {
  return (
    <InboxProvider>
      <Layout>{page}</Layout>
    </InboxProvider>
  );
};

export default Inbox;
