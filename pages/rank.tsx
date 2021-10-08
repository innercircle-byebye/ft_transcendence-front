import { ReactElement } from "react";
import { NextPage } from "next";
import MainLayout from "@/layouts/MainLayout";

const Rank = () => {
  return <h1>Rank</h1>;
};

Rank.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Rank;
