import React, { useState, useRef, useEffect, useCallback } from "react";
import { TbRectangle, TbLetterCase } from "react-icons/tb";
import { FaRegCircle, FaLongArrowAltRight, FaGithub } from "react-icons/fa";
import { GoDiamond } from "react-icons/go";
import { LuUndo, LuRedo } from "react-icons/lu";
import { BsDashLg } from "react-icons/bs";
import { FaDownload, FaTrashCan } from "react-icons/fa6";
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
import { HamburgerIcon } from "@chakra-ui/icons";
import rough from "roughjs/bin/rough";
import { throttle } from "lodash";

const Board = () => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentShape, setCurrentShape] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const scale = 1;

  const addShapeToHistory = (shape) => {
    setHistory((prevHistory) => [...prevHistory, shape]);
    setRedoStack([]); // Clear the redo stack on new action
  };

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastShape = history[history.length - 1];
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape !== lastShape)
    );
    setRedoStack((prevRedo) => [...prevRedo, lastShape]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  }, [history]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const lastRedo = redoStack[redoStack.length - 1];
    setShapes((prevShapes) => [...prevShapes, lastRedo]);
    setHistory((prevHistory) => [...prevHistory, lastRedo]);
    setRedoStack((prevRedo) => prevRedo.slice(0, -1));
  }, [redoStack]);

  const handleUndo = useCallback(() => {
    undo();
    setSelectedTool(null);
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
    setSelectedTool(null);
  }, [redo]);

  const redrawShapes = useCallback(() => {
    const canvas = canvasRef.current;
    const roughCanvas = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);

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
        case "text":
          ctx.font = "16px Verdana";
          ctx.fillText(shape.text, shape.x, shape.y); // Draw the text
          break;
        default:
          break;
      }
    });
    ctx.restore();
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "text") {
      setInputPosition({ x, y });
      setInputVisible(true);
    } else {
      setStartX(x);
      setStartY(y);
      setIsDrawing(true);
    }
  };

  const handleTextSubmit = (e) => {
    if (e.key === "Enter") {
      const newShape = {
        type: "text",
        x: inputPosition.x / scale,
        y: inputPosition.y / scale,
        text: textValue,
      };
      setShapes((prevShapes) => [...prevShapes, newShape]);
      addShapeToHistory(newShape); // Add to history for undo/redo functionality

      // Clear the input box
      setInputVisible(false);
      setTextValue("");
    }
  };

  const throttledDraw = useCallback(
    throttle((e) => {
      if (!isDrawing || !selectedTool) return; // Prevent drawing if no tool is selected

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const roughCanvas = rough.canvas(canvas);

      // Use the fixed canvas width and height
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Get current mouse position within the canvas
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      // Calculate the width and height for shapes based on mouse position
      const width = currentX - startX;
      const height = currentY - startY;

      requestAnimationFrame(() => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        redrawShapes();

        let newShape;

        switch (selectedTool) {
          case "rectangle":
            newShape = { type: "rectangle", startX, startY, width, height };
            roughCanvas.rectangle(startX, startY, width, height);
            break;

          case "circle":
            const radius = Math.sqrt(width * width + height * height) / 2;
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
            newShape = {
              type: "line",
              startX,
              startY,
              endX: currentX,
              endY: currentY,
            };
            roughCanvas.line(startX, startY, currentX, currentY);
            break;

          case "arrow":
            newShape = {
              type: "arrow",
              startX,
              startY,
              endX: currentX,
              endY: currentY,
            };
            roughCanvas.line(startX, startY, currentX, currentY);
            const arrowLength = 10; // Length of the arrowhead
            const angle = Math.atan2(currentY - startY, currentX - startX);
            const arrowX1 =
              currentX - arrowLength * Math.cos(angle - Math.PI / 6);
            const arrowY1 =
              currentY - arrowLength * Math.sin(angle - Math.PI / 6);
            const arrowX2 =
              currentX - arrowLength * Math.cos(angle + Math.PI / 6);
            const arrowY2 =
              currentY - arrowLength * Math.sin(angle + Math.PI / 6);
            roughCanvas.line(currentX, currentY, arrowX1, arrowY1);
            roughCanvas.line(currentX, currentY, arrowX2, arrowY2);
            break;

          default:
            break;
        }

        setCurrentShape(newShape);
      });
    }, 16),
    [isDrawing, startX, startY, selectedTool, redrawShapes]
  );

  const finishDrawing = () => {
    if (!selectedTool) return;

    setIsDrawing(false);
    if (currentShape) {
      setShapes((prevShapes) => [...prevShapes, currentShape]);
      addShapeToHistory(currentShape);
      setCurrentShape(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        handleUndo();
      } else if (e.ctrlKey && e.key === "y") {
        handleRedo();
      } else if (e.key === "r") {
        setSelectedTool("rectangle");
      } else if (e.key === "c") {
        setSelectedTool("circle");
      } else if (e.key === "d") {
        setSelectedTool("diamond");
      } else if (e.key === "l") {
        setSelectedTool("line");
      } else if (e.key === "a") {
        setSelectedTool("arrow");
      } else if (e.key === "t") {
        setSelectedTool("text");
      }
      // Add more keyboard shortcuts as needed
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRedo, handleUndo]);

  const handleDownload = () => {
    const canvas = canvasRef.current;

    // Create a new temporary canvas to avoid altering the main canvas
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Set the size of the temporary canvas to match the main canvas
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fill the temporary canvas with a white background
    tempCtx.fillStyle = "white"; // Set the background color
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height); // Fill with white

    // Draw the current canvas onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Convert the temporary canvas to a data URL
    const image = tempCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "whiteboard-drawing.png";
    link.click();
  };

  const resetCanvas = () => {
    setShapes([]);
    setHistory([]);
    setRedoStack([]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
  };

  const handleGitLink = () => {
    window.open(
      "https://github.com/Jatin748/white-board-application",
      "_blank"
    );
  };

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
              <MenuItem icon={<FaDownload />} onClick={handleDownload}>
                Export as Image
              </MenuItem>
              <MenuItem icon={<FaTrashCan />} onClick={resetCanvas}>
                Reset Canvas
              </MenuItem>
              <MenuItem icon={<FaGithub />} onClick={handleGitLink}>
                GitHub
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="flex items-center border rounded-lg p-1 shadow-sm">
          <ButtonGroup variant="ghost" spacing="-2">
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
              colorScheme={selectedTool === "text" ? "blue" : "gray"}
              onClick={() => setSelectedTool("text")}
            >
              <Icon as={TbLetterCase} />
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
          <Button size="sm" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={throttledDraw}
          onMouseUp={finishDrawing}
          className="border-2 border-gray-300 mt-5 w-full h-[500px] rounded-md bg-white"
        />

        {inputVisible && (
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={handleTextSubmit}
            style={{
              position: "absolute",
              left: `${inputPosition.x}px`,
              top: `${inputPosition.y}px`,
              fontSize: "16px",
              fontWeight: "600",
              padding: "2px 4px",
              zIndex: 10,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default Board;
