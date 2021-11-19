import React, { useState, useEffect, useRef } from "react";
import FloodFill, {    setColorAtPixel, getColorAtPixel,} from "q-floodfill";
import { Context } from "konva/lib/Context";

function Canvas(){
    const [tool, setTool] = React.useState('pen');
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [color, setColor] = useState("#000000")
    


    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = `${window.innerWidth/2}px`;
        canvas.style.height = `${window.innerHeight/2}px`;
        canvas.style.border = `2px solid black`;

        const context = canvas.getContext("2d")  
        context.scale(2,2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = 10;
        contextRef.current = context;    
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))
    },[])

    const handleMouseDown = ({nativeEvent})=>{
        console.log(nativeEvent)
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        const {offsetX, offsetY} = nativeEvent;
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

        if(tool === "fill")
        {    //Flood Fill
            
            const floodFill = new FloodFill(imageData);

            floodFill.fill(color, Math.floor(offsetX*2), Math.floor(offsetY*2), 0)
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
        contextRef.current.strokeStyle = color;
        contextRef.current.stroke()

    }

    const handleColor = (event ) => {
        setColor(event.target.value)
        console.log(color)
    }

    return(
        <>
        <input type="color" name="color" id="" onChange={handleColor}/>
        <select 
        value={tool}
        onChange={(e) => {
            setTool(e.target.value);
        }}
        >
            <option value="pen">Pen</option>
            <option value="fill">Fill</option>
        </select>
        <div className="canvas-div">
            <canvas
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            ref={canvasRef}
            />
        </div>
        </>
    )

}

export default Canvas