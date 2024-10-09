from flask import Flask, jsonify, request, abort, send_from_directory
import sqlite3

app = Flask(__name__)

ROOM_DB = 'AvailableRoom2.sqlite'

def connect_db(db_file):
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    return conn

# Serve static images from the directory
@app.route('/img/<path:filename>')
def send_image(filename):
    return send_from_directory('C:/RealEstateBookingApp/img', filename)

# Function to get room details as dictionary
def get_room_as_dict(row):
    return {
        'id': row[0],
        'name': row[1],
        'location': row[2],
        'info': row[3],
        'price': row[4],
        'pax': row[5],
        'image_path': row[6],
    }

# Endpoint to get all rooms
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    conn = connect_db(ROOM_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM rooms ORDER BY name')
    rows = cursor.fetchall()
    conn.close()

    rooms_as_dict = [get_room_as_dict(row) for row in rows]
    return jsonify(rooms_as_dict), 200

# Endpoint to get a specific room
@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    conn = connect_db(ROOM_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM rooms WHERE id = ?', (room_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify(get_room_as_dict(row)), 200
    else:
        return jsonify({"error": "Room not found"}), 404

# Endpoint to add a new room
@app.route('/api/rooms', methods=['POST'])
def add_room():
    if not request.json:
        abort(400)

    new_room = (
        request.json['name'],
        request.json['location'],
        request.json['info'],
        request.json['price'],
        request.json['pax'],
        request.json['image_path'],
    )

    conn = connect_db(ROOM_DB)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO rooms(name, location, info, price, pax, image_path) VALUES (?, ?, ?, ?, ?, ?)', new_room)
    room_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'id': room_id, 'affected': 1}), 201

# Endpoint to update a room
@app.route('/api/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    if not request.json:
        abort(400)

    if int(request.json['id']) != room_id:
        abort(400)

    update_room_data = (
        request.json['name'],
        request.json['location'],
        request.json['info'],
        request.json['price'],
        request.json['pax'],
        request.json['image_path'],
        room_id
    )

    conn = connect_db(ROOM_DB)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE rooms SET name=?, location=?, info=?, price=?, pax=?, image_path=?
        WHERE id=?
    ''', update_room_data)
    conn.commit()
    conn.close()

    return jsonify({'id': room_id, 'affected': 1}), 201

# Endpoint to delete a room
@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    conn = connect_db(ROOM_DB)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM rooms WHERE id = ?', (room_id,))
    conn.commit()
    conn.close()

    return jsonify({'id': room_id, 'affected': 1}), 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
