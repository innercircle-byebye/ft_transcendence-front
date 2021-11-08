import { useRouter } from 'next/router';

const Search = () => {
  const router = useRouter();

  console.log(router);

  return <div>search page</div>;
};

export default Search;
