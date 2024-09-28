import React, { useState, useRef, useEffect, useCallback } from "react";
import { TbRectangle, TbPencil, TbLetterCase } from "react-icons/tb";
import {
  FaRegCircle,
  FaRegHandPaper,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { GoDiamond } from "react-icons/go";
import { FiImage } from "react-icons/fi";
import { LuEraser, LuUndo, LuRedo } from "react-icons/lu";
import { BsDashLg } from "react-icons/bs";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  ButtonGroup,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from "@chakra-ui/icons";
import rough from "roughjs/bin/rough";
import { throttle } from "lodash";

const Board = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [pencilPath, setPencilPath] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const addShapeToHistory = (shape) => {
    setHistory((prevHistory) => [...prevHistory, shape]);
    setRedoStack([]); // Clear the redo stack on new action
  };
  const undo = () => {
    if (history.length === 0) return;
    const lastShape = history[history.length - 1];
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape !== lastShape)
    );
    setRedoStack((prevRedo) => [...prevRedo, lastShape]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const lastRedo = redoStack[redoStack.length - 1];
    setShapes((prevShapes) => [...prevShapes, lastRedo]);
    setHistory((prevHistory) => [...prevHistory, lastRedo]);
    setRedoStack((prevRedo) => prevRedo.slice(0, -1));
  };

  const handleUndo = () => {
    undo();
    setSelectedTool(null);
  };

  const handleRedo = () => {
    redo();
    setSelectedTool(null);
  };

  const redrawShapes = useCallback(() => {
    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);

    shapes.forEach((shape) => {
      switch (shape.type) {
        case "rectangle":
          roughCanvas.rectangle(
            shape.startX,
            shape.startY,
            shape.width,
            shape.height
          );
          break;
        case "circle":
          roughCanvas.circle(shape.centerX, shape.centerY, shape.radius * 2);
          break;
        case "diamond":
          roughCanvas.polygon(shape.points);
          break;
        case "line":
          roughCanvas.line(shape.startX, shape.startY, shape.endX, shape.endY);
          break;
        case "arrow":
          const arrowLength = 10; // Length of the arrowhead
          const angle = Math.atan2(
            shape.endY - shape.startY,
            shape.endX - shape.startX
          );
          const arrowX1 =
            shape.endX - arrowLength * Math.cos(angle - Math.PI / 6);
          const arrowY1 =
            shape.endY - arrowLength * Math.sin(angle - Math.PI / 6);
          const arrowX2 =
            shape.endX - arrowLength * Math.cos(angle + Math.PI / 6);
          const arrowY2 =
            shape.endY - arrowLength * Math.sin(angle + Math.PI / 6);
          roughCanvas.line(shape.startX, shape.startY, shape.endX, shape.endY);
          roughCanvas.line(shape.endX, shape.endY, arrowX1, arrowY1);
          roughCanvas.line(shape.endX, shape.endY, arrowX2, arrowY2);
          break;
        default:
          break;
      }
    });
  }, [shapes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      redrawShapes(); // Redraw shapes after resizing
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redrawShapes]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setStartY(e.clientY - rect.top);
    setIsDrawing(true);
  };

  const throttledDraw = useCallback(
    throttle((e) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const roughCanvas = rough.canvas(canvas);
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      const width = endX - startX;
      const height = endY - startY;

      requestAnimationFrame(() => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        redrawShapes();

        let newShape;
        switch (selectedTool) {
          case "rectangle":
            newShape = { type: "rectangle", startX, startY, width, height };
            roughCanvas.rectangle(startX, startY, width, height);
            break;
          case "circle":
            const radius =
              Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
            newShape = {
              type: "circle",
              centerX: startX + width / 2,
              centerY: startY + height / 2,
              radius,
            };
            roughCanvas.circle(
              startX + width / 2,
              startY + height / 2,
              radius * 2
            );
            break;
          case "diamond":
            const midX = startX + width / 2;
            const midY = startY + height / 2;
            const diamondPoints = [
              [midX, startY],
              [startX + width, midY],
              [midX, startY + height],
              [startX, midY],
            ];
            newShape = { type: "diamond", points: diamondPoints };
            roughCanvas.polygon(diamondPoints);
            break;
          case "line":
            newShape = { type: "line", startX, startY, endX, endY };
            roughCanvas.line(startX, startY, endX, endY);
            break;
          case "arrow":
            newShape = { type: "arrow", startX, startY, endX, endY };
            roughCanvas.line(startX, startY, endX, endY);
            const arrowLength = 10; // Length of the arrowhead
            const angle = Math.atan2(endY - startY, endX - startX);
            const arrowX1 = endX - arrowLength * Math.cos(angle - Math.PI / 6);
            const arrowY1 = endY - arrowLength * Math.sin(angle - Math.PI / 6);
            const arrowX2 = endX - arrowLength * Math.cos(angle + Math.PI / 6);
            const arrowY2 = endY - arrowLength * Math.sin(angle + Math.PI / 6);
            roughCanvas.line(endX, endY, arrowX1, arrowY1);
            roughCanvas.line(endX, endY, arrowX2, arrowY2);
            break;
          case "pencil":
            const newPoint = { x: endX, y: endY };
            setPencilPath((prevPath) => [...prevPath, newPoint]);
            roughCanvas.linearPath([...pencilPath, newPoint]);
            newShape = { type: "pencil", path: [...pencilPath, newPoint] };
            break;
          default:
            break;
        }
        setCurrentShape(newShape);
      });
    }, 16),
    [isDrawing, startX, startY, selectedTool, pencilPath, redrawShapes]
  );

  const finishDrawing = () => {
    setIsDrawing(false);
    if (currentShape) {
      setShapes((prevShapes) => [...prevShapes, currentShape]);
      addShapeToHistory(currentShape); // Add to history when the shape is finalized
      setCurrentShape(null);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redrawShapes();
  }, [shapes, redrawShapes]);

  // const handleContextMenu = (e) => {
  //   e.preventDefault();
  // };

  return (
    <div className="p-5">
      <div className="flex items-center justify-around md:justify-between">
        <div>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem icon={<AddIcon />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                New Window
              </MenuItem>
              <MenuItem icon={<RepeatIcon />} command="⌘N">
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<EditIcon />} command="⌘O">
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="flex items-center border rounded-lg p-1">
          <ButtonGroup variant="ghost" spacing="-2">
            <Button
              size="sm"
              colorScheme={selectedTool === "hand" ? "blue" : "gray"}
              onClick={() => setSelectedTool("hand")}
            >
              <Icon as={FaRegHandPaper} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "rectangle" ? "blue" : "gray"}
              onClick={() => setSelectedTool("rectangle")}
            >
              <Icon as={TbRectangle} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "circle" ? "blue" : "gray"}
              onClick={() => setSelectedTool("circle")}
            >
              <Icon as={FaRegCircle} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "diamond" ? "blue" : "gray"}
              onClick={() => setSelectedTool("diamond")}
            >
              <Icon as={GoDiamond} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "line" ? "blue" : "gray"}
              onClick={() => setSelectedTool("line")}
            >
              <Icon as={BsDashLg} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "arrow" ? "blue" : "gray"}
              onClick={() => setSelectedTool("arrow")}
            >
              <Icon as={FaLongArrowAltRight} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "image" ? "blue" : "gray"}
              onClick={() => setSelectedTool("image")}
            >
              <Icon as={FiImage} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "text" ? "blue" : "gray"}
              onClick={() => setSelectedTool("text")}
            >
              <Icon as={TbLetterCase} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "pencil" ? "blue" : "gray"}
              onClick={() => setSelectedTool("pencil")}
            >
              <Icon as={TbPencil} />
            </Button>
            <Button
              size="sm"
              colorScheme={selectedTool === "eraser" ? "blue" : "gray"}
              onClick={() => setSelectedTool("eraser")}
            >
              <Icon as={LuEraser} />
            </Button>
            <Button
              size="sm"
              onClick={handleUndo}
              disabled={history.length === 0}
            >
              <Icon as={LuUndo} />
            </Button>
            <Button
              size="sm"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
            >
              <Icon as={LuRedo} />
            </Button>
          </ButtonGroup>
        </div>
        <div className="hidden md:block">
          <Button size="sm">Share</Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-300 mt-5 w-full h-[500px] rounded-md"
        onMouseDown={startDrawing}
        onMouseMove={throttledDraw}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        // onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default Board;
