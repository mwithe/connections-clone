import { useState, useEffect } from 'react'
import WordButton from './components/WordButton';
import '../src/styles.css'

function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

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
    console.log('Data: ', data);

  }, []);

  const submitAnswers = async () => {
    const dataToSend = selected;
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();
    console.log('Result: ', result)
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

  console.log('DATA: ', data);

  return (
    <main>
      {/* {data.map((word) => (
        <div key={word.key}>
          <WordButton label={word.word} handleClick={handleClick} active={selected.some((val) => word.word === val) ? 'True' : 'False'} />
        </div>
      ))} */}



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
    </main>
  )
}

export default App
