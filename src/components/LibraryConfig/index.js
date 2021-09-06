import React from 'react';
import { Button } from '@chakra-ui/button';
import { Heading } from "@chakra-ui/react"
import { Box, HStack, Text } from '@chakra-ui/layout';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import { Avatar } from '@chakra-ui/avatar';
import { constants } from '../../constants';
import { default as avatar } from '../../resources/avatar.png';

const LibraryConfig = (props) => {
  const {
    buildLibrary,
    getAlbums,
    onChangeApi,
    musicDir,
    setMusicDir,
    server
  } = props;

  return (
    <Box>
      <Heading as='h4' size='md' paddingLeft='2'>Desuplayer V2  <Avatar size='sm' src={avatar} /></Heading>
      <HStack padding='2'>
        <Text>Server:</Text>
        <InputGroup size='sm'>
          <InputLeftAddon children='http://' />
          <Input maxW='30vw' size='sm' placeholder={constants.server} value={server} onChange={(event) => onChangeApi(event.target.value)} />
        </InputGroup>
        <Text>Music Root:</Text>
        <Input maxW='30vw' size='sm' type='text' value={musicDir} onChange={(event) => setMusicDir(event.target.value)} />
        <Button size='md' onClick={buildLibrary} margin='4' padding='4'>Build</Button>
        <Button size='md' onClick={getAlbums} margin='4'>Get</Button>
      </HStack>
    </Box>
  );
};

export default LibraryConfig;