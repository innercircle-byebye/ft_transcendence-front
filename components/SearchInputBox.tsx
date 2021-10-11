import { SearchIcon } from "@heroicons/react/solid";
import React, { useState } from "react";

const SearchInputBox = () => {
  const [User, setUser] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const UserText = event.target;
    setUser(UserText.value);
  }

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("User", User);
    // 향후 State User 를 사용하여 <Link href={`/profile/${User}`} /> 이렇게 하면 될듯?!
  };

  return (
    <div className="mt-1 relative flex item-center rounded-md shadow-sm h-1/6 w-full">
      <input
        type="text"
        name="UserID"
        id="UserID"
        className="focus:ring-gray-500 focus:border-gray-500 block w-full h-1/6 pl-7 pr-12 sm:text-sm border-gray-300 ring-gray-300 rounded-md"
        placeholder="Search user ID"
        onChange={onChange}
      />
      <button type="button" className="absolute ml-52 h-full" onClick={onClickHandler}>
        <SearchIcon className="hover:text-black w-full h-full"/>
      </button>
    </div>
  );
};

export default SearchInputBox;
