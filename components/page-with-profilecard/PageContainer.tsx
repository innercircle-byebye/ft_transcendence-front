import React from 'react';
import type { FC } from 'react';

interface IProps {
  maxWidth: 'xl' | 'full';
}

const pageContainerMaxWidths = {
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

const PageContainer: FC<IProps> = ({ maxWidth, children }) => (
  <div
    className={`mx-auto h-full ${pageContainerMaxWidths[maxWidth]} lg:w-10/12`}
  >
    {children}
  </div>
);

export default PageContainer;
