import { FC } from 'react';

interface IProps {
  isPrivate: boolean;
  title: string
}

const ContentContainerWithTitle: FC<IProps> = ({ isPrivate, title, children }) => (
  <div className="flex flex-col items-center space-y-20">
    <div className="grid grid-cols-7 justify-items-start mt-20">
      {isPrivate && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="col-span-1 h-10 w-10"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
      )}
      <div className="col-start-2 col-span-6 text-5xl">
        {title}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-10 items-center">
      {children}
    </div>
  </div>
);

export default ContentContainerWithTitle;
