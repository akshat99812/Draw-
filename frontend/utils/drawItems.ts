type Point = {
  x: number;
  y: number;
};

type DrawLineProps = {
  color: string;
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
  size: number;
};

export const drawLine = ({ prevPoint, currentPoint, ctx, color, size }: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = color;
  const lineWidth = size;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, size / 2, 0, 2 * Math.PI);
  ctx.fill();
};

export const drawArrow = ({ prevPoint, currentPoint, ctx, color, size }: DrawLineProps) => {
  if (!prevPoint) return;

  const { x: fromX, y: fromY } = prevPoint;
  const { x: toX, y: toY } = currentPoint;

  const headLength = 10 + size * 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);

  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));

  ctx.stroke();
};

export const drawEmptyRectangle = ({ prevPoint, currentPoint, ctx, color, size }: DrawLineProps) => {
  if (!prevPoint) return;

  const { x: startX, y: startY } = prevPoint;
  const { x: endX, y: endY } = currentPoint;
  const width = endX - startX;
  const height = endY - startY;

  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.strokeRect(startX, startY, width, height);
};

export const drawEmptyEllipse = ({ prevPoint, currentPoint, ctx, color, size }: DrawLineProps) => {
  if (!prevPoint) return;

  const { x: startX, y: startY } = prevPoint;
  const { x: endX, y: endY } = currentPoint;

  const centerX = startX + (endX - startX) / 2;
  const centerY = startY + (endY - startY) / 2;
  const radiusX = Math.abs((endX - startX) / 2);
  const radiusY = Math.abs((endY - startY) / 2);

  ctx.beginPath();
  ctx.lineWidth = size;
  ctx.strokeStyle = color;
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
};
