import { IGameRoomData, IParticipant } from '@/typings/db';

const setParticipantListData = (
  setParticipantData: (arg0: IParticipant[]) => void,
  data: IGameRoomData,
) => {
  const newData: IParticipant[] = [];

  if (!data.participants.player1) {
    newData.push({ key: 1, role: 'player1', nickname: '' });
  } else {
    newData.push({ key: 1, role: 'player1', nickname: data.participants.player1.nickname });
  }
  if (!data.participants.player2) {
    newData.push({ key: 2, role: 'player2', nickname: '' });
  } else {
    newData.push({ key: 2, role: 'player2', nickname: data.participants.player2.nickname });
  }
  data.participants.observers.map((item, index) => newData.push({ key: index + 2, role: 'observer', nickname: item.nickname }));
  setParticipantData(newData);
};

export default setParticipantListData;
