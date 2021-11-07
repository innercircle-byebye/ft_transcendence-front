import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useInput from '@/hooks/useInput';

const CreateProfile = ({
  userInitialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImagePath, setPreviewImagePath] = useState<string>(
    userInitialData.imagePath,
  );
  const [nickname, onChangeNickname, setNickname] = useInput<string>(
    userInitialData.nickname,
  );
  const [email, onChangeEmail, setEmail] = useInput<string>(userInitialData.email);
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

  const onClickReset = useCallback(
    (e) => {
      e.preventDefault();
      setNickname(userInitialData.nickname);
      setEmail(userInitialData.email);
      setPreviewImagePath(userInitialData.imagePath);
      setImageFile(null);
    },
    [
      userInitialData.email,
      userInitialData.imagePath,
      userInitialData.nickname,
      setEmail,
      setNickname,
    ],
  );

  const onSubmitCreateProfile = useCallback(
    (e) => {
      e.preventDefault();
      if (nickname && email && !emailError) {
        const formData = new FormData();
        if (imageFile) {
          formData.append('image', imageFile);
        }
        formData.append('nickname', nickname);
        formData.append('email', email);
        axios
          .post('/api/user/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              withCredentials: 'true',
            },
          })
          .then(() => {
            router.push('/');
          })
          .catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center', theme: 'colored' });
          });
      }
    },
    [email, emailError, imageFile, nickname, router],
  );

  useEffect(() => {
    const emailForm = /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    setEmailError(!emailForm.test(email));

    if (imageFile) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImagePath(fileReader.result as string);
      };
      fileReader.readAsDataURL(imageFile);
    }
  }, [email, emailError, imageFile, previewImagePath, userInitialData.imagePath]);

  return (
    <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
      <div className="absolute top-5 left-5">
        <Image src="/Logo.png" alt="small-logo" width={100} height={40} />
      </div>
      <div
        className="bg-white shadow-md rounded-full px-8 pt-6 pb-8 mb-4 w-full flex flex-col items-center justify-evenly"
        style={{ width: '672px', height: '672px' }}
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
              type="button"
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
            <label htmlFor="nickname">
              <div className="block text-gray-700 text-sm font-bold mb-2">
                Nickname
              </div>
              <button
                className="bg-white text-sky-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setNickname(userInitialData.nickname);
                }}
              >
                Reset
              </button>
              <input
                id="nickname"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder={userInitialData.nickname}
                value={nickname}
                onChange={onChangeNickname}
              />
            </label>
            {!nickname && (
              <p className="text-red-500 text-xs italic">
                닉네임을 입력해주세요.
              </p>
            )}
          </div>
          <div className="mb-6 w-64">
            <label htmlFor="email">
              <div className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </div>
              <button
                className="bg-white text-sky-600 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => {
                  setEmail(userInitialData.email);
                }}
              >
                Reset
              </button>
              <input
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder={userInitialData.email}
                value={email}
                onChange={onChangeEmail}
              />
            </label>
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
      <ToastContainer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {},
});

export default CreateProfile;
