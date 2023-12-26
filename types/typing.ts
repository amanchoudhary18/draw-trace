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

export class ImageDataStack {
  stack: ImageData[];

  constructor(maxLength: number = 20) {
    this.stack = [];
  }

  addImageData(imageData: ImageData) {
    this.stack.push(imageData);

    console.log(this.stack);
  }

  removeTopImageData() {
    console.log(this.stack);
    if (this.stack.length > 0) {
      this.stack.pop();
    } else {
      console.log("Stack is empty");
    }
  }

  putTopImageDataOnCanvas(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    if (this.stack.length > 0) {
      const topImageData = this.stack[this.stack.length - 1];
      ctx.putImageData(topImageData, 0, 0);
    } else {
      console.log("Stack is empty");
    }
  }

  clearStack() {
    this.stack = [];
  }
}
