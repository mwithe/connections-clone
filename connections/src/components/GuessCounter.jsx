import React from 'react'

export default function GuessCounter({ guesses, className }) {
    return (
        <div className={`${className}`}>
            <p>Guesses Remaining: {guesses}</p>
        </div>
    )
}
