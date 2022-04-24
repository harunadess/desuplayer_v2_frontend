import { FC } from 'react';
import { Button } from '@chakra-ui/button';
import { Heading } from "@chakra-ui/react"
import { Box, HStack, Stack, StackItem, Text } from '@chakra-ui/layout';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { Avatar } from '@chakra-ui/avatar';
import { constants } from '../../constants';
import { default as avatar } from '../../resources/avatar.png';

interface Props {
  buildLibrary: () => void;
  getAllArtists: () => void;
  onChangeApi: (uri: string) => void;
  musicDir: string;
  setMusicDir: (path: string | ((prevState: string) => string)) => void;
  server: string;
}

const LibraryConfig: FC<Props> = (props) => {
  const {
    buildLibrary,
    getAllArtists,
    onChangeApi,
    musicDir,
    setMusicDir,
    server
  } = props;

  return (
    <Box w='90vw'>
      <Heading as='h4' size='md'>Desuplayer V2  <Avatar size='sm' src={avatar} /></Heading>
      <HStack spacing='24'>
        <StackItem paddingLeft='2'>
          <Text>Server:</Text>
          <InputGroup size='sm'>
            <InputLeftAddon children='http://' />
            <Input maxW='30vw' size='sm' placeholder={constants.server} value={server} onChange={(event) => onChangeApi(event.target.value)} />
          </InputGroup>
        </StackItem>
        <StackItem>
          <Text>Music Root:</Text>
          <Input maxW='30vw' size='sm' type='text' value={musicDir} onChange={(event) => setMusicDir(event.target.value)} />
        </StackItem>
        <StackItem>
          <Button size='md' onClick={buildLibrary} marginLeft='4'>Build</Button>
          <Button size='md' onClick={getAllArtists} marginLeft='4'>Get</Button>
        </StackItem>
      </HStack>
    </Box>
  );
};

export default LibraryConfig;