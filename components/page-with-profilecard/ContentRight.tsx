import type { FC } from 'react';

interface IProps {
  bgColor?: string,
}

const ContentRight: FC<IProps> = ({ children, bgColor }) => (
  <div className={`col-span-2 h-full ${bgColor}`}>{children}</div>
);

ContentRight.defaultProps = {
  bgColor: 'bg-white',
};

export default ContentRight;
