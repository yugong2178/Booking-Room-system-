##
# Execute this script once to create the database & table
# as well as populating it with initial data
#

import sqlite3
db = sqlite3.connect('AvailableRoom2.sqlite')

db.execute('DROP TABLE IF EXISTS rooms')

db.execute('''CREATE TABLE rooms(
    id integer PRIMARY KEY,
    name text NOT NULL,
    location text NOT NULL,
    info text NOT NULL,
    price integer NOT NULL,
    pax text Not NULL,
    image_path text
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO rooms(name,location,info,price,pax,image_path)
    VALUES('Foo Yoke Wai', '58 Jalan Changkat Jong 36000 Teluk Intan 08', 'a good place', 200, '5', 'room2.jpg')
''')

cursor.execute('''
    INSERT INTO rooms(name,location,info,price,pax,image_path)
    VALUES('Chan Lee', '12 Jalan Besar 56000 Kuala Lumpur', 'Cozy stay', 150, '4', 'room1.jpg')
''')

cursor.execute('''
    INSERT INTO rooms(name,location,info,price,pax,image_path)
    VALUES('Siti Nur', '21 Taman Maju 31000 Ipoh', 'Quiet and peaceful', 180, '3', 'room2.jpeg')
''')

cursor.execute('''
    INSERT INTO rooms(name,location,info,price,pax,image_path)
    VALUES('Tan Ah Kow', '89 Jalan Meru 41050 Klang', 'Modern amenities', 250, '2', 'room1.jpg')
''')

db.commit()
db.close()