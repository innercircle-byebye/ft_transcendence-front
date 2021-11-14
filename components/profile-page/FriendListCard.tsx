import React, { useCallback, useState, VFC } from 'react';
import BlockedList from './BlockedList';
import FriendList from './FriendList';
import FriendNewList from './FriendNewList';
import FriendWaitList from './FriendWaitList';

const FriendListCard: VFC = () => {
  const [clickedItem, setClickedItem] = useState('friendList');

  const handleClick = useCallback((e: any, list: string) => {
    e.preventDefault();
    setClickedItem(list);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-4">
        <button
          type="button"
          onClick={(e) => handleClick(e, 'friendList')}
          className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
        >
          친구 목록
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 'friendNewList')}
          className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendNewList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
        >
          요청받은 친구목록
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 'friendWaitList')}
          className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'friendWaitList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
        >
          요청보낸 친구목록
        </button>
        <button
          type="button"
          onClick={(e) => handleClick(e, 'blockedList')}
          className={`px-5 py-2 text-xl rounded-t-md ${clickedItem === 'blockedList' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-700'}`}
        >
          차단 목록
        </button>
      </div>
      <div className="bg-sky-700 p-5 space-y-5 rounded-bl-md">
        <FriendList show={clickedItem === 'friendList'} />
        <FriendNewList show={clickedItem === 'friendNewList'} />
        <FriendWaitList show={clickedItem === 'friendWaitList'} />
        <BlockedList show={clickedItem === 'blockedList'} />
      </div>
    </div>
  );
};

export default FriendListCard;
