import {
  Dispatch, SetStateAction, useCallback, useEffect, useState, VFC,
} from 'react';

interface IProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  paginationRange: number;
  color: string;
}

const Pagination: VFC<IProps> = ({
  page, setPage, totalPage, paginationRange, color,
}) => {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(totalPage < paginationRange ? totalPage : paginationRange);
  const [paginationTexts, setPaginationTexts] = useState<string[]>([]);

  const onClickPageNum = useCallback((pageNum: string) => {
    setPage(+pageNum);
  }, [setPage]);

  const onClickPrevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page, setPage]);

  const onClickNextPage = useCallback(() => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  }, [page, setPage, totalPage]);

  const onClickPrevPageSet = useCallback(() => {
    const nextPage = parseInt(`${(page - paginationRange - 1) / paginationRange}`, 10) * paginationRange + 1;
    if (nextPage < 1) return;
    setStartPage(nextPage);
    setPage(nextPage);
  }, [page, paginationRange, setPage]);

  const onClickNextPageSet = useCallback(() => {
    const nextPage = parseInt(`${(page + paginationRange - 1) / paginationRange}`, 10) * paginationRange + 1;
    if (nextPage > totalPage) return;
    setStartPage(nextPage);
    setPage(nextPage);
  }, [page, paginationRange, setPage, totalPage]);

  const getPaginaiontLinkTexts = useCallback(() => {
    const newPagenationTexts = [];
    for (let i = startPage; i <= endPage; i += 1) {
      newPagenationTexts.push(`${i}`);
    }
    return newPagenationTexts;
  }, [endPage, startPage]);

  useEffect(() => {
    setStartPage(parseInt(`${(page - 1) / paginationRange}`, 10) * paginationRange + 1);
  }, [page, paginationRange, startPage]);

  useEffect(() => {
    setEndPage(startPage + paginationRange - 1 > totalPage
      ? totalPage : startPage + paginationRange - 1);
  }, [paginationRange, startPage, totalPage]);

  useEffect(() => {
    if (totalPage === 0) return;
    setPaginationTexts(getPaginaiontLinkTexts());
  }, [getPaginaiontLinkTexts, startPage, totalPage]);

  return (
    <div className="inline-block rounded-md border border-gray-50 overflow-hidden bg-gray-50">
      <button type="button" onClick={onClickPrevPageSet}>
        <span className={`mx-px px-2 py-1 bg-${color}-700 text-white`}>{'<<'}</span>
      </button>
      <button type="button" onClick={onClickPrevPage}>
        <span className={`mx-px px-2 py-1 bg-${color}-700 text-white`}>{'<'}</span>
      </button>
      {paginationTexts.map((paginationText) => (
        <button key={paginationText} type="button" onClick={() => onClickPageNum(paginationText)}>
          <span className={`mx-px px-2 py-1 ${page === +paginationText ? `bg-sky-200 text-${color}-700` : `bg-${color}-700 text-white`}`}>
            {paginationText}
          </span>
        </button>
      ))}
      <button type="button" onClick={onClickNextPage}>
        <span className={`mx-px px-2 py-1 bg-${color}-700 text-white`}>{'>'}</span>
      </button>
      <button type="button" onClick={onClickNextPageSet}>
        <span className={`mx-px px-2 py-1 bg-${color}-700 text-white`}>{'>>'}</span>
      </button>
    </div>
  );
};

export default Pagination;
