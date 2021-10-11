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
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const {
    data: userData,
    revalidate,
    mutate,
  } = useSWR<IUser | false>("/api/user/me", fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .get("/api/logout")
        .then((res) => {
          const { message } = res.data;
          mutate(false, false);
          // token 삭제
          delete axios.defaults.headers.common["Authorization"];
          // cookie 삭제
          cookie.remove("pong_access_token");
          router.push("/login");
          // "logout success"
          console.log(message);
        })
        .catch(() => {});
    },
    [mutate, router]
  );

  useEffect(() => {
    // token 저장
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${pong_access_token}`;
    // 사용자 정보 다시 가져옴
    revalidate();
  }, [pong_access_token, revalidate, userData]);

  if (!userData) {
    return <div>로딩중...</div>;
  }

  if (userData.status === "not_registered") {
    router.push("/create-profile");
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
  if (!context.req.cookies.pong_access_token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pong_access_token: context.req.cookies.pong_access_token,
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
