import datetime as dt

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
import weathertask


default_args = {
    'owner': 'me',
    'start_date': dt.datetime(2020, 1, 1),
    'retries': 5,
    'retry_delay': dt.timedelta(minutes=60),
}


with DAG('weather_history',
         default_args=default_args,
         schedule_interval='0 0 */6 * *',
         ) as dag:

    print_start = BashOperator(task_id='print_start',
                               bash_command='echo "staring"')
    weather = PythonOperator(task_id='weather',
                                 python_callable=weathertask.fetch,
                                op_kwargs={'start_date': '{{ds}}', 'end_date': '{{ macros.ds_add(ds, 6)}}', 'location': 'Kumpula'}                                 
                                 )

print_start >> weather
