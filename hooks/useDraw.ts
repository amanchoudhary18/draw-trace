import { useEffect, useRef, useState } from "react";

import { StrokeStack, Stroke, Draw, Point } from "@/types/typing";

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
  activity: string,
  strokeStack: StrokeStack,
  strokeArray: Stroke[],
  setStrokeArray: React.Dispatch<React.SetStateAction<Stroke[]>>,
  lineColor: string
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const [isDrawingShape, setIsDrawingShape] = useState(false);

  const onMouseDown = () => {
    setMouseDown(true);
    prevPoint.current = null;

    setStrokeArray([]);
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
          strokeStack.pop();
        }
        setStrokeArray([
          {
            prevPoint: prevPoint.current ?? currentPoint,
            currentPoint,
            activity,
            lineColor,
          },
        ]);

        strokeStack.push(strokeArray);

        setIsDrawingShape(true);
        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      }

      if (!shapes.includes(activity)) {
        if (isDrawingShape) {
          strokeStack.pop();
        }

        setStrokeArray([
          ...strokeArray,
          {
            prevPoint: prevPoint.current ?? currentPoint,
            currentPoint,
            activity,
            lineColor,
          },
        ]);

        setIsDrawingShape(true);

        strokeStack.push(strokeArray);
        onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
        prevPoint.current = currentPoint;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      setMouseDown(false);
      setIsDrawingShape(false);

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
