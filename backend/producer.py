import asyncio
import json

from aiokafka import AIOKafkaProducer
from app.core.config import KAFKA_INSTANCE
from app.core.config import PROJECT_NAME
from app.core.models.model import ProducerMessage
from app.core.models.model import ProducerResponse
from fastapi import FastAPI
