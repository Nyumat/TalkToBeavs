import { Avatar, Box, Divider, Flex, Heading } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProfilePostList from '../../components/card/ProfilePostList';
import FollowButton from '../../components/custom/FollowButton';
import FollowStats from '../../components/text/FollowStats';
import usePosts from '../../hooks/usePosts';
import useProfile from '../../hooks/useProfile';

export default function Profile() {
  const { onid } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const profile = useProfile({ onid, user });
  const posts = usePosts({ onid });
  useEffect(() => {
    document.querySelector('title').innerHTML = `${onid}'s Profile`;

    return () => {
      document.querySelector('title').innerHTML = 'Talk2Beavs - OSU CS494';
    };
  }, [onid]);

  return (
    profile && (
      <>
        <Box w='100%' h='100%' py={8}>
          <Flex direction='column' align='center' justify='center' w='100%' h='100%'>
            <Avatar size='2xl' name={profile.name} src={profile.avatarImg} mb={4} />
            <FollowButton user={profile} />
            <Heading as='h1' size='2xl' mb={4}>
              {profile.name.charAt(0).toUpperCase() + profile.name.slice(1)}
            </Heading>
            <Divider
              w={{
                base: '50%',
                sm: '60%',
                md: '50%',
                lg: '55%',
              }}
              mb={4}
            />

            <FollowStats onid={onid} user={user} />

            <Divider
              w={{
                base: '50%',
                sm: '60%',
                md: '50%',
                lg: '55%',
              }}
              mb={4}
            />
            <Heading as='h2' size='lg' mt={8} mb={4}>
              {onid}'s Posts
              <Divider mt={2} />
            </Heading>

            <ProfilePostList posts={posts} />
          </Flex>
        </Box>
      </>
    )
  );
}
