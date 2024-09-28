import { AddIcon } from "@chakra-ui/icons";
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
  Textarea,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateBoardDrawer({ text }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [boardName, setBoardName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (!boardName || !ownerName || !description) {
      setError("Fill all Required Fields");
      return;
    }
    setError("");
    navigate(`/board`, {
      state: { boardName, ownerName, description },
    });
    try {
      // const response = await fetch("http://localhost:5000/api/boards", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ boardName, ownerName, description }),
      // });
      // if (!response.ok) {
      //   throw new Error("Failed to create board");
      // }
      // const createdBoard = await response.json();
      // navigate(`/board/${createdBoard._id}`, {
      //   state: { boardName, ownerName, description },
      // });
    } catch (error) {
      console.error(error);
      setError("Error creating board");
    }
    setBoardName("");
    setOwnerName("");
    setDescription("");
  };
  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
        {text}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new board
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="boardname">Board Name *</FormLabel>
                <Input
                  ref={firstField}
                  id="boardname"
                  placeholder="Enter board Name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="owner">Owner Name *</FormLabel>
                <Input
                  id="owner"
                  placeholder="Enter board Owner name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="desc">Description *</FormLabel>
                <Textarea
                  id="desc"
                  placeholder="board Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
