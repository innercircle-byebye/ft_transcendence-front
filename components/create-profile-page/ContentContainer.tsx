import React from 'react';
import type { FC } from 'react';

const ContentContainer: FC = ({ children }) => (
  <div
    className="bg-white shadow-md rounded-full px-8 pt-6 pb-8 mb-4 w-full flex flex-col items-center justify-evenly"
    style={{ width: '672px', height: '672px' }}
  >
    {children}
  </div>
);

export default ContentContainer;
