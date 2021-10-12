import React, { ReactElement, useCallback, useEffect } from "react";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import styles from "@/styles/Home.module.css";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import { IUser } from "@/typings/db";
import { useRouter } from "next/router";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import cookie from "js-cookie";

const Home = ({
  pong_access_token,
  access_token_name,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userData, mutate } = useSWR<IUser | false>(
    ["/api/user/1", pong_access_token],
    fetcher,
    {
      dedupingInterval: 2000, // 2초
    }
  );

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .get("/api/logout")
        .then((res) => {
          const { message } = res.data;
          mutate(false, false);
          // cookie 삭제
          cookie.remove(access_token_name);
          router.push("/login");
          // "logout success"
          console.log(message);
        })
        .catch(() => {});
    },
    [access_token_name, mutate, router]
  );

  if (!userData) {
    return <div>로딩중...</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pong&Chat</title>
        <meta name="description" content="Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Home Page!</h1>
        <h2>{userData?.nickname}</h2>
        <button
          className="bg-sky-800 hover:bg-amber-600 hover:text-white text-white font-bold py-2 px-4 w-36 rounded-full"
          onClick={onClickLogout}
        >
          LOGOUT
        </button>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN as string;

  if (!context.req.cookies[access_token]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const res = await axios.get("http://nestjs-back:3005/api/user/1", {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${context.req.cookies[access_token]}`,
    },
  });
  const { status } = res.data;

  if (status === process.env.STATUS_NOT_REGISTER) {
    return {
      redirect: {
        destination: "/create-profile",
        permanent: false,
      },
    };
  }

  return {
    props: [
      { pong_access_token: context.req.cookies[access_token] },
      { access_token_name: access_token },
    ],
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
