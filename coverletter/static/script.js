document.addEventListener('DOMContentLoaded', () => {
    const jobDescriptionInput = document.getElementById('job-description');
    const resumeInput = document.getElementById('resume');
    const coverLetterOutput = document.getElementById('cover-letter');

    const saveJobDescriptionButton = document.getElementById('save-job-description');
    const generateCoverLetterButton = document.getElementById('generate-cover-letter');
    const copyCoverLetterButton = document.getElementById('copy-cover-letter');

    function updateWordCount(inputField) {
        const wordCountSpan = inputField.nextElementSibling;
        wordCountSpan.textContent = `${inputField.value.length}/5000 words`;
    }

    jobDescriptionInput.addEventListener('input', () => updateWordCount(jobDescriptionInput));
    resumeInput.addEventListener('input', () => updateWordCount(resumeInput));

    generateCoverLetterButton.addEventListener('click', async () => {
        const jobDescription = jobDescriptionInput.value;
        const resume = resumeInput.value;

        if (!jobDescription || !resume) {
            alert('Please provide both job description and resume.');
            return;
        }

        const response = await fetch('/generate_cover_letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ job_description: jobDescription, resume: resume })
        });

        if (response.ok) {
            const data = await response.json();
            coverLetterOutput.value = data.cover_letter;
        } else {
            alert('Failed to generate cover letter. Please try again.');
        }
    });

    copyCoverLetterButton.addEventListener('click', () => {
        coverLetterOutput.select();
        document.execCommand('copy');
        alert('Cover letter copied to clipboard.');
    });
});
