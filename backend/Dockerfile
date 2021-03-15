FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

EXPOSE 8000

ADD . /backend
WORKDIR /backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt


# CMD [ "python3", "app/main.py" ]
CMD [ "python", "main.py" ]
# CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]