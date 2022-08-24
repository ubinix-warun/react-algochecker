

# Dev command (local)

* (reach) require reach tool, compile rsh.

```
curl https://docs.reach.sh/reach -o reach ; chmod +x reach

```

```
python3 -m venv venv
. venv/bin/activate

pip3 install -r requirements.txt

python3 api.py

```

# Deploy Cloud run!

```
gcloud init

gcloud run deploy
gcloud run deploy algochecker-api 

```

