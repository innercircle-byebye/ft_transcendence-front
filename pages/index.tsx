import React, { ReactElement } from "react";
import Head from "next/head";
import MainLayout from "../layouts/mainLayout";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pong&Chat</title>
        <meta name="description" content="Play pong game and Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Home Page!</h1>
      </main>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;
