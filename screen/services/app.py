from flask import Flask, jsonify, request, abort, send_from_directory
from flask_socketio import SocketIO, emit
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'wireless_assignment'# secuity secret key for handle client cookies 

# Initialize Flask-SocketIO
socketio = SocketIO(app)

DATABASE = 'RealEstateBookingApp.db'  # SQLite database file

# Function to connect to the SQLite database
def connect_db(db_file):
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    return conn

# Endpoint to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    phone_number = data.get('phoneNumber')
    email = data.get('email')
    password = data.get('password')

    # Connect to the database
    conn = connect_db(DATABASE)
    cursor = conn.cursor()

    try:
        cursor.execute('INSERT INTO User (phoneNumber, email, password, type) VALUES (?, ?, ?, ?)',
                       (phone_number, email, password, 'customer'))
        conn.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists!"}), 409
    finally:
        conn.close()

# Endpoint to log in a user
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    phone_number = data.get('phoneNumber')
    password = data.get('password')

    # Connect to the database
    conn = connect_db(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM User WHERE phoneNumber = ? AND password = ?', (phone_number, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "Login successful!", "user": dict(user)}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# WebSocket event handler for connecting
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('response', {'message': 'Connected to the server!'})

# WebSocket event handler for disconnecting
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# WebSocket event handler for custom events
@socketio.on('my_event')
def handle_my_event(data):
    print(f"Received event: {data}")
    emit('response', {'message': f"Server received your data: {data}"})

if __name__ == '__main__':
   socketio.run(app, host='0.0.0.0', port=5000, debug=True)
