import React, { useState, VFC } from 'react';
import BlockedList from './BlockedList';
import FriendList from './FriendList';
import FriendNewList from './FriendNewList';
import FriendWaitList from './FriendWaitList';

const FriendListCard: VFC = () => {
  const [clickedItem, setClickedItem] = useState('friendList');

  const handleClick = (list: string) => {
    setClickedItem(list);
  };
  return (
    <div>
      <div className="flex items-end justify-left">
        <button
          type="button"
          onClick={() => handleClick('friendList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          친구 목록
        </button>
        <button
          type="button"
          onClick={() => handleClick('friendNewList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendNewList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          요청받은 친구목록
        </button>
        <button
          type="button"
          onClick={() => handleClick('friendWaitList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendWaitList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          요청보낸 친구목록
        </button>
        <button
          type="button"
          onClick={() => handleClick('BlockedList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'BlockedList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          차단 목록
        </button>
      </div>
      <div className="bg-sky-700 p-5 space-y-5 rounded-r-md rounded-bl-md">
        {clickedItem === 'friendList' ? <FriendList /> : null}
        {clickedItem === 'friendNewList' ? <FriendNewList /> : null}
        {clickedItem === 'friendWaitList' ? <FriendWaitList /> : null}
        {clickedItem === 'BlockedList' ? <BlockedList /> : null}
        {/* <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem /> */}
      </div>
    </div>
  );
};

export default FriendListCard;
