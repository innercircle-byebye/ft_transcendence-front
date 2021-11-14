import React, { forwardRef, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import type { MutableRefObject } from 'react';

import RankItem from './RankItem';
import type { IRank } from '@/typings/db';

interface IProps {
  rankData: IRank[];
  setSize: (f: (size: number) => number) => Promise<IRank[][] | undefined>;
  isReachingEnd: boolean;
}

const RankList = forwardRef<Scrollbars, IProps>(
  ({ rankData, setSize, isReachingEnd }, scrollRef) => {
    const onScroll = useCallback(
      (values) => {
        if (values.top === 1 && !isReachingEnd) {
          setSize((prevSize) => prevSize + 1).then(() => {
            const current = (scrollRef as MutableRefObject<Scrollbars>)
              ?.current;
            if (current) {
              current.scrollTop(
                current.getScrollHeight() - values.scrollHeight,
              );
            }
          });
        }
      },
      [isReachingEnd, scrollRef, setSize],
    );

    return (
      <div className="flex-1 flex-col h-full">
        <div className="rounded-md px-5 py-2 grid grid-cols-4 justify-items-center mx-3 text-xl bg-sky-700 text-white">
          <span>순위</span>
          <span>닉네임</span>
          <span>승/패</span>
          <span>승률</span>
        </div>
        <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
          {rankData.map((data, index) => (
            <RankItem key={data.user.userId} rankData={data} rankNumber={index + 1} />
          ))}
        </Scrollbars>
      </div>
    );
  },
);

RankList.displayName = 'RankList';

export default RankList;
