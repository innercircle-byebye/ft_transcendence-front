import React, {
  ReactElement,
} from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import ChatLayout from '@/layouts/ChatLayout';
import SearchChannel from '@/components/chat-page/SearchChannel';
import SearchDM from '@/components/chat-page/SearchDM';
import reissueToken from '@/utils/reissueTokens';
import { IChannel, IUser } from '@/typings/db';

const Chat = ({
  allChannelInitialData, myChannelInitialData, allUserInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div className="h-full flex flex-col p-4 space-y-1">
    <SearchChannel
      allChannelInitialData={allChannelInitialData}
      myChannelInitialData={myChannelInitialData}
    />
    <SearchDM allUserInitialData={allUserInitialData} />
  </div>
);

Chat.getLayout = function getLayout(page: ReactElement) {
  return <ChatLayout>{page}</ChatLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || '';
  const refresh_token = process.env.REFRESH_TOKEN || '';

  if (
    !context.req.cookies[refresh_token]
    || !context.req.cookies[access_token]
  ) {
    return reissueToken(
      context,
      access_token,
      refresh_token,
      '/chat',
    );
  }

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
