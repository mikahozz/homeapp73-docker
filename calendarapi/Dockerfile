FROM python:3
EXPOSE 5010

WORKDIR /app
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5010", "app:app"]
#CMD ["gunicorn", "-c", "gunicorn_config.py", "src.app:application"]