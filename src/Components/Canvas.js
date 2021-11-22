/////////////////////////
// DEPENDENCIES
/////////////////////////
// React
import React, { useState, useEffect, useRef } from "react";
// Flood Fill
import FloodFill, {    setColorAtPixel, getColorAtPixel,} from "q-floodfill";
// Saving Image
import canvasToImage from 'canvas-to-image';

import offset from 'mouse-event-offset';

function Canvas(){

    /////////////////////////
    // STATES
    /////////////////////////
    const [tool, setTool] = React.useState('pen');
    const [isDrawing, setIsDrawing] = useState(false);
    const [imageData, setImageData] = useState(null);
    const [color, setColor] = useState("#000000")
    const [stroke, setStroke] = useState(3);
    
    /////////////////////////
    // REFs
    /////////////////////////
    const canvasRef = useRef(null);
    const contextRef = useRef(null);


    // Establishes Refs and States on initial load.
    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
        canvas.style.width = `${window.innerWidth/2}px`;
        canvas.style.height = `${window.innerWidth/2}px`;
        canvas.style.border = `2px solid black`;

        const context = canvas.getContext("2d")  
        context.scale(2,2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = stroke;
        contextRef.current = context;
        
        // Fill
        const floodFill = new FloodFill(context.getImageData(0, 0, canvas.width, canvas.height));
        floodFill.fill("#FFFFFF", Math.floor(1*2), Math.floor(1*2), 0)
        contextRef.current.putImageData(floodFill.imageData, 0, 0)

        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

    },[])

    // Initiates Draw or Fill
    const handleMouseDown = ({nativeEvent})=>{
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")
        const offsetX = offset(nativeEvent, canvas)[0]
        const offsetY = offset(nativeEvent, canvas)[1]

        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

        if(tool === "fill")
        {    //Flood Fill

            const floodFill = new FloodFill(imageData);

            floodFill.fill(color, Math.floor(offsetX*2), Math.floor(offsetY*2), 0)
            contextRef.current.putImageData(floodFill.imageData, 0, 0)
        }
        if(tool === "pen"){
        // Draw
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = stroke;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);}
    }

    // End Draw
    const handleMouseUp = ()=> {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        contextRef.current.closePath();
        setIsDrawing(false);
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height))

    }

    // Draw
    const handleMouseMove = ({nativeEvent})=>{
        nativeEvent.stopImmediatePropagation()
        if(isDrawing === false){return}
        const canvas = canvasRef.current;
        const offsetX = offset(nativeEvent, canvas)[0]
        const offsetY = offset(nativeEvent, canvas)[1]
        contextRef.current.lineTo(offsetX, offsetY)
    
        contextRef.current.stroke()

    }


    
    // Set Color
    const handleColor = (event ) => {
        setColor(event.target.value)
    }

    // End drawing
    const handleStroke = (event)=>{
        setStroke(+event.target.value)
    }

    // Download Image
    const handleDownload = (el)=>{
        const canvas = canvasRef.current;
        canvasToImage(canvas, {
            name: 'myImage',
            type: 'png',
            quality: 1.0
          });;
    }

    // Clear Canvas
    const handleClear = ()=>{
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        setImageData(context.clearRect(0, 0, canvas.width, canvas.height));

    }


    return(
        <>
        <div className="canvas-container">
            {/* TOOLS */}
            <div className="toolbox">
                <div className="tool">
                    <label for="color">Color</label>
                    <input type="color" name="color" id="" onChange={handleColor}/>
                </div>

                <div className="tool">
                <label for="stroke">Stroke</label>
                <input type="range" name="stroke" min="1" max="20" step="1" value={stroke} onChange={handleStroke}/>
                <span>{stroke}</span>
                </div>

                <div className="tool">
                    <label for="tool">Tool</label>
                    <select 
                    name="tool"
                    value={tool}
                    onChange={(e) => {
                        setTool(e.target.value);
                    }}
                    >
                        <option value="pen">Pen</option>
                        <option value="fill">Fill</option>
                    </select>
                </div>
                
            </div>

            {/* CANVAS */}
            <div className="canvas-div">
                <canvas
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onTouchMove={handleMouseMove}

                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                />
            </div>

            {/* BUTTONS */}
            <div className="button-div">
                <button onClick={handleClear}>Clear Canvas</button>
                <button onClick={handleDownload}>Download</button>
            </div>
        </div>
        </>
    )

}

export default Canvas