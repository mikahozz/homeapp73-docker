FROM python:3

EXPOSE 1883

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run python with -u to keep console logging active (time.sleep(1) messes it up)
CMD [ "python", "-u" , "./receiver.py"]     