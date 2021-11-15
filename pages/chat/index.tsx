import React, {
  ReactElement, useCallback, useState,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { ToastContainer, toast } from 'react-toastify';
import ChatLayout from '@/layouts/ChatLayout';
import SearchChannel from '@/components/chat-page/SearchChannel';
import SearchDM from '@/components/chat-page/SearchDM';
import { IChannel, IUser } from '@/typings/db';
import PasswordModal from '@/components/chat-page/PasswordModal';
import useInput from '@/hooks/useInput';
import fetcher from '@/utils/fetcher';

const Chat = ({
  allChannelInitialData, myChannelInitialData, allUserInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [password, onChangePassword, setPassword] = useInput('');
  const [privateChannelToJoin, setPrivateChannelToJoin] = useState<IChannel | null>(null);
  const { mutate: mutateMyChannelData } = useSWR<IChannel[]>('/api/channel/me', fetcher);

  const onSubmitPassword = useCallback((e) => {
    e.preventDefault();
    if (privateChannelToJoin) {
      axios.post(`/api/channel/${privateChannelToJoin.name}/member`, {
        password,
      }, {
        headers: {
          withCredentials: 'true',
        },
      }).then(async () => {
        await mutateMyChannelData((prevMyChannelData) => {
          prevMyChannelData?.push(privateChannelToJoin);
          return prevMyChannelData;
        }, false);
        const channelName = privateChannelToJoin.name;
        setPrivateChannelToJoin(null);
        await router.push(`/chat/channel/${channelName}`);
      }).catch((error) => {
        setPassword('');
        console.dir(error);
        toast.error('틀린 비밀번호 입니다.', { position: 'bottom-right', theme: 'colored' });
      });
    }
  }, [mutateMyChannelData, password, privateChannelToJoin, router, setPassword]);

  const onClosePasswordModal = useCallback((e) => {
    e.preventDefault();
    setPrivateChannelToJoin(null);
  }, [setPrivateChannelToJoin]);

  return (
    privateChannelToJoin
      ? (
        <>
          <PasswordModal
            onSubmitPassword={onSubmitPassword}
            name={privateChannelToJoin.name}
            password={password}
            onChangePassword={onChangePassword}
            onCloseModal={onClosePasswordModal}
          />
          <ToastContainer />
        </>
      ) : (
        <div className="h-full flex flex-col p-4 space-y-1">
          <SearchChannel
            allChannelInitialData={allChannelInitialData}
            myChannelInitialData={myChannelInitialData}
            setPrivateChannelToJoin={setPrivateChannelToJoin}
          />
          <SearchDM allUserInitialData={allUserInitialData} />
        </div>
      )
  );
};

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';

  const allChannelInitialData: IChannel[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/channel`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const myChannelInitialData: IChannel[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/channel/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const allUserInitialData: IUser[] = await axios
    .get(`http://back-nestjs:${process.env.BACK_PORT}/api/user/all`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  return {
    props: {
      allChannelInitialData,
      myChannelInitialData,
      allUserInitialData,
    },
  };
};

export default Chat;
