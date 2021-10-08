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

// axios.defaults.baseURL = "https://localhost:3005";
axios.defaults.withCredentials = true;

const Home = ({
  pong_access_token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userData, revalidate, mutate } = useSWR<IUser | false>(
    "/api/users",
    fetcher,
    {
      dedupingInterval: 2000, // 2초
    }
  );

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios.get("/api/logout").then((res) => {
        const { message } = res.data;
        console.log(message);
        mutate(false, false);
        // cookie 삭제
        cookie.remove("pong_access_token");
        // token 삭제
        delete axios.defaults.headers.common["Authorization"];
        router.push('/login');
      }).catch(() => {

      });
    },
    [mutate]
  );

  useEffect(() => {
    // token 저장
    axios.defaults.headers.common["Authorization"] = pong_access_token;
    revalidate();
    console.log("set authorization header");
  }, [pong_access_token]);

  if (!userData) {
    return <div>로딩중...</div>
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
  if (!context.req.cookies.pong_access_token) {
    return ({
      redirect: {
        destination: '/login',
        permanent: false
      }
    })
  }

  return {
    props: { pong_access_token: context.req.cookies.pong_access_token },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
