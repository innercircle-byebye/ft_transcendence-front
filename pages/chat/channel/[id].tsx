import ChatLayout from '@/layouts/ChatLayout';
import React, { ReactElement } from 'react';

const Channel = () => {
  return <div>channel</div>;
};

Channel.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export default Channel;
