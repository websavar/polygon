import React, { useState, useEffect, useRef } from 'react';
import './canvas.scss';
import { drawPolygon, isClickInsideNode } from 'helper/utils';
import { NodeRadius, LineWidth } from 'constants/index';

const initialPolygons = [
  [
    [60, 30],
    [240, 45],
    [290, 90],
    [40, 150]
  ],
  [
    [120, 250],
    [280, 270],
    [250, 459],
    [290, 490],
    [240, 498]
  ]
];

type Polygons = number[][][];

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D;
let offsetX: number;
let offsetY: number;
let nodeIndex: number | null = null;
let polyIndex: number | null = null;
let isDrawing: boolean = false;

const Canvas: React.FC = () => {

  const canvasRef = useRef(null);
  const [polygons, setPolygons] = useState<Polygons>(initialPolygons);

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      offsetX = canvas.offsetLeft;
      offsetY = canvas.offsetTop;

      ctx = canvas.getContext('2d')!;
      ctx.lineWidth = LineWidth;
      drawPolygon(polygons, ctx, isDrawing);
    }
  }, [canvasRef]);

  const getIndexes = (mouseX: number, mouseY: number): void => {
    let nodeX, nodeY: number;
    for (let polygon of polygons) {
      for (let index in polygon) {
        nodeX = polygon[index][0];
        nodeY = polygon[index][1];
        if (isClickInsideNode(nodeX, nodeY, mouseX, mouseY)) {
          nodeIndex = Number(index);
          polyIndex = polygons.indexOf(polygon);
          break;
        }
      }
      if (nodeIndex) break;
    }
  };

  const isDrawingOver = (startNode: number[], mouseX: number, mouseY: number): boolean => {
    return startNode &&
      Math.abs(startNode[0] - mouseX) < NodeRadius &&
      Math.abs(startNode[1] - mouseY) < NodeRadius &&
      polygons[polygons.length - 1].length > 2;
  };

  const canvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
    const mouseX: number = event.clientX - offsetX;
    const mouseY: number = event.clientY - offsetY;
    const startNode: number[] = polygons[polygons.length - 1][0];

    if (!isDrawing)
      getIndexes(mouseX, mouseY)

    if (nodeIndex === null) {
      if (!isDrawing) {
        polygons.push([]);
        isDrawing = true;
      }

      if (isDrawingOver(startNode, mouseX, mouseY))
        isDrawing = false;

      if (isDrawing)
        polygons[polygons.length - 1].push([mouseX, mouseY]);

      drawPolygon(polygons, ctx, isDrawing);
    }
  };

  const canvasMouseUp = (): void => {
    if (!isDrawing)
      nodeIndex = null;
  };

  const canvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
    if (nodeIndex !== null && !isDrawing) {
      ctx.clearRect(0, 0, 1000, 800);
      const copyPolygons = [...polygons];

      copyPolygons[polyIndex!][nodeIndex][0] = event.clientX - offsetX;
      copyPolygons[polyIndex!][nodeIndex][1] = event.clientY - offsetY;
      setPolygons(copyPolygons);

      drawPolygon(polygons, ctx, isDrawing);
    }
  };

  return (
    <div className="container-fluid h-10 p-0">
      <canvas
        width="1000"
        height="800"
        ref={canvasRef}
        onMouseDown={canvasMouseDown}
        onMouseUp={canvasMouseUp}
        onMouseMove={canvasMouseMove}
      ></canvas>
    </div>
  )
}

export default Canvas;