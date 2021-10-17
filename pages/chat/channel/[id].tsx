import ChatLayout from '@/layouts/ChatLayout';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const Channel = () => {
  const router = useRouter();

  return <div>channel {router.query.id}</div>;
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;
