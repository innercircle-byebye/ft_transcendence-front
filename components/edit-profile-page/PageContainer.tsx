import { FC } from 'react';

const PageContainer:FC = ({ children }) => (
  <div className="flex flex-1 bg-gray-200 flex-col items-center">
    {children}
  </div>
);

export default PageContainer;
