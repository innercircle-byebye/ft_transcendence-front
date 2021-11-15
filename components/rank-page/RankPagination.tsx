import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { VFC } from 'react';

interface IProps {
  paginationData: {
    totalPage: number;
    currentPage: number;
  };
}

const getPaginaiontLinkTexts = (totalPageNumber: number) => {
  const newPaginationLinkTexts = Array.from(Array(totalPageNumber));
  return newPaginationLinkTexts.map((_, index) => (index + 1).toString());
};

const RankPagination: VFC<IProps> = ({ paginationData }) => {
  const [paginationLinkTexts, setPaginationLinkTexts] = useState<string[]>([]);

  useEffect(() => {
    if (paginationData.totalPage === 0) return;
    const newPaginationLinkTexts = getPaginaiontLinkTexts(
      paginationData.totalPage,
    );
    setPaginationLinkTexts(newPaginationLinkTexts);
  }, [paginationData.totalPage]);

  return (
    <div className="inline-block rounded-md border border-gray-50 overflow-hidden bg-gray-50">
      <Link href="/">
        <a className="mx-px px-2 py-1 bg-amber-300 text-gray-700">{'<'}</a>
      </Link>
      {paginationLinkTexts.map((paginationLinkText) => (
        <Link href="/" key={paginationLinkText}>
          <a className="mx-px px-2 py-1 bg-amber-300 text-gray-700">
            {paginationLinkText}
          </a>
        </Link>
      ))}
      <Link href="/">
        <a className="mx-px px-2 py-1 bg-amber-300 text-gray-700">{'>'}</a>
      </Link>
    </div>
  );
};

export default RankPagination;
