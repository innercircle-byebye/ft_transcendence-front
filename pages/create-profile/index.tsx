import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const CreateProfile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>();
  const [nickname, setNickname] = useState(userData.nickname);
  const [email, setEmail] = useState(userData.email);

  const onClickUploadImage = useCallback((e) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const onChangeImage = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    } else {
      setImage(null);
    }
  }, []);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  },[]);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  },[]);

  const onClickSave = useCallback((e) => {
    e.preventDefault();
    axios.post(`/api/user/${userData.userId}`, {
      ...userData,
      "nickname": nickname,
      "email": email,
      "imagePath": image
    }).then((res) => {
      const { message } = res.data;
      console.log(message);
      router.push('/');
    });
  }, [email, image, nickname, router, userData]);

  useEffect(() => {
    if (image) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  return (
    <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
      <div className="absolute top-5 left-5">
        <Image src="/Logo.png" alt="small-logo" width={100} height={40} />
      </div>
      <div
        className="flex flex-col justify-center items-center bg-blue-100 rounded-full"
        style={{ width: "672px", height: "672px" }}
      >
        <div className="text-6xl pb-14">Create Profile</div>
        <div className="grid grid-row-4 gap-4 justify-items-center">
          <form className="relative bg-blue-300 w-56 h-56 rounded-full shadow-lg">
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                objectFit="cover"
                layout="fill"
                className="rounded-full"
              />
            ) : null}
            <button
              onClick={onClickUploadImage}
              className="w-56 h-56 rounded-full cursor-pointer opacity-20 hover:opacity-80"
            >
              Upload Image
            </button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={onChangeImage}
            />
          </form>
          <div>
            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              {`NickName `}
            </label>
            <input
              className="w-auto bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
              id="grid-first-name"
              type="text"
              placeholder={userData.intraUsername}
              value={nickname}
              onChange={onChangeNickname}
            />
          </div>
          <div>
            <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              {`email `}
            </label>
            <input
              className="w-auto bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight"
              id="grid-first-name"
              type="text"
              placeholder={userData.email}
              value={email}
              onChange={onChangeEmail}
            />
          </div>
          <button
            className="bg-white hover:bg-amber-600 hover:text-white text-sky-800 font-bold py-2 px-4 w-20 rounded-full"
            onClick={onClickSave}
          >
            SAVE
          </button>
        </div>
      </div>
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

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["Authorization"] = `Bearer ${context.req.cookies.pong_access_token}`;

  const res = await axios.get("http://localhost:3000/api/user/me");
  const data = res.data;
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
    props: {
      userData: data,
    },
  };
};

export default CreateProfile;
