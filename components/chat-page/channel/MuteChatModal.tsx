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
  nickname: string;
  muteMember: IChannelMember;
  setMuteMember: Dispatch<SetStateAction<IChannelMember | null>>;
}

const MuteChatModal: VFC<IProps> = ({
  nickname, muteMember, setMuteMember,
}) => {
  const router = useRouter();
  const channelName = router.query.name;
  const [muteDay, onChangeMuteDay, setMuteDay] = useInput('');
  const [muteTime, onChangeMuteTime, setMuteTime] = useInput('');

  const current = useMemo(() => new Date(), []);

  const onClickYes = useCallback(() => {
    if (muteMember) {
      axios.patch(`/api/channel/${channelName}/member`, {
        mutedDate: new Date(`${muteDay}T${muteTime}:00`),
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        toast.success(`${nickname}님을 ${muteDay} ${muteTime}까지 채팅 금지 시켰습니다.`, { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error(`${nickname}님 채팅 금지에 실패했습니다.`, { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelName, muteDay, muteMember, muteTime, nickname]);

  const onClickNo = useCallback(() => {
    setMuteMember(null);
  }, [setMuteMember]);

  useEffect(() => {
    setMuteDay(`${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`);
    setMuteTime(`${current.getHours()}:${current.getMinutes()}`);
  }, [current, setMuteDay, setMuteTime]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-xl">
      <div className="flex flex-col items-center bg-amber-100 space-y-8 p-6 rounded-xl">
        <div className="text-3xl">{`${nickname}님을 채팅금지하시겠습니까?`}</div>
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
          <button type="button" onClick={onClickYes} className="bg-amber-500 text-2xl px-10 py-2 rounded-full">네</button>
          <button type="button" onClick={onClickNo} className="bg-gray-200 text-2xl px-6 py-2 rounded-full">아니오</button>
        </div>
      </div>
    </div>
  );
};

export default MuteChatModal;
