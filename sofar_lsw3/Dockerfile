FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src/ .

# Run python with -u to keep console logging active (time.sleep(1) messes it up)
CMD [ "python", "-u" , "./service.py"]     