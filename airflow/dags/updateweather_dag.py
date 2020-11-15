import datetime as dt

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
import weatherdb


default_args = {
    'owner': 'me',
    'start_date': dt.datetime(2017, 6, 1),
    'retries': 1,
    'retry_delay': dt.timedelta(minutes=5),
}


with DAG('update_weather',
         default_args=default_args,
         schedule_interval='0 * * * *',
         ) as dag:

    print_start = BashOperator(task_id='print_start',
                               bash_command='echo "staring"')
    weather = PythonOperator(task_id='weather',
                                 python_callable=weatherdb.fetch)

print_start >> weather
