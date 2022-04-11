import { NodeRadius, NodeColor, LineColor, FillColor } from 'constants/index';

type Polygons = number[][][];

export const drawPolygon = (polygons: Polygons, ctx: CanvasRenderingContext2D, newDraw: boolean) => {

  let nodeX, nodeY: number;
  for (let polygon of polygons) {
    ctx.beginPath();
    for (let index in polygon) {
      nodeX = polygon[index][0];
      nodeY = polygon[index][1];
      ctx.lineTo(nodeX, nodeY);
    }
    if (!newDraw) ctx.closePath();
    ctx.fillStyle = FillColor;
    ctx.strokeStyle = LineColor;
    ctx.fill();
    ctx.stroke();

    for (let index in polygon) {
      nodeX = polygon[index][0];
      nodeY = polygon[index][1];
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, NodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = NodeColor;
      ctx.fill();
      ctx.closePath();
    }
  }
}

export const isClickInsideNode = (nodeX: number, nodeY: number, mouseX: number, mouseY: number) => {
  const dx = Math.abs(mouseX - nodeX);
  const dy = Math.abs(mouseY - nodeY);
  const distance = Math.sqrt(dx ** 2 + dy ** 2);

  return distance < NodeRadius;
}