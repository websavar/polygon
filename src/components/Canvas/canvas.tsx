import React, { useState, useEffect, useRef } from 'react';
import './canvas.scss';
import { drawPolygon, isClickInsideNode, setItemStorage } from 'helper/utils';
import { NodeRadius, LineWidth, CanvasWidth, CanvasHeight } from 'constants/index';

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

const storedPolygons = localStorage.getItem('polygons');
const storedIsDrawing = localStorage.getItem('isDrawing');

type Polygons = number[][][];

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D;
let offsetX: number;
let offsetY: number;
let nodeIndex: number | null = null;
let polyIndex: number | null = null;
let isDrawing: boolean = storedIsDrawing === 'true' ? true : false;

function checkResume(): Polygons {
  return window.confirm('Would you like to restore the previous session or create a new one?') ?
    storedPolygons ? JSON.parse(storedPolygons) : initialPolygons :
    initialPolygons
}


const Canvas: React.FC = () => {

  const canvasRef = useRef(null);
  const [polygons, setPolygons] = useState<Polygons>(checkResume);

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      offsetX = canvas.offsetLeft;
      offsetY = canvas.offsetTop;

      ctx = canvas.getContext('2d')!;
      ctx.lineWidth = LineWidth;

      if (!storedPolygons)
        localStorage.setItem('polygons', JSON.stringify(polygons));

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

      if (isDrawing) {
        polygons[polygons.length - 1].push([mouseX, mouseY]);
        setItemStorage(polygons);
      }

      setItemStorage(undefined, isDrawing);
      localStorage.setItem('isDrawing', JSON.stringify(isDrawing));
      drawPolygon(polygons, ctx, isDrawing);
    }
  };

  const canvasMouseUp = (): void => {
    if (!isDrawing) {
      nodeIndex = null;
      setItemStorage(polygons, isDrawing);
    }
  };

  const canvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
    if (nodeIndex !== null && !isDrawing) {
      ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
      const copyPolygons = [...polygons];

      copyPolygons[polyIndex!][nodeIndex][0] = event.clientX - offsetX;
      copyPolygons[polyIndex!][nodeIndex][1] = event.clientY - offsetY;
      setPolygons(copyPolygons);

      drawPolygon(copyPolygons, ctx, isDrawing);
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.ctrlKey && event.key === 'z' && polygons.length) {
      ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
      let copyPolygons: Polygons = [...polygons];

      copyPolygons.slice(-1)[0].splice(-1, 1);

      if (!copyPolygons.slice(-1)[0].length && copyPolygons.length > 1) {
        copyPolygons.splice(-1, 1);
        isDrawing = false;
        nodeIndex = null;
      } else {
        isDrawing = true;
      }
      setItemStorage(copyPolygons, isDrawing);
      setPolygons(copyPolygons);
      drawPolygon(copyPolygons, ctx, isDrawing);
    }
  }

  return (
    <div onKeyDown={onKeyPress} tabIndex={0} className="container-fluid h-10 p-0">
      <canvas
        width={CanvasWidth}
        height={CanvasHeight}
        ref={canvasRef}
        onMouseDown={canvasMouseDown}
        onMouseUp={canvasMouseUp}
        onMouseMove={canvasMouseMove}

      ></canvas>
    </div>
  )
}

export default Canvas;