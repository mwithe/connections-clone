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
      const correctSubmission = [...correctAnswers, selected];
      setCorrectAnswers(correctSubmission);
      console.log('Correct Answers:', correctAnswers);
      console.log('Selected before removal: ', selected)

      // Removing the selected words from the game options
      for (const i in selected) {
        console.log('Selected Word: ', selected[i])
        setData((prevData) => prevData.filter((word) => word !== selected[i]));
      }

      // Clearing selected words (not correct at all, but works)
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
      <h3>Correct Answers: </h3>
      <div className='answers'>
        {correctAnswers.map((word) => (
          <p>{word}</p>
        ))}
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
