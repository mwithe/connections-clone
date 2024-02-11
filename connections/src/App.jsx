import { useState, useEffect } from 'react'
import WordButton from './components/WordButton';
import '../src/styles.css'

function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api')

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const result = await response.json();
        setData(result);
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
    console.log('Result: ', result)

    if (result.result === true) {
      const correctSubmission = [...correctAnswers, selected];
      setCorrectAnswers(correctSubmission);
      console.log('Correct Answers:', correctAnswers);
      console.log('Selected before removal: ', selected)

      // Removing the selected words from the game options
      for (const x in data) {
        if (data[x].words.toString() === selected.toString()) {
          console.log('Match!')
          for (let i = 0; i <= 4; i++) {
            data[x].words.shift();
          }

        }
      }
      // Clearing selected words
      for (const selectedWord in selected) {
        setSelected((prevSelected) => prevSelected.filter((word) => word === selectedWord));
        console.log('Selected after removal: ', selected)
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


  return (
    <div className='container'>
      <div className='answers'>
        {correctAnswers.map((word) => (
          <p>{word}</p>
        ))}
      </div>
      <div className='options'>
        {data.map((item) => (
          item.words.map((word) =>
            <div key={word}>
              <WordButton label={word} handleClick={handleClick} active={selected.some((val) => word === val) ? 'True' : 'False'} />
            </div>
          )
        ))}

        <button onClick={submitAnswers} disabled={selected.length === 4 ? false : true}>
          Submit Answers
        </button>

        {selected.map((word) => (
          <p>{word}</p>
        ))}


      </div>
    </div>
  )
}

export default App
