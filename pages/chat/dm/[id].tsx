import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import ChatLayout from '@/layouts/ChatLayout';

const DM = () => {
  const router = useRouter();

  return <div>dm {router.query.id}</div>;
};

DM.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default DM;
