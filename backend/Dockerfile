FROM python:3.8

EXPOSE 8000

ADD . /backend
WORKDIR /backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000","--reload-dir", "/app"]