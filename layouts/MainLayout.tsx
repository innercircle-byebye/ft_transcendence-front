import React, { FC } from 'react';
import Head from 'next/head';
import Navbar from '@/components/navigation-bar/Navbar';

const MainLayout: FC = ({ children }) => (
  <>
    <Head>
      <title>Pong&Chat</title>
      <meta name="description" content="Play pong game and Chat" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    <main>{children}</main>
  </>
);

export default MainLayout;
