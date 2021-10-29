import React, {
  useCallback, useEffect, useState, VFC,
} from 'react';
import useSWR from 'swr';
import { IChannel, IChannelMember, IUser } from '@/typings/db';
import SwitchPublicPrivate from './SwitchPublicPrivate';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';

interface IProps {
  userData: IUser;
  channelData: IChannel;
  channelMemberData: IChannelMember[];
}

const ChannelInfoModal: VFC<IProps> = ({
  userData, channelData, channelMemberData,
}) => {
  const [channelName, onChangeChannelName, setChannelName] = useInput(channelData.name);
  const [channelNameError, setChannelNameError] = useState(false);
  const [
    maxMemberNum, onChangeMaxMemberNum, setMaxMemberNum,
  ] = useInput(channelData.maxParticipantNum);
  const [isPrivate, setIsPrivate] = useState(channelData.isPrivate);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);
  const [changePassword, setChangePassword] = useState(!channelData.isPrivate);
  const [ownerNickname] = useState(channelMemberData?.find((data) => (
    data.userId === channelData?.ownerId
  ))?.user.nickname);
  const [isChannelOwner] = useState(userData.userId === channelData?.ownerId);
  const { data: allChannelData } = useSWR<IChannel[]>('/api/channel', fetcher);

  const onClickReset = useCallback(() => {
    setChannelName(channelData.name);
    setMaxMemberNum(channelData.maxParticipantNum);
    setIsPrivate(channelData.isPrivate);
    setChangePassword(!channelData.isPrivate);
  }, [
    channelData.isPrivate, channelData.maxParticipantNum, channelData.name,
    setChannelName, setMaxMemberNum,
  ]);

  useEffect(() => {
    const equalChannel = allChannelData?.find((data) => data.name === channelName);
    if (equalChannel && equalChannel.channelId !== channelData.channelId) {
      setChannelNameError(true);
    } else {
      setChannelNameError(false);
    }
  }, [allChannelData, channelData.channelId, channelName]);

  useEffect(() => {
    if (channelData.isPrivate && !isPrivate) {
      setChangePassword(!channelData.isPrivate);
    }
  }, [channelData.isPrivate, isPrivate]);

  return (
    <div className="absolute bg-sky-700 top-7 right-0 w-auto h-auto flex flex-col items-center p-6 space-y-3">
      <div className="text-2xl font-semibold text-amber-50">채널 옵션</div>
      <div className="text-amber-50">
        {`방장: ${ownerNickname} ${userData.userId === channelData.ownerId ? '(나)' : ''}`}
      </div>
      <div className="bg-amber-50 rounded-xl flex flex-col space-y-1 px-3 py-2 w-96 h-auto">
        <div className="grid grid-cols-2 gap-1 items-center">
          <div className="ml-3 text-gray-700 font-medium">채널명</div>
          <div className={`relative ${!channelName.length || channelNameError ? 'pb-3' : ''}`}>
            <input
              className="w-44 px-6 py-2 rounded-full bg-gray-700 text-white font-medium"
              type="text"
              value={channelName}
              onChange={onChangeChannelName}
              disabled={!isChannelOwner}
            />
            {!channelName.length && (
            <div className="absolute text-red-500 text-xs italic">
              채널명을 입력해주세요
            </div>
            )}
            {channelNameError && (
            <div className="absolute text-red-500 text-xs italic">
              이미 존재하는 채널명입니다.
            </div>
            )}
          </div>
          <div className="ml-3 text-gray-700 font-medium">최대멤버수</div>
          <input
            className="px-6 py-2 w-24 rounded-full bg-gray-700 text-white font-medium"
            type="number"
            min={channelMemberData.length > 3 ? channelMemberData.length : 3}
            max={100}
            value={maxMemberNum}
            onChange={onChangeMaxMemberNum}
            disabled={!isChannelOwner}
          />
          <SwitchPublicPrivate
            isChannelOwner={isChannelOwner}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            password={password}
            onChangePassword={onChangePassword}
            setPassword={setPassword}
            passwordError={passwordError}
            setPasswordError={setPasswordError}
            isPrivateChannel={channelData.isPrivate}
            changePassword={changePassword}
            setChangePassword={setChangePassword}
          />
          {userData.userId === channelData.ownerId ? (
            <div className="col-span-2 flex justify-evenly pt-4">
              <button
                className="bg-gray-400 text-white py-2 px-3 rounded-full focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onClickReset}
              >
                RESET
              </button>
              <button
                className="bg-amber-600 text-white py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                type="button"
                disabled={channelNameError || passwordError}
              >
                SAVE
              </button>
            </div>
          ) : <></>}
        </div>
      </div>
    </div>
  );
};
export default ChannelInfoModal;
