import { useState, VFC } from 'react';
import { IChannel, IChannelMember, IUser } from '@/typings/db';

interface IProps {
  userData: IUser;
  channelData: IChannel;
  channelMemberData: IChannelMember[];
}

const MembersModal: VFC<IProps> = ({
  userData, channelData, channelMemberData,
}) => {
  const [ownerNickname] = useState(channelMemberData?.find((data) => (
    data.userId === channelData?.ownerId
  ))?.user.nickname);

  // const onClickGrantChannelAdmin = useCallback(() => {

  // }, []);

  if (channelMemberData.length === 1) {
    return (
      <div className="absolute bg-sky-700 top-32 right-10 w-60 h-auto p-6 flex flex-col items-center space-y-3">
        <div className="text-2xl font-semibold text-amber-50 tracking-wide">{`# ${channelData.name} (1)`}</div>
        <div className="text-amber-50 font-semibold">{`방장 : ${userData.nickname} (나)`}</div>
        <div className="text-amber-50 text-9xl">텅</div>
      </div>
    );
  }
  return (
    <div className="absolute bg-sky-700 top-32 right-10 w-auto p-6 h-auto flex flex-col items-center space-y-3">
      <div className="text-2xl font-semibold text-amber-50 tracking-wide">
        {`# ${channelData.name} (${channelData.currentChatMemberCount})`}
      </div>
      <div className="text-amber-50">
        {`방장: ${ownerNickname} ${userData.userId === channelData.ownerId ? '(나)' : ''}`}
      </div>
      <div className="bg-amber-50 rounded-xl flex flex-col space-y-1 px-3 py-2 max-h-60 overflow-y-auto">
        {channelMemberData.map((data) => {
          if (data.user.nickname === userData.nickname) {
            return null;
          }
          return (
            <div key={data.userId} className="flex flex-row justify-between space-x-2">
              <div className="font-semibold">{data.user.nickname}</div>
              <button type="button" className="bg-blue-400 font-semibold text-sm rounded-full w-16 h-7">게임신청</button>
              <button type="button" className="bg-yellow-400 font-semibold text-sm rounded-full w-16 h-7">차단하기</button>
              {channelData.ownerId === userData.userId
              && (
              <>
                <button type="button" className="bg-green-500 font-semibold text-sm rounded-full w-16 h-7">방장부여</button>
                <button type="button" className="bg-amber-500 font-semibold text-sm rounded-full w-16 h-7">채팅금지</button>
                <button type="button" className="bg-red-500 font-semibold text-sm rounded-full w-16 h-7">추방하기</button>
              </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MembersModal;
