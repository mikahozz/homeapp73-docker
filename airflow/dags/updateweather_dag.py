import datetime as dt

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
import weathertask


default_args = {
    'owner': 'me',
    'start_date': dt.datetime(2020, 11, 15),
    'retries': 1,
    'retry_delay': dt.timedelta(minutes=5),
}


with DAG('update_weather',
         default_args=default_args,
         schedule_interval='0 0 * * *',
         ) as dag:

    print_start = BashOperator(task_id='print_start',
                               bash_command='echo "staring"')
    weather = PythonOperator(task_id='weather',
                                 python_callable=weathertask.fetch,
                                op_kwargs={'start_date': '{{ds}}', 'end_date': '{{next_ds}}', 'location': 'Kumpula'}                                 
                                 )

print_start >> weather
