import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect, useMemo, VFC,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { IChannelMember } from '@/typings/db';
import useInput from '@/hooks/useInput';

interface IProps {
  muteMember: IChannelMember;
  setMuteMember: Dispatch<SetStateAction<IChannelMember | null>>;
  revalidateChannelMemberData: () => Promise<boolean>;
}

const MuteChatModal: VFC<IProps> = ({
  muteMember, setMuteMember, revalidateChannelMemberData,
}) => {
  const router = useRouter();
  const channelName = router.query.name;
  const [muteDay, onChangeMuteDay, setMuteDay] = useInput('');
  const [muteTime, onChangeMuteTime, setMuteTime] = useInput('');

  const current = useMemo(() => new Date(), []);

  const onClickCancelMuteYes = useCallback(() => {
    if (muteMember) {
      axios.patch(`/api/channel/${channelName}/member`, {
        mutedDate: null,
        targetUserId: muteMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setMuteMember(null);
        revalidateChannelMemberData();
        toast.success(`${muteMember.user.nickname}님 채팅금지를 해제했습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${muteMember.user.nickname}님 채팅금지 해지에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelName, muteMember, revalidateChannelMemberData, setMuteMember]);

  const onClickMuteYes = useCallback(() => {
    if (muteMember) {
      axios.patch(`/api/channel/${channelName}/member`, {
        mutedDate: new Date(`${muteDay}T${muteTime}:00`),
        targetUserId: muteMember.userId,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setMuteMember(null);
        revalidateChannelMemberData();
        toast.success(`${muteMember.user.nickname}님을 ${muteDay} ${muteTime}까지 채팅 금지 시켰습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${muteMember.user.nickname}님 채팅 금지에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelName, muteDay, muteMember, muteTime, revalidateChannelMemberData, setMuteMember]);

  const onClickNo = useCallback(() => {
    setMuteMember(null);
  }, [setMuteMember]);

  useEffect(() => {
    setMuteDay(`${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`);
    const hours = current.getHours() < 10 ? `0${current.getHours()}` : current.getHours();
    const minutes = current.getMinutes() < 10 ? `0${current.getMinutes()}` : current.getMinutes();
    setMuteTime(`${hours}:${minutes}:00`);
  }, [current, setMuteDay, setMuteTime]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl">
      <div className="flex flex-col items-center bg-amber-100 space-y-8 p-6 rounded-xl">
        {muteMember.mutedDate
          ? (
            <>
              <div className="flex flex-col items-center">
                <div className="text-2xl">{`${muteMember.user.nickname}님을`}</div>
                <div className="text-2xl">{`${muteMember.mutedDate} 까지`}</div>
                <div className="text-2xl">채팅금지하셨습니다.</div>
                <div className="text-2xl">채팅금지를 취소하시겠습니까?</div>
              </div>
              <div className="flex flex-row space-x-8">
                <button type="button" onClick={onClickCancelMuteYes} className="bg-amber-500 text-2xl px-10 py-2 rounded-full">네</button>
                <button type="button" onClick={onClickNo} className="bg-gray-200 text-2xl px-6 py-2 rounded-full">아니오</button>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl">{`${muteMember.user.nickname}님을 채팅금지하시겠습니까?`}</div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="muteday">
                  {'언제까지 : '}
                  <input type="date" id="muteday" min={`${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`} value={muteDay} onChange={onChangeMuteDay} />
                </label>
                <label htmlFor="mutetime">
                  {'몇시까지 : '}
                  <input type="time" id="mutetime" value={muteTime} onChange={onChangeMuteTime} />
                </label>
              </div>
              <div className="flex flex-row space-x-8">
                <button type="button" onClick={onClickMuteYes} className="bg-amber-500 text-2xl px-10 py-2 rounded-full">네</button>
                <button type="button" onClick={onClickNo} className="bg-gray-200 text-2xl px-6 py-2 rounded-full">아니오</button>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default MuteChatModal;
