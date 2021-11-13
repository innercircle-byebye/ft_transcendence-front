import React, { forwardRef, MutableRefObject, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { IGameResult } from '@/typings/db';
import HistoryItem from '@/components/profile-page/HistoryItem';

interface IProps {
  historyData: IGameResult[];
  setSize: (f: (size: number) => number) => Promise<IGameResult[][] | undefined>;
  isReachingEnd: boolean;
}

const HistoryList = forwardRef<Scrollbars, IProps>((
  { historyData, setSize, isReachingEnd }, scrollRef,
) => {
  const onScroll = useCallback(
    (values) => {
      if (values.top === 1 && !isReachingEnd) {
        setSize((prevSize) => prevSize + 1).then(() => {
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [isReachingEnd, scrollRef, setSize],
  );

  if (!historyData.length) {
    return <div>없습니다.</div>;
  }

  return (
    <div className="flex-1 flex-col h-full">
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {historyData.map((data) => (<HistoryItem key={data.gameResultId.toString() + data.startAt} historyData={data} textColor="text-indigo-700" />))}
      </Scrollbars>
    </div>
  );
});

HistoryList.displayName = 'HistoryList';

export default HistoryList;
