# Use the official Python 3.10 image
FROM python:3.10-slim

# Set the working directory to /code
WORKDIR /code

# Install system dependencies required for OpenCV and other Python packages
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the entire project into the container
# This ensures that app/, src/, and models/ are all available
COPY . /code

# Expose port 7860 (Hugging Face Spaces default port)
EXPOSE 7860

# Start the FastAPI application on port 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
