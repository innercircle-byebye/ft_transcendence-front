import {
  Dispatch, SetStateAction, useCallback, VFC,
} from 'react';

interface IProps {
  collapse: boolean;
  setCollapse: Dispatch<SetStateAction<boolean>>;
}

const CollapseButton: VFC<IProps> = ({ collapse, setCollapse }) => {
  const toggleCollapse = useCallback(() => {
    setCollapse((prev) => !prev);
  }, [setCollapse]);

  return (
    <button type="button" onClick={toggleCollapse} className="px-1">
      {collapse ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  );
};

export default CollapseButton;
