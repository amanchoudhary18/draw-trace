"use client";

import { useDraw } from "@/hooks/useDraw";
import { FC, useState, useEffect } from "react";
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

import Image from "next/image";
import { StrokeStack, Stroke, Draw, Point } from "@/types/typing";

interface pageProps {}

const strokeStack = new StrokeStack();

const Page: FC<pageProps> = ({}) => {
  const [activity, setActivity] = useState("draw");
  const [strokeArray, setStrokeArray] = useState<Stroke>([]);
  const [lineColor, setLineColor] = useState("#000");

  const { canvasRef, onMouseDown } = useDraw(
    drawLine,
    activity,
    strokeStack,
    strokeArray,
    setStrokeArray,
    lineColor
  );

  // Pencil Gif
  const [showPencilGif, setShowPencilGif] = useState(false);

  const toggleGif = () => {
    if (activity === "draw") return;

    setShowPencilGif(true);
    handleClick("draw");
    // Show the GIF for a second and then switch back to the image
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
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    strokeStack.redrawAll(ctx);
  }

  const handleClearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);
      strokeStack.clearStack();
    }
  };

  const handleUndo = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      strokeStack.pop();
      strokeStack.redrawAll(ctx);
    }
  };

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

            <button onClick={() => handleUndo()}>Undo</button>

            {/* <button
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                activity === "erase" ? "" : "bg-gray-200 text-black-500"
              }`}
              onClick={() => handleClick("erase")}
            >
              Eraser
            </button>

            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClearCanvas}
            >
              Clear Canvas
            </button>

            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            /> */}
          </div>
        </div>
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
