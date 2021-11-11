import React, {
  useCallback, useEffect, useRef, useState, VFC,
} from 'react';
import regexifyString from 'regexify-string';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import useInput from '@/hooks/useInput';
import MentionMember from '@/components/chat-page/common/MentionMember';
import { IChannel, IChannelMember, IUser } from '@/typings/db';

interface IInviteMember {
  id: number;
  nickname: string;
}

interface IProps {
  memberData: IUser[];
  channelData: IChannel;
  channelMemberData: IChannelMember[]
}

const InviteMemberModal: VFC<IProps> = ({ memberData, channelData, channelMemberData }) => {
  const router = useRouter();
  const channelName = router.query.name;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inviteMember, onChangeInviteMember, setInviteMember] = useInput('');
  const [inviteMembers, setInviteMembers] = useState<IInviteMember[]>([]);
  const [inviteNumError, setInviteNumError] = useState(false);

  const onClickRemoveInvite = useCallback((id: number) => {
    setInviteMembers((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const onClickInvite = useCallback(() => {
    console.log('invite');
    if (inviteMembers.length > 0) {
      axios.post(`/api/channel/${channelName}/invite`, {
        invitedUsers: inviteMembers,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(() => {
        setInviteMembers([]);
        toast.success('초대하기 dm을 보냈습니다.', { position: 'bottom-right', theme: 'colored' });
      }).catch(() => {
        toast.error('초대하기를 실패했습니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [channelName, inviteMembers]);

  useEffect(() => {
    if (channelData?.maxParticipantNum && channelMemberData?.length) {
      if (channelData.maxParticipantNum < inviteMembers.length + channelMemberData?.length) {
        setInviteNumError(true);
      } else {
        setInviteNumError(false);
      }
    }
  }, [channelData?.maxParticipantNum, channelMemberData?.length, inviteMembers.length]);

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
    <div className="absolute bg-sky-700 top-7 right-16 w-auto h-auto flex flex-col items-center p-6 space-y-3">
      <div className="text-2xl font-bold text-amber-50 pb-1">멤버 초대하기</div>
      <div className="w-36 bg-gray-100 rounded-full">
        <div className="flex flex-row pl-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-2.5 text-sky-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <MentionMember
            trigger="@"
            placeholder="@닉네임"
            value={inviteMember}
            onChangeValue={onChangeInviteMember}
            inputRef={textareaRef}
            data={
                  memberData?.filter(
                    (v) => !inviteMembers.map((m) => m.id).includes(v.userId)
                    && !channelMemberData?.map((m) => m.userId).includes(v.userId),
                  ).map((v) => ({ userId: v.userId, nickname: v.nickname, imagePath: v.imagePath }))
                }
          />
        </div>
        {inviteNumError
        && (
        <>
          <div className="absolute items-center text-gray-300 text-sm font-bold italic">
            최대멤버수를 초과합니다.
          </div>
          <div className="absolute items-center text-red-500 text-sm font-semibold italic">
            최대멤버수를 초과합니다.
          </div>
        </>
        )}
      </div>
      <div className="w-60 bg-sky-100 border-2 border-sky-700 rounded-lg p-2">
        <div className="flex flex-row flex-wrap gap-2 max-h-14 overflow-y-auto">
          {inviteMembers.length ? inviteMembers.map((v) => (
            <div key={v.id} className="flex flex-row">
              <div className="bg-amber-500 px-1">{v.nickname}</div>
              <button type="button" onClick={() => onClickRemoveInvite(v.id)}>&times;</button>
            </div>
          )) : <div className="text-gray-400 px-2">초대할 멤버 리스트</div>}
        </div>
      </div>
      <button type="button" className="bg-amber-500 px-3 py-2 rounded-full" onClick={onClickInvite} disabled={inviteNumError}>초대하기</button>
    </div>
  );
};

export default InviteMemberModal;
