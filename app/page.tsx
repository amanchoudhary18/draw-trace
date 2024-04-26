"use client";

import { useDraw } from "@/hooks/useDraw";
import { FC, useState, useEffect, useRef } from "react";
import "./page.css";
import pencilIcon from "../assets/pencil-icon.png";
import pencilGif from "../assets/pencil-gif.gif";
import eraserIcon from "../assets/eraser-icon.png";
import resetIcon from "../assets/reset.png";
import resetRedIcon from "../assets/reset-red.png";
import triangleIcon from "../assets/triangle-icon.png";
import circleIcon from "../assets/circle-icon.png";
import rectangleIcon from "../assets/rectangle-icon.png";
import diamondIcon from "../assets/diamond-icon.png";
import roundedRectangleIcon from "../assets/rounded-rectangle-icon.png";
import arrowIcon from "../assets/arrow-icon.png";
import transparentIcon from "../assets/transparent-icon.png";

import Image from "next/image";
import { ImageDataStack, Stroke, Draw, Point } from "@/types/typing";

interface pageProps {}

const imageDataStack = new ImageDataStack();

const shapes = [
  "circle",
  "triangle",
  "line",
  "diamond",
  "rounded rectangle",
  "rectangle",
  "arrow",
];

const Page: FC<pageProps> = ({}) => {
  const [activity, setActivity] = useState("move");
  const { canvasRef, onMouseDown, toolsRef } = useDraw(
    drawLine,
    activity,
    imageDataStack
  );
  const [lineColor, setLineColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [opacity, setOpacity] = useState<number>(1.0);

  const colorPickerRef = useRef(null);
  const bgColorPickerRef = useRef(null);

  const [cursorType, setCursorType] = useState("default");

  // Pencil Gif
  const [showPencilGif, setShowPencilGif] = useState(false);

  const toggleGif = () => {
    if (activity === "draw") return;

    setShowPencilGif(true);
    handleClick("draw");
    setTimeout(() => {
      setShowPencilGif(false);
    }, 1000);
  };

  // Reset Hover
  const [isResetHovered, setIsResetHovered] = useState(false);

  const handleClick = (chosenActivity: string) => {
    setActivity(chosenActivity);
  };

  useEffect(() => {
    const canvas = canvasRef?.current;
    const ctx = canvas ? canvas.getContext("2d") : null;

    const resizeCanvas = () => {
      const { width, height } = canvas?.getBoundingClientRect() || {};

      if (canvas) {
        canvas.width = width || 0;
        canvas.height = height || 0;
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const hexToRGBA = (hex: string, opacity: number) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    console.log("after conversion ", `rgba(${r}, ${g}, ${b}, ${opacity})`);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    const {
      prevPoint,
      currentPoint,
      lineColor,
      activity,
      bgColor,
      lineWidth,
      opacity,
    } = stroke;

    if (activity === "draw") {
      ctx.beginPath();
      ctx.imageSmoothingEnabled = true;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (activity === "erase") {
      const eraserRadius = 10;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(currentPoint.x, currentPoint.y, eraserRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else if (activity === "circle") {
      console.log("here", bgColor);
      const radiusX = Math.abs(currentPoint.x - prevPoint.x);
      const radiusY = Math.abs(currentPoint.y - prevPoint.y);

      ctx.beginPath();
      ctx.fillStyle = hexToRGBA(bgColor, opacity);
      ctx.strokeStyle = lineColor;

      ctx.lineWidth = 2;
      ctx.ellipse(
        prevPoint.x,
        prevPoint.y,
        radiusX,
        radiusY,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
    } else if (activity === "triangle") {
      ctx.beginPath();
      ctx.fillStyle = hexToRGBA(bgColor, opacity);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.lineTo(prevPoint.x - (currentPoint.x - prevPoint.x), currentPoint.y);
      ctx.fill();

      ctx.closePath();
      ctx.stroke();
    } else if (activity === "diamond") {
      const width = Math.abs(currentPoint.x - prevPoint.x);
      const height = Math.abs(currentPoint.y - prevPoint.y);
      const cornerRadius = 10;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(prevPoint.x + width / 2, prevPoint.y);
      ctx.lineTo(prevPoint.x + width, prevPoint.y + height / 2);
      ctx.lineTo(prevPoint.x + width / 2, prevPoint.y + height);
      ctx.lineTo(prevPoint.x, prevPoint.y + height / 2);
      ctx.fill();

      ctx.closePath();
      ctx.stroke();
    } else if (activity === "rectangle") {
      const width = Math.abs(currentPoint.x - prevPoint.x);
      const height = Math.abs(currentPoint.y - prevPoint.y);
      const startX = Math.min(currentPoint.x, prevPoint.x);
      const startY = Math.min(currentPoint.y, prevPoint.y);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = hexToRGBA(bgColor, opacity);
      ctx.strokeStyle = lineColor;
      ctx.rect(startX, startY, width, height);
      ctx.fill();

      ctx.stroke();
    } else if (activity === "rounded rectangle") {
      const width = Math.abs(currentPoint.x - prevPoint.x);
      const height = Math.abs(currentPoint.y - prevPoint.y);
      const startX = Math.min(currentPoint.x, prevPoint.x);
      const startY = Math.min(currentPoint.y, prevPoint.y);
      let cornerRadius = 10;

      cornerRadius = Math.min(cornerRadius, width / 2, height / 2);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = hexToRGBA(bgColor, opacity);
      ctx.strokeStyle = lineColor;

      ctx.moveTo(startX + cornerRadius, startY);
      ctx.arcTo(
        startX + width,
        startY,
        startX + width,
        startY + height,
        cornerRadius
      );

      ctx.arcTo(
        startX + width,
        startY + height,
        startX,
        startY + height,
        cornerRadius
      );

      ctx.arcTo(startX, startY + height, startX, startY, cornerRadius);

      ctx.arcTo(startX, startY, startX + width, startY, cornerRadius);
      ctx.fill();

      ctx.closePath();
      ctx.stroke();
    } else if (activity === "arrow") {
      ctx.beginPath();
      ctx.lineWidth = 2;

      const arrowSize = 20; // Adjust arrow size
      const angle = Math.atan2(
        currentPoint.y - prevPoint.y,
        currentPoint.x - prevPoint.x
      );

      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);

      ctx.lineTo(
        currentPoint.x - arrowSize * Math.cos(angle - Math.PI / 6),
        currentPoint.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );

      ctx.moveTo(currentPoint.x, currentPoint.y);

      ctx.lineTo(
        currentPoint.x - arrowSize * Math.cos(angle + Math.PI / 6),
        currentPoint.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );

      ctx.stroke();
    }
    if (activity === "move") {
      // Draw rectangle with dotted blue lines
      const width = Math.abs(currentPoint.x - prevPoint.x);
      const height = Math.abs(currentPoint.y - prevPoint.y);
      const startX = Math.min(currentPoint.x, prevPoint.x);
      const startY = Math.min(currentPoint.y, prevPoint.y);

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.fillStyle = hexToRGBA(bgColor, opacity);
      ctx.strokeStyle = "blue";
      ctx.rect(startX, startY, width, height);
      ctx.fill();

      ctx.stroke();
      ctx.setLineDash([]); // Reset line style
    }
  };

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    drawStroke(ctx, {
      prevPoint: prevPoint ?? currentPoint,
      currentPoint,
      activity,
      lineColor,
      bgColor,
      lineWidth,
      opacity,
    });
  }

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    imageDataStack.clearStack();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      imageDataStack.removeTopImageData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      imageDataStack.putTopImageDataOnCanvas(ctx, canvas);
    }
  };

  const colors = ["#000000", "#008000", "#FF0000", "#0000FF", "#800080"];
  const bgColors = ["#F6D6D6", "#F6F7C4", "#A1EEBD", "#7BD3EA"];

  return (
    <>
      <div className="bg-white flex justify-center items-center">
        <div
          style={{
            position: "fixed",
            top: "10px",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
          ref={toolsRef}
        >
          <div className="flex flex-row gap-5 mx-16 my-4">
            <div
              onClick={toggleGif}
              className={`p-2 rounded cursor-pointer ${
                activity === "draw" && !showPencilGif
                  ? "bg-purple-300"
                  : showPencilGif
                  ? "bg-white"
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              {showPencilGif ? (
                <Image
                  src={pencilGif}
                  alt="pencil-gif"
                  width={16}
                  height={16}
                />
              ) : (
                <Image
                  src={pencilIcon}
                  alt="pencil-icon"
                  width={16}
                  height={16}
                />
              )}
            </div>

            <div
              onClick={() => setActivity("erase")}
              className={`p-2 rounded cursor-pointer ${
                activity === "erase"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={eraserIcon}
                alt="eraser-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("circle")}
              className={`p-2 rounded cursor-pointer ${
                activity === "circle"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={circleIcon}
                alt="circle-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("triangle")}
              className={`p-2 rounded cursor-pointer ${
                activity === "triangle"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={triangleIcon}
                alt="triangle-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("diamond")}
              className={`p-2 rounded cursor-pointer ${
                activity === "diamond"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={diamondIcon}
                alt="diamond-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("rectangle")}
              className={`p-2 rounded cursor-pointer ${
                activity === "rectangle"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={rectangleIcon}
                alt="rectangle-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("rounded rectangle")}
              className={`p-2 rounded cursor-pointer ${
                activity === "rounded rectangle"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image
                src={roundedRectangleIcon}
                alt="rounded-rectangle-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={() => setActivity("arrow")}
              className={`p-2 rounded cursor-pointer ${
                activity === "arrow"
                  ? "bg-purple-300 "
                  : "bg-white hover:bg-purple-100"
              } `}
            >
              <Image src={arrowIcon} alt="arrow-icon" width={16} height={16} />
            </div>

            <div
              onClick={handleClearCanvas}
              onMouseEnter={() => setIsResetHovered(true)}
              onMouseLeave={() => setIsResetHovered(false)}
              style={{
                padding: "6px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <Image
                src={isResetHovered ? resetRedIcon : resetIcon}
                alt="reset-icon"
                width={16}
                height={16}
              />
            </div>

            <div
              onClick={handleUndo}
              style={{
                padding: "6px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Undo
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-20 left-4 rounded-2xl bg-white shadow-md">
        <div className="flex flex-col gap-6 mx-4 my-4">
          <div>
            <p className="text-xs">Stroke Color</p>
            <div className="flex flex-row mt-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-sm my-2 mx-3 ml-0"
                  style={{ backgroundColor: color, cursor: "pointer" }}
                  onClick={() => setLineColor(color)}
                ></div>
              ))}
              <div className="my-2 mx-1 h-5 border-l-2 border-gray-200"></div>

              <div
                className="w-6 h-6 rounded-sm my-1 mx-3"
                style={{ backgroundColor: lineColor, cursor: "pointer" }}
                onClick={() =>
                  colorPickerRef.current &&
                  (colorPickerRef.current as HTMLInputElement).click()
                }
              ></div>

              <div className="top-8 left-8">
                <input
                  type="color"
                  className="w-0 opacity-0 absolute"
                  onChange={(e) => setLineColor(e.target.value)}
                  value={lineColor}
                  ref={colorPickerRef}
                  style={{ top: "110px" }}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs">Background Color</p>
            <div className="flex flex-row mt-2">
              <div
                className="rounded-sm my-2 mx-3 ml-0"
                style={{ cursor: "pointer" }}
                onClick={() => setBgColor("#ffffff")}
              >
                <Image
                  src={transparentIcon}
                  alt="transparent-icon"
                  width={20}
                  height={20}
                />
              </div>
              {bgColors.map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-sm my-2 mx-3 ml-0"
                  style={{ backgroundColor: color, cursor: "pointer" }}
                  onClick={() => setBgColor(color)}
                ></div>
              ))}
              <div className="my-2 mx-1 h-5 border-l-2 border-gray-200"></div>

              {bgColor === "white" ? (
                <div
                  className="rounded-sm my-1 mx-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    bgColorPickerRef.current &&
                    (bgColorPickerRef.current as HTMLInputElement).click()
                  }
                >
                  <Image
                    src={transparentIcon}
                    alt="transparent-icon"
                    width={24}
                    height={24}
                  />
                </div>
              ) : (
                <div
                  className="w-6 h-6 rounded-sm my-1 mx-3"
                  style={{ backgroundColor: bgColor, cursor: "pointer" }}
                  onClick={() =>
                    bgColorPickerRef.current &&
                    (bgColorPickerRef.current as HTMLInputElement).click()
                  }
                ></div>
              )}

              <div className="top-8 left-8 ">
                <input
                  type="color"
                  className="w-0 opacity-0"
                  onChange={(e) => setBgColor(e.target.value)}
                  value={bgColor}
                  ref={bgColorPickerRef}
                  style={{ top: "110px" }}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs">Line Thickness</p>
            <div className="flex ">
              <div className="flex flex-row mt-2 gap-2">
                <div
                  className={`flex justify-center items-center rounded-md border ${
                    lineWidth === 4 ? "bg-purple-100" : ""
                  }`}
                  onClick={() => setLineWidth(4)}
                  style={{ height: "30px", cursor: "pointer" }}
                >
                  <div
                    className="flex justify-center items-center w-4 bg-black rounded-md mx-2 my-5"
                    style={{ height: "2px" }}
                  ></div>
                </div>

                <div
                  className={`flex justify-center items-center rounded-md border ${
                    lineWidth === 8 ? "bg-purple-100" : ""
                  }`}
                  onClick={() => setLineWidth(8)}
                  style={{ height: "30px", cursor: "pointer" }}
                >
                  <div
                    className="flex justify-center items-center w-4 bg-black rounded-md mx-2 my-5"
                    style={{ height: "4px" }}
                  ></div>
                </div>

                <div
                  className={`flex justify-center items-center rounded-md border  ${
                    lineWidth === 16 ? "bg-purple-100" : ""
                  }`}
                  onClick={() => setLineWidth(16)}
                  style={{ height: "30px", cursor: "pointer" }}
                >
                  <div
                    className="flex justify-center items-center w-4 bg-black rounded-md mx-2 my-5"
                    style={{ height: "5.5px" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {shapes.includes(activity) && (
            <div>
              <p className="text-xs">Opacity</p>
              <div className="flex">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.025"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                  className="mr-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white flex justify-center items-center">
        <canvas
          ref={canvasRef}
          className="w-screen hscreen"
          onMouseDown={onMouseDown}
        />
      </div>
    </>
  );
};

export default Page;
