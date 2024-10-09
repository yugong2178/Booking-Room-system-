import sqlite3
db = sqlite3.connect('BookingRoom.sqlite')

# Drop existing tables if they exist
db.execute('DROP TABLE IF EXISTS bookings')

# Create bookings table with user_id as a foreign key
db.execute('''
    CREATE TABLE bookings(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        info TEXT NOT NULL,
        price REAL NOT NULL,
        pax INTEGER NOT NULL,
        image_path TEXT,
        startdate TEXT NOT NULL,
        enddate TEXT NOT NULL
    )
''')

cursor = db.cursor()

# Insert data into bookings table
cursor.execute('''
    INSERT INTO bookings(name, location, info, price, pax, image_path, startdate, enddate)
    VALUES('Foo Yoke Wai', '58 Jalan Changkat Jong 36000 Teluk Intan 08', 'a good place', 200, 5, 'room2.jpg', '2024-09-13 06:30:00', '2024-09-24 18:30:00')
''')

cursor.execute('''
    INSERT INTO bookings(name, location, info, price, pax, image_path, startdate, enddate)
    VALUES('Chan Lee', '12 Jalan Besar 56000 Kuala Lumpur', 'Cozy stay', 150, 4, 'room1.jpg', '2024-09-13 06:30:00', '2024-09-24 18:30:00')
''')

cursor.execute('''
    INSERT INTO bookings(name, location, info, price, pax, image_path, startdate, enddate)
    VALUES('Siti Nur', '21 Taman Maju 31000 Ipoh', 'Quiet and peaceful', 180, 3, 'room2.jpeg', '2024-09-13 06:30:00', '2024-09-24 18:30:00')
''')

cursor.execute('''
    INSERT INTO bookings(name, location, info, price, pax, image_path, startdate, enddate)
    VALUES('Tan Ah Kow', '89 Jalan Meru 41050 Klang', 'Modern amenities', 250, 2, 'room1.jpg', '2024-09-13 06:30:00', '2024-09-24 18:30:00')
''')

# Commit changes and close connection
db.commit()
db.close()
