import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const CreateProfile = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return <div>create-profile</div>;
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

  const res = await axios.get("http://localhost:3000/api/user/me", {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${context.req.cookies.pong_access_token}`,
    },
  });
  const { status } = res.data;

  if (status !== "not_registered") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default CreateProfile;
