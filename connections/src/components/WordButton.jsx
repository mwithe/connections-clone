import React from 'react'

function WordButton({ label, handleClick, active }) {
    return (
        <button onClick={handleClick} className={active === 'True' ? 'selected-word' : 'word-card'}>
            <h4>{label}</h4>
        </button>
    )
}

export default WordButton