import { handleSubmit } from './js/formHandler'
import './styles/resets.scss'
import './styles/base.scss'
import './styles/footer.scss'
import './styles/form.scss'
import './styles/header.scss'

alert(`I EXIST :::`);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('urlForm');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const url = document.getElementById('name').value;

        try {
            const response = await fetch('http://localhost:3000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            resultsDiv.innerHTML = `
                <p>Polarity: ${data.polarity}</p>
                <p>Subjectivity: ${data.subjectivity}</p>
                <p>Text: ${data.text}</p>
            `;
        } catch (error) {
            resultsDiv.innerHTML = `<p>An error occurred while analyzing the URL: ${error.message}</p>`;
        }
    });
});


