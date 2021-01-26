import datetime as dt

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
import weathertask


default_args = {
    'owner': 'me',
    'start_date': dt.datetime(2020, 11, 28),
    'retries': 3,
    'retry_delay': dt.timedelta(days=1),
}


with DAG('weather_refresh',
         default_args=default_args,
         schedule_interval='*/30 * * * *',
         ) as dag:

    print_start = BashOperator(task_id='print_start',
                               bash_command='echo "staring"')
    weather = PythonOperator(task_id='weather',
                                 python_callable=weathertask.fetch,
                                op_kwargs={'start_date': '{{execution_date}}', 'end_date': '{{next_execution_date}}', 'location': 'Kumpula'}                                 
                                 )

print_start >> weather
