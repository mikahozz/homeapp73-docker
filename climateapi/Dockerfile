FROM python:3.6.7
EXPOSE 5011

WORKDIR /app
COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["gunicorn", "--bind", "0.0.0.0:5011", "--reload", "app:app"]
#CMD ["gunicorn", "-c", "gunicorn_config.py", "src.app:application"]