import { SearchIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

const SearchUserInputBox = () => {
  const [user, setUser] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const userText = event.target;
    setUser(userText.value);
  }

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("User", user);
    // 향후 State User 를 사용하여 <Link href={`/profile/${User}`} /> 이렇게 하면 될듯?!
  };

  return (
    <div className="mt-1 relative flex item-center rounded-md shadow-sm w-full">
      <input
        type="text"
        name="userNickName"
        className="focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 ring-gray-300 rounded-md"
        placeholder="Search user Nickname"
        onChange={onChange}
        value={user}
      />
      <button type="button" className="absolute ml-52 h-full" onClick={onClickHandler}>
        <SearchIcon className="hover:text-black w-full h-full"/>
      </button>
    </div>
  );
};

export default SearchUserInputBox;
