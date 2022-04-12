import { NodeRadius, NodeColor, LineColor, FillColor } from 'constants/index';

type Polygons = number[][][];

export const drawPolygon = (polygons: Polygons, ctx: CanvasRenderingContext2D, isDrawing: boolean) => {

  let nodeX, nodeY: number;
  let index;
  let count: number = 0;
  for (let polygon of polygons) {
    ctx.beginPath();
    for (index in polygon) {
      nodeX = polygon[index][0];
      nodeY = polygon[index][1];
      ctx.lineTo(nodeX, nodeY);
    }

    if (!isDrawing)
      ctx.closePath();
    else if (count++ !== polygons.length - 1)
      ctx.closePath();

    ctx.fillStyle = FillColor;
    ctx.strokeStyle = LineColor;
    ctx.fill();
    ctx.stroke();

    for (index in polygon) {
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

export const setItemStorage = (polygons?: Polygons, isDrawing?: boolean) => {
  if (polygons !== undefined)
    localStorage.setItem('polygons', JSON.stringify(polygons));
  if (isDrawing !== undefined)
    localStorage.setItem('isDrawing', JSON.stringify(isDrawing));
}