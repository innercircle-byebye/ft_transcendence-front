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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string | null>(null);
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
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  }, []);

  const onChangeNickname = useCallback((e) => {
    setNickname(e.target.value);
  }, []);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const onClickReset = useCallback(
    (e) => {
      e.preventDefault();
      setNickname(userData.nickname);
      setEmail(userData.email);
      setPreviewImagePath(userData.imagePath);
      setImageFile(null);
    },
    [userData.email, userData.imagePath, userData.nickname]
  );

  const onClickSave = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`/api/user/${userData.userId}`, {
          ...userData,
          nickname: nickname,
          email: email,
          imagePath: previewImagePath,
        })
        .then((res) => {
          const { message } = res.data;
          console.log(message);
          router.push("/");
        });
    },
    [email, nickname, previewImagePath, router, userData]
  );

  useEffect(() => {
    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    } else {
      setPreviewImagePath(userData.imagePath);
    }
  }, [imageFile, previewImagePath, userData.imagePath]);

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
            {previewImagePath ? (
              <Image
                src={previewImagePath}
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
          <div className="md:flex md:items-center mt-6">
            <div className="md:w-1/3">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                NickName
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-white text-gray-700 border rounded-full py-3 px-4 leading-tight"
                id="grid-first-name"
                type="text"
                placeholder={userData.intraUsername}
                value={nickname}
                onChange={onChangeNickname}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-white text-gray-700 border rounded-full py-3 px-4 leading-tight"
                id="grid-first-name"
                type="text"
                placeholder={userData.email}
                value={email}
                onChange={onChangeEmail}
              />
            </div>
          </div>
        </div>
        <div className="justify-between">
          <button
            className="bg-sky-800 hover:bg-amber-600 hover:text-white text-white font-bold py-2 px-4 mt-6 w-20 rounded-full"
            onClick={onClickReset}
          >
            RESET
          </button>
          <button
            className="bg-sky-800 hover:bg-amber-600 hover:text-white text-white font-bold py-2 px-4 mt-6 w-20 rounded-full"
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
  const access_token = process.env.ACCESS_TOKEN as string;

  if (!context.req.cookies[access_token]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const res = await axios.get(`http://nestjs-back:3005/api/user/6`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${context.req.cookies.pong_access_token}`,
    },
  });

  return {
    props: {
      userData: res.data,
    },
  };
};

export default CreateProfile;
