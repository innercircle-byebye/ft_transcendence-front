import type { FC } from 'react';

const ContentContainer: FC = ({ children }) => (
  <div className="grid gap-8 grid-cols-3 py-8 h-full">{children}</div>
);

export default ContentContainer;
