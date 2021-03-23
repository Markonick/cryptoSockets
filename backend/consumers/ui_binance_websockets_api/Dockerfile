# FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# EXPOSE 8000

# ADD . /backend
# WORKDIR /backend

# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt

# CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8004"]


FROM python:3.7

ADD . /backend
WORKDIR /backend

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

# COPY . /app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]