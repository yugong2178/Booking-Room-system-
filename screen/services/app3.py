from flask import Flask, jsonify, request, abort, send_from_directory
import sqlite3

app = Flask(__name__)

BOOK_DB = 'BookingRoom.sqlite'

# Serve static images from the directory
@app.route('/img/<path:filename>')
def send_image(filename):
    return send_from_directory('C:/RealEstateBookingApp/img', filename)

def connect_db(db_file):
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    return conn

def get_book_as_dict(row):
    return {
        'id': row[0],
        'name': row[1],
        'location': row[2],
        'info': row[3],
        'price': row[4],
        'pax': row[5],
        'image_path': row[6],
        'startdate': row[7],
        'enddate': row[8],
    }

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    conn = connect_db(BOOK_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings ORDER BY name')
    rows = cursor.fetchall()
    conn.close()

    bookings_as_dict = [get_book_as_dict(row) for row in rows]
    return jsonify(bookings_as_dict), 200

@app.route('/api/bookings/<int:book_id>', methods=['GET'])
def get_booking(book_id):
    conn = connect_db(BOOK_DB)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM bookings WHERE id = ?', (book_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify(get_book_as_dict(row)), 200
    else:
        return jsonify({"error": "Booking not found"}), 404

@app.route('/api/bookings', methods=['POST'])
def add_book():
    if not request.json:
        abort(400)

    new_book = (
        request.json['name'],
        request.json['location'],
        request.json['info'],
        request.json['price'],
        request.json['pax'],
        request.json['image_path'],
        request.json['startdate'],
        request.json['enddate'],
    )

    conn = connect_db(BOOK_DB)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO bookings(name, location, info, price, pax, image_path, startdate, enddate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', new_book)
    book_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'id': book_id, 'affected': 1}), 201

@app.route('/api/bookings/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    if not request.json:
        abort(400)

    if int(request.json['id']) != book_id:
        abort(400)

    update_book_data = (
        request.json['name'],
        request.json['location'],
        request.json['info'],
        request.json['price'],
        request.json['pax'],
        request.json['image_path'],
        request.json['startdate'],
        request.json['enddate'],
        book_id
    )

    conn = connect_db(BOOK_DB)
    cursor = conn.cursor()
    cursor.execute('''UPDATE bookings SET name=?, location=?, info=?, price=?, pax=?, image_path=?, startdate=?, enddate=? WHERE id=?''', update_book_data)
    conn.commit()
    conn.close()

    return jsonify({'id': book_id, 'affected': 1}), 201

@app.route('/api/bookings/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    conn = connect_db(BOOK_DB)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM bookings WHERE id = ?', (book_id,))
    conn.commit()
    conn.close()

    return jsonify({'id': book_id, 'affected': 1}), 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
