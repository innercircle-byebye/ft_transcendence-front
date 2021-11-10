import React, { useState, VFC } from 'react';

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
          onClick={() => handleClick('friendReceivedList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendReceivedList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          요청받은 친구목록
        </button>
        <button
          type="button"
          onClick={() => handleClick('friendSentList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendSentList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          요청보낸 친구목록
        </button>
        <button
          type="button"
          onClick={() => handleClick('friendBlockedList')}
          className={`px-5 py-2 text-white text-xl rounded-t-md ${clickedItem === 'friendBlockedList' ? 'bg-sky-300' : 'bg-sky-700'}`}
        >
          차단 목록
        </button>
      </div>
      <div className="bg-sky-700 p-5 space-y-5 rounded-r-md rounded-bl-md">
        {clickedItem === 'friendList' ? 'friendList' : null}
        {clickedItem === 'friendReceivedList' ? 'friendReceivedList' : null}
        {clickedItem === 'friendSentList' ? 'friendSentList' : null}
        {clickedItem === 'friendBlockedList' ? 'friendBlockedList' : null}
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
