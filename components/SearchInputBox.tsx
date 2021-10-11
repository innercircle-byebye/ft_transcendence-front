import { SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";

const SearchInputBox = () => {
  /*
  const [User, setUser] = useState("fuck you");

  const onUserHandler = (event: string) => {
    console.log(User);
    setUser(event);
    console.log(User);
  };
  */
  return (
    <div className="mt-1 relative flex item-center rounded-md shadow-sm h-1/6 w-full">
      <input
        type="text"
        name="UserID"
        id="UserID"
        className="focus:ring-gray-500 focus:border-gray-500 block w-full h-1/6 pl-7 pr-12 sm:text-sm border-gray-300 ring-gray-300 rounded-md"
        placeholder="Search user ID"
      />
      <button type="button" className="absolute ml-52 h-full">
        <SearchIcon className="hover:text-black w-full h-full" />
      </button>
    </div>
  );
};

export default SearchInputBox;
