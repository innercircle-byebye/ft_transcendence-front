import { VFC } from 'react';
import { IUser } from '@/typings/db';

interface IProps {
  friendData: IUser;
  listType?: string;
}

const FriendItem: VFC<IProps> = ({ friendData, listType }) => {
  // const [isPlayerOne, setIsPlayerOne] = useState<boolean | null>(null);
  // const [result, setResult] = useState<string | null>(null);

  // useEffect(() => {
  //   if (name) {
  //     if (name === historyData.playerOneNickname) {
  //       setIsPlayerOne(true);
  //     } else {
  //       setIsPlayerOne(false);
  //     }
  //   }
  // }, [historyData.playerOneId, historyData.playerOneNickname, name]);

  // useEffect(() => {
  //   if (isPlayerOne !== null) {
  //     if (isPlayerOne && historyData.playerOneScore > historyData.playerTwoScore) {
  //       setResult('승');
  //     } else {
  //       setResult('패');
  //     }
  //   }
  // }, [historyData.playerOneScore, historyData.playerTwoScore, isPlayerOne]);

  console.log(`${friendData.nickname} ${friendData.status}`);

  return (
    <div className="bg-amber-50 text-xl rounded-md px-5 py-2 grid grid-cols-6 justify-items-center">
      <span>
        {friendData.nickname}
      </span>
      <span>
        {listType !== 'blockedList' ? friendData.status : null}
      </span>
      <span>
        {listType === 'friendNewList' ? '요청 수락하기' : ''}
      </span>
      <span>
        {
          (() => {
            if (listType !== 'blockedList') {
              if (friendData.status === 'online') return ('게임신청');
              if (friendData.status === 'in_game') return ('관전하기');
            }
            return (null);
          })()
        }
      </span>
      <span>
        {listType === 'blockedList' ? '차단하기' : null}
      </span>
    </div>
  );
};
export default FriendItem;
