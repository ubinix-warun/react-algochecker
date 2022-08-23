#!/usr/bin/env python
# encoding: utf-8

import sys
# import urllib.request
import requests
import json, os
from jsonpath_ng import jsonpath, parse

from time import time, sleep
from base64 import b64decode

from algosdk.v2client.algod import AlgodClient

ALGOD_ADDRESS = "https://node.algoexplorerapi.io"
# ALGOD_ADDRESS = "http://localhost:4001"
ALGOD_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

def getAlgodClient() -> AlgodClient:
    return AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

client = getAlgodClient()

from pysondb import PysonDB
db = PysonDB('checker.json')

from pyteal import *
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# cors = CORS(app, resources={r"/compile": {"origins": "http://localhost:3000"}})
# cors = CORS(app, resources={r"/checker": {"origins": "http://localhost:3000"}})

cors = CORS(app, resources={r"/compile": {"origins": "https://algochecker.web.app"}})
cors = CORS(app, resources={r"/checker": {"origins": "https://algochecker.web.app"}})

cors = CORS(app, resources={r"/compile": {"origins": "https://algochecker.firebaseapp.com"}})
cors = CORS(app, resources={r"/checker": {"origins": "https://algochecker.firebaseapp.com"}})


# checkerList = [
#   {
#     'timestamp': '',
#     'name': 'Tinyman Validator',
#     'network': 'Testnet',
#     'appid': 62368684,
#     'onchain': '',
#     'githuburl': 'https://github.com/tinymanorg/tinyman-contracts-v1/tree/v1-1-updates',
#     'sha': 'fb0e25845d3ad3660ab39c32997c3f1cfd6113be',
#     'offchain': '',
#   }
# ]


@app.route('/checker')
def get_checker():
  return jsonify(db.get_all())

@app.route('/checker', methods=['POST'])
def add_checker():
  db.add(request.get_json())
  return '', 200

@app.route('/compile', methods=['POST'])
def compile():
  
  if request.get_json()["type"] == 'TEAL':

    resp1 = requests.get(request.get_json()["url"])
    json_data1 = json.loads(resp1.text)

    dd1 = b64decode(json_data1['content'])
    response1 = client.compile(str(dd1,'utf-8'))

    return jsonify({
        "src": request.get_json()["url"],
        "out": response1["result"]
      })

  if request.get_json()["type"] == 'PYTEAL':

    with open("tmp.py", "w") as f:
        resp1 = requests.get(request.get_json()["url"])
        json_data1 = json.loads(resp1.text)

        dd1 = b64decode(json_data1['content'])
        f.write(str(dd1,'utf-8'))

    os.system("python3 baserun.py")
    os.remove("tmp.py")

    with open("tmp_approval.teal", "rb") as f:

        mybytearray = bytearray()

        byte = f.read(1)
        mybytearray+=byte
        
        while byte:
            # Do stuff with byte.
            byte = f.read(1)
            mybytearray+=byte
        
        response2 = client.compile(str(mybytearray,'utf-8'))

        os.remove("tmp_approval.teal")
        os.remove("tmp_clear_state.teal")

        return jsonify({
            "src": request.get_json()["url"],
            "out": response2["result"]
          })


  if request.get_json()["type"] == 'REACH':

    with open("tmp.rsh", "w") as f:
        resp1 = requests.get(request.get_json()["url"])
        json_data1 = json.loads(resp1.text)

        dd1 = b64decode(json_data1['content'])
        f.write(str(dd1,'utf-8'))    

    # os.system("reach compile tmp.rsh")

    # dd1 = b64decode(json_data1['content'])
    # response1 = client.compile(str(dd1,'utf-8'))

    # return jsonify({
    #     "src": request.get_json()["url"],
    #     "out": response1["result"]
    #   })

  return 'Bad Request', 400


# app.run()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))