import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

import { getGlobalMessages } from '@/api';
import { SendGlobalModal } from '@/components/Dialog';
import { ImageFill, Container } from '@/components/Utils';
import { Layout, GlobalPost, BottomNavbar } from '@/components';
import { InboxProvider, useInboxContext } from '@/contexts/InboxContext';
import type { NextPageWithLayout } from '..';

const AdContainer = dynamic(() => import('@/components/AdContainer'), {
  ssr: false,
});

const Global: NextPageWithLayout = () => {
  const [pageNo, setPageNo] = useState(1);
  const [cursorId, setCursorId] = useState('');
  const [sendGlobalModal, setSendGlobalModal] = useState(false);

  const { user, isUserLoading } = useInboxContext();
  const { data } = useSession();

  const queryArgs = { userId: user?.id ?? '', cursorId };

  const { data: messages, isLoading } = useQuery(
    ['global_messages', queryArgs],
    () => getGlobalMessages(queryArgs),
    {
      select: (data) => data.getGlobalMessages,
    }
  );

  if (isUserLoading || isLoading) {
    return (
      <div className='mt-52 flex justify-center'>
        <span className='loader-2' />
      </div>
    );
  }

  return (
    <>
      <SendGlobalModal
        isOpen={sendGlobalModal}
        setIsOpen={setSendGlobalModal}
      />

      <section className='mx-auto max-w-lg pb-52'>
        <Container className='flex flex-col mb-12'>
          <div className='bg-secondary-200 p-8 rounded-2xl'>
            <div className='relative inline-block'>
              <p className='mb-4 text-base text-secondary-400'>
                Global Messages
              </p>
              <p className='absolute -top-2 -right-12 text-[10px] font-bold bg-primary-200 rounded-full px-2 tracking-wide'>
                BETA
              </p>
            </div>

            <div className='flex gap-x-2 items-center'>
              <ImageFill
                alt='profile picture'
                src={data?.user?.image}
                unoptimized
                className='border-secondary-100 h-[45px] w-[45px] object-cover rounded-full border flex-none'
              />

              <button
                type='button'
                onClick={() => setSendGlobalModal(true)}
                className='rounded-full w-full bg-secondary-100 px-6 py-3 text-secondary-400 text-left'
              >
                Send a global message &rarr;
              </button>
            </div>
          </div>
        </Container>

        <AdContainer slotId='7607907295' className='mb-4' />

        <div className='space-y-12 pt-12'>
          {messages?.map((m) => (
            <GlobalPost message={m} key={m.id} />
          ))}
        </div>

        {!isLoading && messages && messages?.length > 0 && (
          <Container
            className={`flex mt-4 ${
              cursorId ? 'justify-between' : 'justify-end'
            }`}
          >
            {cursorId && (
              <button
                className='hover:underline'
                onClick={() => {
                  setPageNo(1);
                  setCursorId('');
                }}
                type='button'
              >
                &larr; Latest
              </button>
            )}

            {cursorId && <p>{pageNo}</p>}

            {messages.length === 10 && (
              <button
                className='hover:underline'
                onClick={() => {
                  setPageNo(cursorId ? pageNo + 1 : 2);
                  setCursorId(messages?.length ? messages[9]?.id! : '');
                }}
                type='button'
              >
                More &rarr;
              </button>
            )}
          </Container>
        )}

        <BottomNavbar />
      </section>
    </>
  );
};

Global.getLayout = (page: React.ReactElement) => {
  return (
    <InboxProvider>
      <Layout>{page}</Layout>
    </InboxProvider>
  );
};

export default Global;
