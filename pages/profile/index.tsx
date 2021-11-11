import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();

  console.log(router);

  return <div>profile page</div>;
};

export default Profile;
