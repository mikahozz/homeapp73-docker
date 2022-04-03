#!/usr/bin/python3
# Script gathering solar data from Sofar Solar Inverter (K-TLX) via logger module LSW-3/LSE
# by Michalux (based on DEYE script by jlopez77, HA initial code by pablolite).
# Version: 1.83
#

import sys
import socket
import binascii
import re
from tabnanny import verbose
import libscrc
import json
import configparser
import datetime
from datetime import datetime

class Inverter:
  def __init__(self) -> None:
    print("Initializing the inverter logic")
    # CONFIG
    configParser = configparser.RawConfigParser()
    configFilePath = r'./config.cfg'
    configParser.read(configFilePath)

    self.inverter_ip=configParser.get('SofarInverter', 'inverter_ip')
    self.inverter_port=int(configParser.get('SofarInverter', 'inverter_port'))
    self.inverter_sn=int(configParser.get('SofarInverter', 'inverter_sn'))
    self.reg_start1=(int(configParser.get('SofarInverter', 'register_start1'),0))
    self.reg_end1=(int(configParser.get('SofarInverter', 'register_end1'),0))
    self.reg_start2=(int(configParser.get('SofarInverter', 'register_start2'),0))
    self.reg_end2=(int(configParser.get('SofarInverter', 'register_end2'),0))
    self.lang=configParser.get('SofarInverter', 'lang')
    self.verbose=configParser.get('SofarInverter', 'verbose')
    # END CONFIG

  def twosComplement_hex(self, hexval, reg):
    if hexval=="":
      print("No value in response for register "+reg)
      print("Check register start/end values in config.cfg")
      sys.exit(1)
    bits = 16
    val = int(hexval, bits)
    if val & (1 << (bits-1)):
      val -= 1 << bits
    return val

  def GetData(self):
    # PREPARE & SEND DATA TO THE INVERTER
    output="{" # initialise json output
    pini=self.reg_start1
    pfin=self.reg_end1
    chunks=0
    totalpower=0
    totaltime=0
    invstatus=1

    # OPEN CONNECTION TO LOGGER
    if self.verbose=="1": print("Connecting to logger... ", end='');
    for res in socket.getaddrinfo(self.inverter_ip, self.inverter_port, socket.AF_INET, socket.SOCK_STREAM):
      family, socktype, proto, canonname, sockadress = res
      try:
        clientSocket= socket.socket(family, socktype, proto);
        clientSocket.settimeout(10);
        clientSocket.connect(sockadress);
      except socket.error as msg:
        print(f"Could not open socket to {self.inverter_ip}:{self.inverter_port} - inverter/logger turned off");
        invstatus=0;

    if invstatus==1:
      if self.verbose=="1": print("connected successfully !");
      while chunks<2:
        # Data frame begin
        start = binascii.unhexlify('A5') #start
        length=binascii.unhexlify('1700') # datalength
        controlcode= binascii.unhexlify('1045') #controlCode
        serial=binascii.unhexlify('0000') # serial
        datafield = binascii.unhexlify('020000000000000000000000000000') #com.igen.localmode.dy.instruction.send.SendDataField
        pos_ini=str(hex(pini)[2:4].zfill(4))
        pos_fin=str(hex(pfin-pini+1)[2:4].zfill(4))
        businessfield= binascii.unhexlify('0103' + pos_ini + pos_fin) # sin CRC16MODBUS
        crc=binascii.unhexlify(str(hex(libscrc.modbus(businessfield))[4:6])+str(hex(libscrc.modbus(businessfield))[2:4])) # CRC16modbus
        checksum=binascii.unhexlify('00') #checksum F2
        endCode = binascii.unhexlify('15')

        inverter_sn2 = bytearray.fromhex(hex(self.inverter_sn)[8:10] + hex(self.inverter_sn)[6:8] + hex(self.inverter_sn)[4:6] + hex(self.inverter_sn)[2:4])
        frame = bytearray(start + length + controlcode + serial + inverter_sn2 + datafield + businessfield + crc + checksum + endCode)
        # Data frame end

        checksum = 0
        frame_bytes = bytearray(frame)
        for i in range(1, len(frame_bytes) - 2, 1):
          checksum += frame_bytes[i] & 255
        frame_bytes[len(frame_bytes) - 2] = int((checksum & 255))

        # SEND DATA
        if self.verbose=="2":
          print("*** Chunk no: ", chunks);
          print("Sent data: ", frame);
        clientSocket.sendall(frame_bytes);

        data = clientSocket.recv(1024);
        try:
          data
        except:
          print("No data - Exit")
          sys.exit(1) #Exit, no data

        if invstatus==1:
          # PARSE RESPONSE (start position 56, end position 60)
          if self.verbose=="1": print("Received data: ", data);
          i=pfin-pini
          a=0
          while a<=i:
            p1=56+(a*4)
            p2=60+(a*4)
            hexpos=str("0x") + str(hex(a+pini)[2:].zfill(4)).upper()
            response=self.twosComplement_hex(
              str(''.join(hex(ord(chr(x)))[2:].zfill(2) for x in bytearray(data)) 
              + '  ' 
              + re.sub('[^\x20-\x7f]', '', ''))[p1:p2], 
              hexpos)
            with open("./SOFARMap.xml", encoding="utf-8") as txtfile:
              parameters=json.loads(txtfile.read())
            for parameter in parameters:
              for item in parameter["items"]:
                if self.lang=="PL":
                  title=item["titlePL"]
                else:
                  title=item["titleEN"]
                ratio=item["ratio"]
                unit=item["unit"]
                label_name=item["label_name"]
                for register in item["registers"]:
                  if register==hexpos and chunks!=-1:
                    response=round(response*ratio,2)
                    for option in item["optionRanges"]:
                      if option["key"] == response:
                        if label_name=="Status":
                          if response==2:
                            invstatus=1
                          else:
                            invstatus=0
                        if self.lang == "PL":
                          response='"'+option["valuePL"]+'"'
                        else:
                          response='"'+option["valueEN"]+'"'
                    if hexpos!='0x0015' and hexpos!='0x0016' and hexpos!='0x0017' and hexpos!='0x0018':
                      if self.verbose=="1": print(hexpos+" - "+title+": "+str(response)+unit);
                      if unit!="":
                        output=output+"\""+ title + " (" + unit + ")" + "\":" + str(response)+","
                      else:
                        output=output+"\""+ title + "\":" + str(response)+","
                    if hexpos=='0x0015': totalpower+=response*ratio*65536;
                    if hexpos=='0x0016':
                      totalpower+=response*ratio
                      if self.verbose=="1": print(hexpos+" - "+title+": "+str(response*ratio)+unit);
                      output=output+"\""+ title + " (" + unit + ")" + "\":" + str(totalpower)+","
                    if hexpos=='0x0017': totaltime+=response*ratio*65536;
                    if hexpos=='0x0018':
                      totaltime+=response*ratio
                      if self.verbose=="1": print(hexpos+" - "+title+": "+str(response*ratio)+unit);
                      output=output+"\""+ title + " (" + unit + ")" + "\":" + str(totaltime)+","
            a+=1
          if chunks==0:
            pini=self.reg_start2
            pfin=self.reg_end2
          chunks+=1
    output=output[:-1]+"}"
    if invstatus>0:
      jsonoutput=json.loads(output)
      if self.verbose == "2":
        print("*** JSON output:")
        print(json.dumps(jsonoutput, indent=4, sort_keys=False, ensure_ascii=False))
      return jsonoutput