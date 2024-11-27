import React from "react";
import './Square.css'

export default function Square({ children, black}){
    const bgClass = black ? 'square-black' : 'square-white'

    return(
        <div className={`${bgClass} board-square`}>
            {children}
        </div>
    )
}