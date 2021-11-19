import React, { useState, useEffect, useRef } from "react";
import FloodFill from "q-floodfill";
import { Context } from "konva/lib/Context";

function Canvas(){
    const [tool, setTool] = React.useState('pen');
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [imageData, setImageData] = useState(null)


    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth*2;
        canvas.height = window.innerHeight *2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext("2d")  
        context.scale(2,2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;    
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))
    },[])

    const handleMouseDown = ({nativeEvent})=>{
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        const {offsetX, offsetY} = nativeEvent;
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

        if(tool === "fill")
        {    //Flood Fill
            
            const floodFill = new FloodFill(imageData);

            floodFill.fill("#9f3282", offsetX, offsetY, 0)
            contextRef.current.putImageData(floodFill.imageData, 0, 0)
        }
        if(tool === "pen"){
        // Draw
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);}
    }

    const handleMouseUp = ()=> {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        contextRef.current.closePath();
        setIsDrawing(false);
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

    }

    const handleMouseMove = ({nativeEvent})=>{
        if(isDrawing === false){return}
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()

    }

    return(
        <>
        <select 
        value={tool}
        onChange={(e) => {
            setTool(e.target.value);
        }}
        >
            <option value="pen">Pen</option>
            <option value="fill">Fill</option>
        </select>
        <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        />
        </>
    )

}

export default Canvas