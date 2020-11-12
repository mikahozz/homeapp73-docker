FROM python:3.7-alpine
EXPOSE 5010

WORKDIR /app
COPY requirements.txt .

RUN apk add --update --no-cache --virtual .build-deps \
        g++ \
        python3-dev \
        libxml2 \
        libxml2-dev && \
    apk add libxslt-dev
RUN pip install --no-cache-dir -r requirements.txt
RUN apk del .build-deps

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5010", "app:app"]
#CMD ["gunicorn", "-c", "gunicorn_config.py", "src.app:application"]