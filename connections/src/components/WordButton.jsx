import React from 'react'

function WordButton({ label, handleClick, active }) {
    return (
        <button onClick={handleClick} className={active === 'True' ? 'selected-word' : 'word-card'}>
            {label}
        </button>
    )
}

export default WordButton