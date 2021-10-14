import { IUser } from "@/typings/db";
import reissueToken from "@/utils/reissueTokens";
import fetcher from "@/utils/fetcher";
import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const CreateProfile = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(
    userData.imagePath
  );
  const [nickname, setNickname] = useState(userData.nickname);
  const [email, setEmail] = useState(userData.email);
  const [emailError, setEmailError] = useState(false);

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

  const onSubmitCreateProfile = useCallback(
    (e) => {
      e.preventDefault();
      if (nickname && email && !emailError) {
        const formData = new FormData();
        imageFile && formData.append("image", imageFile);
        formData.append("nickname", nickname);
        formData.append("email", email);
        axios
          .post("/api/user/register", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            router.push("/");
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: "bottom-center" });
          });
      }
    },
    [email, emailError, imageFile, nickname, router]
  );

  useEffect(() => {
    const emailForm =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    setEmailError(!emailForm.test(email));

    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }, [email, emailError, imageFile, previewImagePath, userData.imagePath]);

  return (
    <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
      <div className="absolute top-5 left-5">
        <Image src="/Logo.png" alt="small-logo" width={100} height={40} />
      </div>
      <div
        className="bg-white shadow-md rounded-full px-8 pt-6 pb-8 mb-4 w-full flex flex-col items-center justify-evenly"
        style={{ width: "672px", height: "672px" }}
      >
        <div className="text-6xl text-gray-700">Create Profile</div>
        <form
          className="flex flex-col items-center"
          onSubmit={onSubmitCreateProfile}
        >
          <div className="relative bg-blue-300 w-56 h-56 mb-4 rounded-full shadow-lg">
            {previewImagePath ? (
              <Image
                src={previewImagePath}
                alt="previewImage"
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
              accept="image/jpg,image/png,image/jpeg,image/gif"
              className="hidden"
              ref={fileInputRef}
              onChange={onChangeImage}
            />
          </div>
          <div className="mb-4 w-64">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nickname
              <button
                className="bg-white text-sky-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setNickname(userData.nickname);
                }}
              >
                Reset
              </button>
            </label>
            <input
              name="nickname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder={userData.nickname}
              value={nickname}
              onChange={onChangeNickname}
            />
            {!nickname && (
              <p className="text-red-500 text-xs italic">
                닉네임을 입력해주세요.
              </p>
            )}
          </div>
          <div className="mb-6 w-64">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
              <button
                className="bg-white text-sky-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setEmail(userData.email);
                }}
              >
                Reset
              </button>
            </label>
            <input
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder={userData.email}
              value={email}
              onChange={onChangeEmail}
            />
            {!email && (
              <p className="text-red-500 text-xs italic">
                이메일을 입력해주세요.
              </p>
            )}
            {email && emailError && (
              <p className="text-red-500 text-xs italic">
                잘못된 이메일 주소입니다.
              </p>
            )}
          </div>
          <div className="w-56 flex items-center justify-evenly">
            <button
              className="bg-white text-sky-600 border-sky-600 border font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClickReset}
            >
              Reset
            </button>
            <button
              className="bg-sky-600 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const access_token = process.env.ACCESS_TOKEN || "";
  const refresh_token = process.env.REFRESH_TOKEN || "";

  if (
    !context.req.cookies[refresh_token] ||
    !context.req.cookies[access_token]
  ) {
    return reissueToken(
      context,
      access_token,
      refresh_token,
      "/create-profile"
    );
  }

  const userData: IUser = await axios
    .get(`${process.env.BACK_API_PATH}/api/user/me`, {
      withCredentials: true,
      headers: {
        Cookie: `Authentication=${context.req.cookies[access_token]}`,
      },
    })
    .then((response) => response.data);

  const { status } = userData;
  if (status !== process.env.STATUS_NOT_REGISTER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userData: userData,
    },
  };
};

export default CreateProfile;
