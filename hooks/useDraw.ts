import { useEffect, useRef, useState } from "react";

import { ImageDataStack, Stroke, Draw, Point } from "@/types/typing";

const shapes = [
  "circle",
  "triangle",
  "line",
  "diamond",
  "rounded rectangle",
  "rectangle",
  "arrow",
];

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void,
  activity: string
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const [isDrawingShape, setIsDrawingShape] = useState(false);

  const imageDataStack = new ImageDataStack(20);

  const onMouseDown = () => {
    setMouseDown(true);
    prevPoint.current = null;
  };

  useEffect(() => {
    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;

      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");

      if (!ctx || !currentPoint) return;

      if (shapes.includes(activity) && !prevPoint.current) {
        prevPoint.current = currentPoint;
      }

      if (shapes.includes(activity)) {
        if (isDrawingShape) {
        }
        setIsDrawingShape(true);
        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      }

      if (!shapes.includes(activity)) {
        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
        prevPoint.current = currentPoint;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      setMouseDown(false);
      setIsDrawingShape(false);

      const ctx = canvasRef.current?.getContext("2d");

      const imageData = ctx.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current?.height);

      // Push the obtained ImageData to the stack
      imageDataStack.addImageData(imageData);

      // Render the topmost ImageData from the stack onto the canvas
      imageDataStack.putTopImageDataOnCanvas(ctx, canvasRef.current);
      console.log(imageDataStack.stack.length);
      prevPoint.current = null;
    };

    //Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    //Remove event listeners

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown };
};
