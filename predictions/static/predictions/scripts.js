document.getElementById('imageUpload').addEventListener('change', function() {
    const uploadTextElement = document.getElementById('uploadText');
    const checkSpotButton = document.getElementById('checkSpotButton');
    const file = this.files[0];

    if (file) {
        uploadTextElement.textContent = file.name; // Show the selected file name
        checkSpotButton.disabled = false; // Enable the button
        checkSpotButton.classList.remove('disabled-button'); // Remove the disabled class
        checkSpotButton.classList.add('enabled-button'); // Add the enabled class
    } else {
        uploadTextElement.textContent = 'Click to Upload an Image'; // Revert text if no file is selected
        checkSpotButton.disabled = true; // Disable the button
        checkSpotButton.classList.add('disabled-button'); // Apply the disabled class
        checkSpotButton.classList.remove('enabled-button'); // Remove the enabled class
    }
});

function submitForm() {
    const formData = new FormData(document.getElementById('uploadForm'));

    fetch('/predict/', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerHTML = `
            <p>Prediction: ${data.prediction}</p>
            <button id="showImageBtn">Show Image</button>
            <img id="uploadedImage" src="data:image/jpeg;base64,${data.image}" alt="Uploaded Image">
            <button onclick="reloadPage()">Try Another Photo</button>
        `;
        document.getElementById('uploadForm').style.display = 'none';
        document.getElementById('result').style.display = 'block';

        document.getElementById('showImageBtn').addEventListener('click', function() {
            document.getElementById('uploadedImage').style.display = 'block';
            this.style.display = 'none';
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function reloadPage() {
    location.reload();
}