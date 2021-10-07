import Image from "next/image";

const Login = () => {
  return (
    <div className="w-screen h-screen bg-sky-700 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <Image
          src="/Logo.png"
          alt="Logo"
          width={500}
          height={150}
          objectFit="contain"
        />
        <p className="font-light tracking-widest h-16 text-amber-200 ">
          Play Pong & Chat
        </p>
        <form className="h-60">
          <button className="group flex flex-row bg-white hover:bg-amber-600 hover:text-white text-sky-800 font-bold py-2 px-4 w-36 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:opacity-5 h-5 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute h-5 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
