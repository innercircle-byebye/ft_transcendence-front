import React, {
  ChangeEvent, Dispatch, useCallback, useRef, VFC,
} from 'react';
import useSWR from 'swr';
import { IUser } from '@/typings/db';
import fetcher from '@/utils/fetcher';
import MentionMember from '../chat-page/common/MentionMember';

interface IInviteMember {
  id: number;
  nickname: string;
}

interface IProps {
  inviteMember: string;
  onChangeInviteMember: (e: ChangeEvent<HTMLInputElement>) => void;
  inviteMembers: IInviteMember[];
  setInviteMembers: Dispatch<React.SetStateAction<IInviteMember[]>>;
  inviteNumError: boolean;
}

const InviteMembers: VFC<IProps> = ({
  inviteMember, onChangeInviteMember, inviteMembers, setInviteMembers, inviteNumError,
}) => {
  const { data: allUserData } = useSWR<IUser[]>('/api/user/all', fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onClickRemoveInvite = useCallback((id: number) => {
    setInviteMembers((prev) => prev.filter((v) => v.id !== id));
  }, [setInviteMembers]);

  return (
    <div className="flex flex-col space-y-5 items-center">
      <div className="w-full flex flex-row items-center justify-evenly">
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
              allUserData?.filter(
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
        <span className="text-gray-700">{`${inviteMembers.length}명`}</span>
      </div>
      <div className="w-full bg-sky-100 border-2 border-sky-700 rounded-lg p-2">
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
  );
};

export default InviteMembers;
