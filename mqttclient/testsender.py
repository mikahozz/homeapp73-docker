import paho.mqtt.client as paho
broker="raspberrypi.local"
port=1883
def on_publish(client,userdata,result):             #create function for callback
    print("data published \n")
    pass
client1= paho.Client("Test sender")                           #create client object
client1.on_publish = on_publish                          #assign function to callback
client1.connect(broker,port)                                 #establish connection
ret= client1.publish("home/sensors/testsensor","Test message from test sender")  