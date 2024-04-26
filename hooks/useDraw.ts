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
  "move",
];

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void,
  activity: string,
  imageDataStack: ImageDataStack
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const prevPoint = useRef<null | Point>(null);

  const [isDrawingShape, setIsDrawingShape] = useState(false);

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
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && canvas) {
          if (isDrawingShape) {
            imageDataStack.removeTopImageData();
            ctx.clearRect(0, 0, canvas.width ?? 0, canvas.height ?? 0);
            imageDataStack.putTopImageDataOnCanvas(ctx, canvas);
          }

          setIsDrawingShape(true);
          onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.clearRect(0, 0, canvas.width ?? 0, canvas.height ?? 0);
          imageDataStack.addImageData(imageData);
          imageDataStack.putTopImageDataOnCanvas(ctx, canvas);
        }
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
      const clickedElement = e.target as HTMLElement;
      if (toolsRef.current?.contains(clickedElement)) {
        // Clicked on tools section, don't add ImageData to the stack
        return;
      }

      if (!shapes.includes(activity)) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && canvas) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          imageDataStack.addImageData(imageData);
          imageDataStack.putTopImageDataOnCanvas(ctx, canvas);
        }
      }

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

  return { canvasRef, onMouseDown, toolsRef };
};
