import React from "react";

export default function Question(props) {
    return (
        <div className="mcq">
            <h2 className="que">{props.question}</h2>
            <div className="options">
                <button onClick={props.finished?()=>{}:props.handleClick1} className={"option "+props.colors[0]}>{props.options[0]}</button>
                <button onClick={props.finished?()=>{}:props.handleClick2} className={"option "+props.colors[1]}>{props.options[1]}</button>
                <button onClick={props.finished?()=>{}:props.handleClick3} className={"option "+props.colors[2]}>{props.options[2]}</button>
                <button onClick={props.finished?()=>{}:props.handleClick4} className={"option "+props.colors[3]}>{props.options[3]}</button>
            </div>
            <hr></hr>
        </div>
    )
}