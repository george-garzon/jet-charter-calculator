FROM python:3.12-slim

# System deps for WeasyPrint (PDF) — adjust if your base image differs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libpango-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libcairo2 \
    shared-mime-info \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy only to allow hot-reload via volume; this is a fallback if volume not mounted
COPY . .

EXPOSE 8000
