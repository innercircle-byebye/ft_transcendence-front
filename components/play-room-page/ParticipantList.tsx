import { VFC } from 'react';
import { IParticipant } from '@/typings/db';

interface IProps {
  participantData: IParticipant[];
}

const ParticipantList: VFC<IProps> = ({ participantData }) => (
  <div className="w-full h-full bg-sky-200">
    관전자 목록입니다.
    {participantData.map((item) => (
      <div
        key={item.key}
        className="pl-2"
      >
        {`${item.role} : ${item.nickname}`}
      </div>
    ))}
  </div>
);

export default ParticipantList;
