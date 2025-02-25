// storage.js

// Asynchronous function to get all scores
export const getScores = async () => {
  try {
      const response = await fetch('/scores');
      const scores = await response.json();
      return scores; // Return the scores array
  } catch (error) {
      console.error('Error fetching scores:', error);
      return []; // Return an empty array on error
  }
};

// Asynchronous function to save a score and name
export const saveScore = async (name, score) => {
  try {
      const response = await fetch('/scores', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ score, name }),
      });
      const result = await response.json();
      console.log(result); // Log the result
      return result; // Return the result for further processing
  } catch (error) {
      error('Error saving score:', error);
  }
};