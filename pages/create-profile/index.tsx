import path from "path";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const CreateProfile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // const [newPhoto, setNewPhoto] = useState<string>(userData.imageurl);
  const [newPhoto, setNewPhoto] = useState<string>('/favicon.ico');
  const photoRef = useRef<HTMLInputElement | null>(null);

  const onChangeImage = useCallback(() => {
    if (photoRef.current) {
      setNewPhoto(
        path.join(__dirname, photoRef.current.files?.[0].name as string)
      );
    }
  }, []);

  const onClickSelectNewPhoto = useCallback((e) => {
    e.preventDefault();
    if (photoRef.current) {
      photoRef.current.click();
    }
  }, []);

  useEffect(() => {
    console.log(__dirname);
    console.log(newPhoto);
  }, [newPhoto]);

  return (
    <div className="ml-2 sm:col-span-4 md:mr-3">
      <input
        type="file"
        className="hidden"
        ref={photoRef}
        onChange={onChangeImage}
      />
      <label className="block text-gray-700 text-sm font-bold mb-2 text-center">
        Profile Photo
      </label>
      <div className="text-center">
        {/* Current Profile Photo */}
        <div className="mt-2" x-show="! photoPreview">
          <Image
            alt="profile-image"
            src={newPhoto}
            width={100}
            height={100}
            className="w-40 h-40 m-auto rounded-full shadow"
          />
        </div>
        {/* New Profile Photo Preview */}
        <div className="mt-2" x-show="photoPreview" style={{ display: "none" }}>
          <span
            className="block w-40 h-40 rounded-full m-auto shadow"
            style={{
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundImage: 'url("null")',
            }}
          ></span>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3"
          onClick={onClickSelectNewPhoto}
        >
          Select New Photo
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // if (!context.req.cookies.pong_access_token) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  // axios.defaults.withCredentials = true;
  // axios.defaults.headers.common["Authorization"] =
  //   context.req.cookies.pong_access_token;

  const res = await axios.get("http://localhost:3000/api/users");
  const data = res.data;

  return {
    props: {
      userData: data,
    },
  };
};

export default CreateProfile;
