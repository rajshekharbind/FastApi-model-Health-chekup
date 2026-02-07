"""
WebSocket support for real-time insurance premium updates
Install: pip install python-socketio python-socketio[asyncio_client]
"""

from fastapi import FastAPI
from fastapi_socketio import SocketManager
import json

# Add to your app.py to enable real-time features:
# socketio = SocketManager(app=app)

# Example real-time update handler:
# @socketio.event
# def connect():
#     print("Client connected")
#
# @socketio.event
# def predict_realtime(data):
#     """Send real-time prediction updates"""
#     result = predict_output(data)
#     emit('prediction_update', result)
