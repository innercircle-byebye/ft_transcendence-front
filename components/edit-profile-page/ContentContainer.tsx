import React from 'react';
import type { FC } from 'react';

const ContentContainer: FC = ({ children }) => (
  <div className="pt-20 flex flex-col items-center">
    <div className="text-6xl text-gray-700 pb-10">Edit Profile</div>
    {children}
  </div>
);

export default ContentContainer;
