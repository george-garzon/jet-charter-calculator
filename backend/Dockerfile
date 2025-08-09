# ---- base ----
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System deps for WeasyPrint + fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libpango-1.0-0 \
    libgdk-pixbuf-2.0-0 \
    libcairo2 \
    shared-mime-info \
    fonts-dejavu-core fonts-liberation \
    tzdata \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# install deps first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy only what Django needs (don’t drag node_modules/.venv/etc)
COPY manage.py ./manage.py
COPY backend ./backend

# non-root (optional but recommended)
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# If your Django project module is backend.core (manage.py usually points there)
# Dev: hot-reload server
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Prod-ish: gunicorn
CMD ["gunicorn", "backend.core.wsgi:application", "--bind", "0.0.0.0:8000"]
