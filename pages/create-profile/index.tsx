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

  return {
    props: {},
  };
};

export default CreateProfile;
