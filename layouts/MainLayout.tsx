import React, { FC } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navigation-bar/Navbar';

const MainLayout: FC = ({ children }) => (
  <div className="h-screen flex flex-col">
    <Head>
      <title>Pong&Chat</title>
      <meta name="description" content="Play pong game and Chat" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex-initial">
      <Navbar />
    </div>
    {children}
  </div>
);

export default MainLayout;
