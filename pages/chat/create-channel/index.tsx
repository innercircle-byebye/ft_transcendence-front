import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';
import useSWR from 'swr';
import regexifyString from 'regexify-string';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Navbar from '@/components/navigation-bar/Navbar';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';
import { IChannel } from '@/typings/db';
import CheckPublicPrivate from '@/components/chat-page/common/SwitchPublicPrivate';
import InputName from '@/components/inputs/InputName';
import ContentContainerWithTitle from '@/components/create-page/ContentContainerWithTitle';
import PageContainer from '@/components/create-page/PageContainer';
import InviteMembers from '@/components/create-page/InviteMembers';
import InputNumber from '@/components/inputs/InputNumber';

interface IInviteMember {
  id: number;
  nickname: string;
}

const CreateChannel = ({
  allChannelInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [channelName, onChangeChannelName] = useInput('');
  const [channelNameError, setChannelNameError] = useState(false);
  const [maxMemberNum, onChangeMaxMemberNum, setMaxMemberNum] = useInput(3);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordError, setPasswordError] = useState(false);
  const [inviteMember, onChangeInviteMember, setInviteMember] = useInput('');
  const [inviteMembers, setInviteMembers] = useState<IInviteMember[]>([]);
  const [inviteNumError, setInviteNumError] = useState(false);
  const { data: allChannelData } = useSWR<IChannel[]>('/api/channel', fetcher, {
    initialData: allChannelInitialData,
  });
  const { revalidate } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const onClickCancel = useCallback(() => {
    router.back();
  }, [router]);

  const onClickSave = useCallback(() => {
    axios.post(`/api/channel/${channelName}`, {
      password: password === '' ? null : password,
      maxParticipantNum: Number(maxMemberNum),
      invitedUsers: inviteMembers.map((v) => v.id),
    }, {
      headers: {
        withCredentials: 'true',
      },
    }).then(() => {
      revalidate();
      router.push(`/chat/channel/${channelName}`);
    });
  }, [channelName, inviteMembers, maxMemberNum, password, revalidate, router]);

  useEffect(() => {
    const equalChannel = allChannelData?.find((data) => data.name === channelName);
    if (equalChannel) {
      setChannelNameError(true);
    } else {
      setChannelNameError(false);
    }
  }, [allChannelData, channelName]);

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
    <PageContainer>
      <ContentContainerWithTitle isPrivate={isPrivate} title="Create Chat Channel">
        <div className="col-span-2">
          <InputName type="채널명" name={channelName} onChangeName={onChangeChannelName} nameError={channelNameError} />
        </div>
        <InputNumber type="최대멤버수" value={maxMemberNum} onChangeValue={onChangeMaxMemberNum} min={3} max={100} />
        <CheckPublicPrivate
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          password={password}
          onChangePassword={onChangePassword}
          setPassword={setPassword}
          passwordError={passwordError}
          setPasswordError={setPasswordError}
        />
        <div className="col-span-2">
          <InviteMembers
            inviteMember={inviteMember}
            onChangeInviteMember={onChangeInviteMember}
            inviteMembers={inviteMembers}
            setInviteMembers={setInviteMembers}
            inviteNumError={inviteNumError}
          />
        </div>
        <button
          className="bg-gray-400 text-white py-3 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickCancel}
        >
          CANCEL
        </button>
        <button
          className="bg-amber-600 text-white py-3 rounded-full focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onClickSave}
          disabled={!channelName.trim().length || channelNameError || (isPrivate && passwordError)}
        >
          SAVE
        </button>
      </ContentContainerWithTitle>
    </PageContainer>
  );
};

CreateChannel.getLayout = function getLayout(page: ReactElement) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-initial">
        <Navbar />
      </div>
      {page}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const allChannelInitialData: IChannel[] = await axios.get('http://back-nestjs:3005/api/channel', {
    withCredentials: true,
    headers: {
      Cookie: `Authentication=${context.req.cookies[access_token]}`,
    },
  })
    .then((response) => response.data);

  return {
    props: {
      allChannelInitialData,
    },
  };
};

export default CreateChannel;
