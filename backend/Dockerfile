FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install poetry

RUN poetry lock --no-update

RUN poetry config virtualenvs.create false

RUN poetry install --no-root

RUN apt-get update && apt-get install -y libgl1-mesa-glx

EXPOSE 8000
