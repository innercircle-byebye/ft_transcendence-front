import { useRouter } from 'next/router';

const Search = () => {
  const router = useRouter();
  const { name } = router.query;

  return <div>{name}</div>;
};

export default Search;
