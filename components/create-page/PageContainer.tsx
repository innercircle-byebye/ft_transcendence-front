import React from 'react';
import type { FC } from 'react';

const PageContainer: FC = ({ children }) => (
  <div className="flex-1 bg-gray-300 flex justify-center h-auto">
    {children}
  </div>
);

export default PageContainer;
