import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import useSWR from 'swr';
import regexifyString from 'regexify-string';
import Navbar from '@/components/Navbar';
import useInput from '@/hooks/useInput';
import MentionMember from '@/components/chat-page/MentionMember';
import fetcher from '@/utils/fetcher';
import { IChannel, IUser } from '@/typings/db';
import CheckPublicPrivate from '@/components/chat-page/SwitchPublicPrivate';

interface IInviteMember {
  id: number;
  nickname: string;
}

const CreateChannel = () => {
  const router = useRouter();
  const [channelName, onChangeChannelName] = useInput('');
  const [channelNameError, setChannelNameError] = useState(false);
  const [maxMemberNum, onChangeMaxMemberNum, setMaxMemberNum] = useInput(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inviteMember, onChangeInviteMember, setInviteMember] = useInput('');
  const [inviteMembers, setInviteMembers] = useState<IInviteMember[]>([]);
  const [inviteNumError, setInviteNumError] = useState(false);
  const { data: userData } = useSWR('/api/user/me', fetcher);
  const { data: memberData } = useSWR<IUser[]>(
    userData ? '/api/user/all' : null,
    fetcher,
  );
  const { data: channelListData } = useSWR<IChannel[]>('/api/channel', fetcher);

  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onClickSave = useCallback(() => {
    axios.post(`/api/channel/${channelName}`, {
      password: password === '' ? null : password,
      maxParticipantNum: maxMemberNum,
      invitedUsers: inviteMembers.map((v) => v.id),
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      router.push('/chat');
    });
  }, [channelName, inviteMembers, maxMemberNum, password, router]);

  const onClickRemoveInvite = useCallback((id: number) => {
    setInviteMembers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  useEffect(() => {
    const equalChannel = channelListData?.find((data) => data.name === channelName);
    if (equalChannel) {
      setChannelNameError(true);
    } else {
      setChannelNameError(false);
    }
  }, [channelListData, channelName]);

  useEffect(() => {
    if (maxMemberNum < 3) {
      setMaxMemberNum(3);
    } else if (maxMemberNum > 100) {
      setMaxMemberNum(100);
    }
  }, [maxMemberNum, setMaxMemberNum]);

  useEffect(() => {
    if (maxMemberNum < inviteMembers.length) {
      setInviteNumError(true);
    } else {
      setInviteNumError(false);
    }
  }, [inviteMembers.length, maxMemberNum]);

  useEffect(() => {
    regexifyString({
      input: inviteMember,
      pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
      decorator(match) {
        const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/);
        if (arr && arr[1] && arr[2]) {
          setInviteMembers([...inviteMembers, { id: +arr[2], nickname: arr[1] }]);
          setInviteMember('');
          return (arr[2]);
        }
        return '';
      },
    }).filter((v, id) => id % 2);
  }, [inviteMember, inviteMembers, setInviteMember]);

  return (
    <div className="w-screen h-full flex flex-col items-center space-y-20">
      <div className="grid grid-cols-7 justify-items-start mt-20">
        {isPrivate && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="col-span-1 h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <div className="col-start-2 col-span-6 text-5xl">
          Create Chat Channel
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 items-center">
        <div className="relative col-span-2">
          <input
            className="col-span-2 w-80 px-6 py-4 rounded-full bg-gray-100 text-xl"
            placeholder="채널명"
            type="text"
            value={channelName}
            onChange={onChangeChannelName}
          />
          {!channelName.trim().length && (
          <div className="absolute left-5 text-red-500 text-xs italic">
            채널명을 입력해주세요
          </div>
          )}
          {channelNameError && (
          <div className="absolute left-5 text-red-500 text-xs italic">
            이미 존재하는 채널명입니다.
          </div>
          )}
        </div>
        <div className="ml-3 text-gray-700 font-medium">최대멤버수</div>
        <input
          className="px-6 py-2 w-24 rounded-full bg-gray-100 text-xl"
          type="number"
          min={3}
          max={100}
          value={maxMemberNum}
          onChange={onChangeMaxMemberNum}
        />
        <CheckPublicPrivate
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          password={password}
          onChangePassword={onChangePassword}
          setPassword={setPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
        />
        <div className="col-span-2 flex flex-col space-y-5 items-center">
          <form className="w-80 flex items-center justify-evenly flex-row">
            <div className="w-56 bg-gray-100 rounded-full pl-3 pt-1">
              <div className="flex flex-row justify-evenly">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mt-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <MentionMember
                  trigger="@"
                  placeholder="@초대할 멤버 닉네임"
                  value={inviteMember}
                  onChangeValue={onChangeInviteMember}
                  inputRef={textareaRef}
                  data={
                  memberData?.filter(
                    (v) => !inviteMembers.map((m) => m.id).includes(v.userId),
                  )
                }
                />
              </div>
              {inviteNumError && (
              <div className="absolute items-center text-red-500 text-xs italic">
                최대멤버수를 초과합니다.
              </div>
              )}
            </div>
            <div className="text-gray-700">{`${inviteMembers.length}명`}</div>
          </form>
          <div className="w-80 bg-sky-100 border-2 border-sky-700 rounded-lg p-2">
            <div className="flex flex-row flex-wrap gap-2">
              {inviteMembers.length ? inviteMembers.map((v) => (
                <div key={v.id} className="flex flex-row">
                  <div className="bg-amber-500 px-1">{v.nickname}</div>
                  <button type="button" onClick={() => onClickRemoveInvite(v.id)}>&times;</button>
                </div>
              )) : <div className="text-gray-400 px-2">초대할 멤버 리스트</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="space-x-4">
        <button
          className="bg-gray-400 text-white py-3 px-8 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickCancel}
        >
          CANCEL
        </button>
        <button
          className="bg-amber-600 text-white py-3 px-10 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickSave}
          disabled={!channelName.trim().length || channelNameError || (isPrivate && passwordError)}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

CreateChannel.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      <div className="bg-gray-300 flex flex-row h-auto flex-1">
        <main>{page}</main>
      </div>
    </div>
  );
};

export default CreateChannel;
