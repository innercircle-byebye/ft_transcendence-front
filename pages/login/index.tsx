import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import axios from "axios";
import { IUser } from "@/typings/db";

const Login = ({
  login_auth_url,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={500}
          height={150}
          objectFit="contain"
        />
        <p className="font-light tracking-widest h-16 text-amber-200 ">
          Play Pong & Chat
        </p>
        <Link href={login_auth_url}>
          <a>
            <button className="group flex flex-row bg-white hover:bg-amber-600 hover:text-white text-sky-800 font-bold py-2 px-4 w-36 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="group-hover:opacity-5 h-5 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute h-5 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
              LOGIN
            </button>
          </a>
        </Link>
      </div>
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

  if (context.req.cookies[refresh_token] && context.req.cookies[access_token]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (context.req.cookies[refresh_token]) {
    await axios
      .get(`${process.env.BACK_API_PATH}/auth/refresh`, {
        withCredentials: true,
        headers: {
          Cookie: `Refresh=${context.req.cookies[refresh_token]}`,
        },
      })
      .then((res) => {
        context.res.setHeader(
          "set-Cookie",
          `Authentication=${res.data["Authentication"]}; HttpOnly`
        );
      })
      .catch((error) => {
        console.log(error);
      });
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      login_auth_url: process.env.LOGIN_AUTH_URL,
    },
  };
};

export default Login;
