FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

EXPOSE 8000

ADD . /backend
WORKDIR /backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD [ "python", "main.py" ]