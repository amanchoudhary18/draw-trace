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
  bgColor: string;
  lineWidth: number;
  opacity: number;
}

export class ImageDataStack {
  stack: ImageData[];

  constructor(maxLength: number = 20) {
    this.stack = [];
  }

  addImageData(imageData: ImageData) {
    this.stack.push(imageData);
  }

  removeTopImageData() {
    if (this.stack.length > 0) {
      this.stack.pop();
    }
  }

  putTopImageDataOnCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    if (this.stack.length > 0) {
      const topImageData = this.stack[this.stack.length - 1];
      ctx.putImageData(topImageData, 0, 0);
    }
  }

  clearStack() {
    this.stack = [];
  }
}
