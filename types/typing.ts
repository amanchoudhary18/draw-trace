export type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

export type Point = { x: number; y: number };

export interface Stroke {
  prevPoint: Point;
  currentPoint: Point;
  activity: string;
  lineColor: string;
}

export class StrokeStack {
  stack: Stroke[][];

  drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    const { prevPoint, currentPoint, lineColor, activity } = stroke;

    if (activity === "draw") {
      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
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
      const radiusX = Math.abs(currentPoint.x - prevPoint.x);
      const radiusY = Math.abs(currentPoint.y - prevPoint.y);

      ctx.beginPath();
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
      ctx.stroke();
    } else if (activity === "triangle") {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.lineTo(prevPoint.x - (currentPoint.x - prevPoint.x), currentPoint.y);
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
      ctx.closePath();
      ctx.stroke();
    } else if (activity === "rectangle") {
      const width = Math.abs(currentPoint.x - prevPoint.x);
      const height = Math.abs(currentPoint.y - prevPoint.y);
      const startX = Math.min(currentPoint.x, prevPoint.x);
      const startY = Math.min(currentPoint.y, prevPoint.y);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.rect(startX, startY, width, height);
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

      // Draw the arrow line
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);

      // Draw the arrowhead
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
  };

  constructor() {
    this.stack = [];
  }

  push(stroke: Stroke[]) {
    this.stack.push(stroke);
  }

  pop(): Stroke[] | undefined {
    return this.stack.pop();
  }

  redrawAll(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.stack.forEach((strokes) => {
      strokes.forEach((stroke) => {
        this.drawStroke(ctx, stroke);
      });
    });
  }

  clearStack() {
    this.stack.length = 0;
  }
}
