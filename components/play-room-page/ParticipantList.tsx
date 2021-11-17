import { VFC } from 'react';
import { IParticipant } from '@/typings/db';

interface IProps {
  participantData: IParticipant[];
  myRole: string;
  onClickKick: (userId: number) => void;
  isPlaying: boolean;
}

const ParticipantList: VFC<IProps> = ({
  participantData,
  myRole,
  onClickKick,
  isPlaying,
}) => (
  <div className="w-full h-full bg-sky-200 space-y-1">
    관전자 목록입니다.
    {participantData.map((item) => (
      <div
        key={item.key}
        className="px-2 flex justify-between"
      >
        {`${item.role} : ${item.nickname}`}
        {myRole === 'player1' && item.role !== 'player1' && item.nickname !== '' ? (
          <button
            type="button"
            disabled={isPlaying}
            onClick={() => onClickKick(item.userId)}
            className={`${isPlaying ? 'bg-gray-500' : 'bg-red-400'} rounded-md`}
          >
            강퇴
          </button>
        ) : <></>}
      </div>
    ))}
  </div>
);

export default ParticipantList;
