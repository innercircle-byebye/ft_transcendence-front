import { VFC } from 'react';
import { IParticipant } from '@/typings/db';

interface IProps {
  participantData: IParticipant[];
  myRole: string;
  onClickKick: (userId: number) => void;
}

const ParticipantList: VFC<IProps> = ({
  participantData,
  myRole,
  onClickKick,
}) => (
  <div className="w-full h-full bg-sky-200">
    관전자 목록입니다.
    {participantData.map((item) => (
      <div
        key={item.key}
        className="pl-2 flex justify-evenly"
      >
        {`${item.role} : ${item.nickname}`}
        {myRole === 'player1' ? (
          <button
            type="button"
            onClick={() => onClickKick(item.userId)}
          >
            강퇴
          </button>
        ) : <></>}
      </div>
    ))}
  </div>
);

export default ParticipantList;
