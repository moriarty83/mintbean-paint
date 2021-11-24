import { useState } from "react";
import About from "./About";





function Footer () {

const [infoOn, setInfoOn] = useState(false)

const handleEnter = ()=>{
    setInfoOn(true)
}

const handleExit = ()=>{
    setInfoOn(false)
}
    return(
        <div className="foot-container" onMouseLeave={handleExit}>
            <div className={infoOn ? "about-div " : "about-div hidden"}>
                <h1>About Christopher Moriarty</h1>
                <p>I’m a Software Engineer with a background in Business Management and Customer Experience. Thanks to my extensive experience in e-commerce and nonprofit organizations, I approach each project with an empathetic and user-focused perspective. By coupling analytical skills with a love of learning, I am able to solve complex and systematic problems in my pursuit of building unique and empowering experiences that inspire joy and wonder.
                <br /><br />
                Technical Skills:<br />
                JavaScript | TypeScript | Express | React | HTML | CSS | EJS | JSX | C# | Python | Django | Flask | Git | GitHub | MySQL | Mongo DB | Mongoose | Unity 3D | PhotoShop | Machine Learning | Markdown | Contentful CMS</p>
            </div>
            <footer>
                <p onMouseEnter={handleEnter} >Page by Christopher Moriarty <br />Hover here to learn about the developer.</p>
                <p className="version">DRAW Version 0.1</p>
                
            </footer>
        </div>
        
    )
}

export default Footer;