import type { FC } from 'react';

const ContentRight: FC = ({ children }) => (
  <div className="col-span-2 h-full">{children}</div>
);

export default ContentRight;
