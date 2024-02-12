import { useState, useEffect } from 'react'
import WordButton from './components/WordButton';
import AnswerBlock from './components/AnswerBlock';
import GuessCounter from './components/GuessCounter';
import shuffleArray from './utils/shuffleArray';
import '../src/styles.css';
import 'animate.css';

function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [guesses, setGuesses] = useState(4);

  const disableGuessing = false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api')

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json();

        let words = [];

        for (let i in result) {
          for (let x in result[i].words) {
            words.push(result[i].words[x])
          }
        }
        shuffleArray(words);

        setData(words);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    fetchData();
  }, []);

  const submitAnswers = async () => {
    const dataToSend = selected.sort();
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();

    if (result.result === true) {
      const answer = {
        words: selected,
        group: result.group,
        description: result.description
      };

      const correctSubmission = [...correctAnswers, answer];
      setCorrectAnswers(correctSubmission);

      // Removing the selected words from the game options
      for (const i in selected) {
        setData((prevData) => prevData.filter((word) => word !== selected[i]));
      }

      // Clearing selected words upon successful guess
      clearSelected();

    } else {
      // On incorrect guess, guesses left reduced, if 0 remaining, disable guessing
      const guessesRemaining = guesses - 1;
      setGuesses(guessesRemaining);
      if (guesses === 0) {
        disableGuessing = true;
      }
    }
  };

  const handleClick = (e) => {
    const newWord = e.target.innerText;

    if (!selected.some((val) => newWord === val) && selected.length < 4) {
      const chosenWords = [...selected, newWord];
      setSelected(chosenWords);
    }
    else {
      setSelected((prevSelected) => prevSelected.filter((word) => word !== newWord))
    };
  };

  const clearSelected = () => {
    for (const selectedWord in selected) {
      setSelected((prevSelected) => prevSelected.filter((word) => word === selectedWord));
    };
  };


  return (
    <div className='container'>
      <h1>Connections Clone</h1>
      <div className='answers'>
        {correctAnswers.length == 0 ? <></> :
          correctAnswers.map((answer) => (<AnswerBlock answerArray={answer} />))}
      </div>
      <div className='options'>
        {data.map((word) => (
          <div key={word}>
            <WordButton label={word} handleClick={handleClick} active={selected.some((val) => word === val) ? 'True' : 'False'} />
          </div>
        ))}
      </div>
      <GuessCounter guesses={guesses} className={guesses === 4 ? 'guesses' : 'guesses-incorrect'} key={guesses} />
      <div className='information'>
        <button onClick={submitAnswers} disabled={selected.length === 4 && guesses >= 1 ? false : true} className='info-button'>
          Submit Answers
        </button>
        <button onClick={clearSelected} className='info-button'>
          Clear Selected
        </button>
      </div>
    </div>
  )
}

export default App
