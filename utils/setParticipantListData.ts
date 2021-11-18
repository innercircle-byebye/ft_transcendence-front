import { IGameRoomData, IParticipant } from '@/typings/db';

const setParticipantListData = (
  setParticipantData: (arg0: IParticipant[]) => void,
  data: IGameRoomData,
) => {
  const newData: IParticipant[] = [];

  if (!data.participants.player1) {
    newData.push({
      key: 1, role: 'player1', nickname: '', userId: -1,
    });
  } else {
    newData.push({
      key: 1,
      role: 'player1',
      nickname: data.participants.player1.nickname,
      userId: data.participants.player1.userId,
    });
  }
  if (!data.participants.player2) {
    newData.push({
      key: 2,
      role: 'player2',
      nickname: '',
      userId: -1,
    });
  } else {
    newData.push({
      key: 2,
      role: 'player2',
      nickname: data.participants.player2.nickname,
      userId: data.participants.player2.userId,
    });
  }
  data.participants.observers.map((item, index) => newData.push({
    key: index + 2,
    role: 'observer',
    nickname: item.nickname,
    userId: item.userId,
  }));
  setParticipantData(newData);
};

export default setParticipantListData;
