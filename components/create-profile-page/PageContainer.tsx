import React from 'react';
import type { FC } from 'react';
import Image from 'next/image';

const PageContainer: FC = ({ children }) => (
  <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
    <div className="absolute top-5 left-5">
      <Image src="/Logo.png" alt="small-logo" width={100} height={40} />
    </div>
    {children}
  </div>
);

export default PageContainer;
