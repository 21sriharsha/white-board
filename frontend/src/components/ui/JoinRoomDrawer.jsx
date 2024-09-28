import { Search2Icon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Stack,
  Box,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
export default function JoinRoomDrawer({ text }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [roomId, setRoomId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = () => {
    if (!roomId || !passcode) {
      setError("Fill all Required Fields");
      return;
    } else {
      console.log({ roomId, passcode });
      setError("");
      onClose();
      setPasscode("");
      setRoomId("");
    }
  };
  const handleDrawerClose = () => {
    onClose();
    setError("");
    setPasscode("");
    setRoomId("");
  };
  return (
    <>
      <Button leftIcon={<Search2Icon />} colorScheme="gray" onClick={onOpen}>
        {text}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={handleDrawerClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Join a room</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="roomId">Room Id *</FormLabel>
                <Input
                  ref={firstField}
                  id="roomId"
                  placeholder="Enter Room Id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="passcode">Passcode *</FormLabel>
                <Input
                  id="passcode"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </Box>
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSubmit}>
              Join Now
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
