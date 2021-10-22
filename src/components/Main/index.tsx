import { FC } from 'react';
import { Flex } from '@chakra-ui/layout';
import MainPanel from '../MainPanel';

const Main: FC = () => {
  return (
    <Flex >
      <MainPanel />
    </Flex>
  );
};

export default Main;