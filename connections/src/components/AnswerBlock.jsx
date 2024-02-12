import React from 'react';
import 'animate.css';

export default function AnswerBlock({ answerArray }) {
    return (
        <div className={`${answerArray.group} animate__animated animate__jackInTheBox`}>
            <div className={`answer-block`}>
                {answerArray.words.map((word) => (
                    <div className='answer-word' key={word}>
                        <h4>{word}</h4>
                    </div>
                ))}
            </div>
            <p className='description'>{answerArray.description}</p>
        </div>
    )
}
