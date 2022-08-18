import React from "react";
import Question from "./Question";
import {nanoid} from "nanoid";

export default function App(){
    let [mcq,setMcq] = React.useState({
        finished: false,
        started: false,
        questions: [],
        correct: new Map(),
        numCorrect: 0
    })

    function htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    }
    
    async function newQuestions(){
        let res = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        let data = await res.json();
        data = data.results
        let temp = new Map()
        data.forEach((que,index) => {
            let i = nanoid()
            data[index] = {
                ...que,
                id: i,
                colors: ["white","white","white","white"]
            }
            temp.set(i,Math.floor(Math.random()*4))
        })
        setMcq(prev => {
            return {
                ...prev,
                correct: temp,
                numCorrect: 0,
                questions: data,
                finished: false
            }
        })
    }
    React.useEffect(() => {
        newQuestions()
    }, [])
    
    function OptionClicked(id,option){
        setMcq(prev => {
            let newQ = []
            let col = ["white","white","white","white"]
            col[option] = "blue"
            prev.questions.forEach(que => {
                if(que.id === id){
                    newQ.push({
                        ...que, 
                        colors: col,
                        selected: (mcq.correct.get(id) === option ? true : false),
                        selectedOption: option
                    })
                }else{
                    newQ.push(que)
                }
            })
            return {
                ...prev,
                questions: newQ
            }
        })
    }

    function submit(){
        let temp = [],nC = 0
        mcq.questions.forEach(que => {
            let col = ["white","white","white","white"]
            if(que.selectedOption === -1){
                col[mcq.correct.get(que.id)] = "green"
            }else if(que.selected){
                col[que.selectedOption] = "green"
                nC++
                temp.push({
                    ...que,
                    colors: col
                })
            }else{
                col[que.selectedOption] = "red"
                col[mcq.correct.get(que.id)] = "green"
                temp.push({
                    ...que,
                    colors: col
                })
            }
        })
        setMcq(prev => {
            return {
                ...prev,
                numCorrect: nC,
                questions: temp,
                finished: true
            }
        })
    }

    async function startAgain(){
        newQuestions(true)
    }

    const questions =  mcq.questions.map(que => {
        let c = 0
        let op = []
        // console.log(que)
        for (let i = 0; i < 4; i++) {
            if(i === mcq.correct.get(que.id)){
                op.push(htmlDecode(que.correct_answer));
            }else{
                op.push(htmlDecode(que.incorrect_answers[c++]));
            }
        }
        // console.log(que,op)
        return <Question
            key={que.id}
            question={htmlDecode(que.question)}
            options={op}
            handleClick1={() => OptionClicked(que.id,0)}
            handleClick2={() => OptionClicked(que.id,1)}
            handleClick3={() => OptionClicked(que.id,2)}
            handleClick4={() => OptionClicked(que.id,3)}
            colors={que.colors}
            finished={mcq.finished}
            />
    })
    
    return (
    <main>
        {!mcq.started ?
        <div style={{height: window.innerHeight}} className="home">
            <p className="home--title">Quizzical</p>
            <p className="home--desc">Welcome to the best quiz</p>
            <button className="home--button" onClick={()=>setMcq(prev=>{return {...prev,started: true}})}>Start Quiz</button>
        </div> :
        <div style={{height: window.innerHeight}} className="quiz-home">
            {questions}
            {!mcq.finished?
                <button onClick={submit} className="submit">Check Answers</button>:
                <div>
                    <p className="final">You have {mcq.numCorrect}/5 correct answers</p>
                    <button onClick={startAgain} className="play-again">Play Again!</button>
                </div>
            }
        </div>}
    </main>
    )
}
