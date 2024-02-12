import { useState, useEffect } from 'react'
import WordButton from './components/WordButton';
import AnswerBlock from './components/AnswerBlock';
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

  // Shuffle array using the Fisher-Yates algorithm
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

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
    console.log('Result: ', result)

    if (result.result === true) {
      const answer = {
        words: selected,
        group: result.group,
        description: result.description
      };

      const correctSubmission = [...correctAnswers, answer];
      setCorrectAnswers(correctSubmission);
      console.log('Correct Answers:', correctAnswers);
      console.log('Selected before removal: ', selected)

      const test = correctAnswers;
      console.log('Test: ', test)

      // Removing the selected words from the game options
      for (const i in selected) {
        console.log('Selected Word: ', selected[i])
        setData((prevData) => prevData.filter((word) => word !== selected[i]));
      }

      // Clearing selected words (not correct at all, but works)
      clearSelected();

    } else {
      console.log('Wrong!!!')
      const guessesRemaining = guesses - 1;
      setGuesses(guessesRemaining);
      clearSelected();
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
      console.log(`Added ${newWord} from selected.`)
    }
    else {
      setSelected((prevSelected) => prevSelected.filter((word) => word !== newWord))
      console.log(`Removed ${newWord} from selected.`)
    };
  };

  const clearSelected = () => {
    for (const selectedWord in selected) {
      setSelected((prevSelected) => prevSelected.filter((word) => word === selectedWord));
      console.log('Selected after removal: ', selected)
    };
  };


  return (
    <div className='container'>
      <h3>Correct Answers: </h3>
      <div className='answers'>
        {correctAnswers.length == 0 ? <p>No guesses yet</p> :
          correctAnswers.map((answer) => (<AnswerBlock answerArray={answer} />))}
      </div>
      <h3>Options: </h3>
      <div className='options'>
        {/* {data.map((item) => (
          item.words.map((word) =>
            <div key={word}>
              <WordButton label={word} handleClick={handleClick} active={selected.some((val) => word === val) ? 'True' : 'False'} />
            </div>
          )
        ))} */}
        {data.map((word) => (
          <div key={word}>
            <WordButton label={word} handleClick={handleClick} active={selected.some((val) => word === val) ? 'True' : 'False'} />
          </div>
        ))}
      </div>
      <div className='guesses'>
        <p>Guesses remaining: {guesses}</p>
      </div>
      <div className='information'>
        <button onClick={submitAnswers} disabled={selected.length === 4 && guesses >= 1 ? false : true}>
          Submit Answers
        </button>
        <button onClick={clearSelected}>
          Clear Selected
        </button>
      </div>

    </div>
  )
}

export default App
