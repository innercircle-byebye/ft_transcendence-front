import React, { ReactElement, useCallback } from "react";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import styles from "@/styles/Home.module.css";
import { IUser } from "@/typings/db";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const Home = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const onClickLogout = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .get("/auth/logout")
        .then(() => {
          router.push("/login");
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: "bottom-center" });
        });
    },
    [router]
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
  const access_token = process.env.ACCESS_TOKEN;
  const refresh_token = process.env.REFRESH_TOKEN;

  if (!refresh_token || !access_token) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }

  if (!context.req.cookies[refresh_token]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else if (!context.req.cookies[access_token]) {
    await axios
      .get(`${process.env.BACK_API_PATH}/auth/refresh`, {
        withCredentials: true,
        headers: {
          Cookie: `Refresh=${context.req.cookies[refresh_token]}`,
        },
      })
      .then((res) => {
        context.res.setHeader("set-Cookie", res.headers["set-cookie"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const res = await axios.get(`${process.env.BACK_API_PATH}/api/user/1`, {
    withCredentials: true,
  });
  const userData: IUser = res.data;

  if (userData.status === process.env.STATUS_NOT_REGISTER) {
    return {
      redirect: {
        destination: "/create-profile",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData,
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
