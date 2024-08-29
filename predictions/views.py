from django.shortcuts import render
from django.http import JsonResponse
from PIL import Image
import numpy as np
import pickle
import base64
from io import BytesIO

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)


def preprocess_image(image):
    image = image.convert('RGB')  # Ensure image has 3 channels
    image = image.resize((224, 224))  # Resize to 224x224 pixels
    image = np.array(image) / 255.0
    image = image.flatten()  # Flatten the image to a 1D array of length 150528
    image = np.expand_dims(image, axis=0)  # Add batch dimension to make it (1, 150528)
    return image


def predict(request):
    if request.method == 'POST' and 'file' in request.FILES:
        image = Image.open(request.FILES['file'])
        processed_image = preprocess_image(image)
        prediction = model.predict(processed_image)
        result = "Malignant" if prediction[0] == 0 else "Benign"

        # Convert the image to base64
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

        return JsonResponse({'prediction': result, 'image': img_str})

    return JsonResponse({'error': 'Invalid request'}, status=400)


def upload_view(request):
    return render(request, 'predictions/upload.html')