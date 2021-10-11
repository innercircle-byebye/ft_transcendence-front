import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const CreateProfile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

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

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Authorization"] =
    context.req.cookies.pong_access_token;

  const res = await axios.get("http://localhost:3000/api/user/me");

  return {
    props: {
      userData: res.data,
    },
  };
};

export default CreateProfile;
