import React, { FC } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';

const MainLayout: FC = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
);

export default MainLayout;
