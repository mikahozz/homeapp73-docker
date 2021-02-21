FROM python:3

RUN apt-get update -yqq \
    	&& apt-get upgrade -yqq \
    	&& apt-get install -yqq --no-install-recommends \
	apt-utils \
	build-essential \
	libffi-dev \
	libpq-dev \
	libssl-dev \
	python3-pandas \
	python3-numpy

ENV PYTHONPATH="${PYTHONPATH}:/usr/lib/python3/dist-packages"

RUN pip install -U pip setuptools wheel \
	&& pip install pyOpenSSL \
    	&& pip install apache-airflow[postgres]==1.10.12 \
 			--constraint "https://raw.githubusercontent.com/apache/airflow/constraints-1.10.12/constraints-3.7.txt"

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x entrypoint.sh

COPY requirements.txt .
RUN pip install -r requirements.txt

RUN mkdir scripts
COPY ./scripts /scripts

EXPOSE 8080

ENV AIRFLOW_HOME=/usr/local/airflow
ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__CORE__LOAD_DEFAULT_CONNECTIONS=False
ENV AIRFLOW__CORE__FERNET_KEY=this-should-be-unique-and-secret
ENV AIRFLOW__WEBSERVER__EXPOSE_CONFIG=True

ENTRYPOINT [ "/entrypoint.sh" ]