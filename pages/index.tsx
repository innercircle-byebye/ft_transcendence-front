import React, { ReactElement, useCallback, useEffect } from "react";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import styles from "@/styles/Home.module.css";
import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import { IUser } from "@/typings/db";
import { useRouter } from "next/router";
import axios from "axios";

// axios.defaults.baseURL = "https://localhost:3005";
axios.defaults.withCredentials = true;

const Home = () => {
  const router = useRouter();
  const {
    data: userData,
    revalidate,
    mutate,
  } = useSWR<IUser | false>("/api/users", fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios.get("/api/logout").then((res) => {
        const { message } = res.data;

        axios.defaults.headers.common[{ Authorization }] = "";
        mutate(false, false);
        console.log(message);
      });
    },
    [mutate]
  );

  useEffect(() => {
    if (userData === false) {
      router.push("/login");
    }
  }, [router, userData]);

  if (userData === false) {
    return null;
  }

  if (userData === undefined) {
    return <h1 className={styles.title}>로딩중...</h1>;
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
