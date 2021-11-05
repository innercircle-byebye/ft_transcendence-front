import React from 'react';
import type { FC } from 'react';

interface IProps {
  onClickReset: (e: any) => void;
}

const ContentContainer: FC<IProps> = ({ children, onClickReset }) => (
  <div className="pt-20 flex flex-col items-center">
    <div className="relative flex items-end space-x-4">
      <div className="text-6xl text-gray-700">Edit Profile</div>
      <button
        className="absolute -right-16 text-sky-600 font-bold rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={onClickReset}
      >
        Reset
      </button>
    </div>
    {children}
  </div>
);

export default ContentContainer;
