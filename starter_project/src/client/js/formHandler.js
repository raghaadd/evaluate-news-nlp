import { checkForName } from './nameChecker';

const serverURL = 'http://localhost:3000/analyze';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('urlForm');
    form.addEventListener('submit', handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();

    const formText = document.getElementById('name').value;

    if (!checkForName(formText)) {
        alert('Please enter a valid URL.');
        return;
    }

    try {
        const response = await fetch(serverURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: formText }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        document.getElementById('results').innerHTML = `<p>An error occurred: ${error.message}</p>`;
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    
    if (data.error) {
        resultsDiv.innerHTML = `<p>Error: ${data.details}</p>`;
        return;
    }

    resultsDiv.innerHTML = `
        <p>Polarity: ${data.polarity}</p>
        <p>Subjectivity: ${data.subjectivity}</p>
        <p>Text: ${data.text}</p>
    `;
}

export { handleSubmit };
