import datetime

from flask import Flask, jsonify, request
import cx_Oracle
import bcrypt

from flask import Flask, jsonify, request
import cx_Oracle
import bcrypt
import jwt
from flask_cors import CORS  # Import the CORS package

app = Flask(__name__)

# Apply CORS globally, allowing requests from your frontend's origin (localhost:3000)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def get_db_connection():
    dsn = cx_Oracle.makedsn('localhost', '1522', service_name='FREE')
    connection = cx_Oracle.connect(user='SYSTEM', password='pokulita', dsn=dsn)
    return connection

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')



    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT COUNT(*) FROM users WHERE email = :email", {'email': email})
    result = cursor.fetchone()

    if result[0] > 0:
        return jsonify({"success": False, "message": "Email is already in use."}), 400

    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)",
        {'username': username, 'email': email, 'password': hashed_password.decode('utf-8')}
    )
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({"success": True, "message": "Registration successful!"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')



    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT password,username FROM users WHERE email = :email", {'email': email})
    result = cursor.fetchone()

    if result is None:
        return jsonify({"success": False, "message": "Email not found."}), 400

    # Check if the email and password combination is correct

    stored_password, username = result  # Unpack the result

    # Check if the password matches
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        return jsonify({"success": False, "message": "Password incorrect."}), 400

    # Generate JWT token (set an expiration time if necessary)
    payload = {
        'username': username,
        'email': email
    }
    secret_key = '12'
    # You need to have a secret key in your app's config
    token = jwt.encode(payload,secret_key , algorithm='HS256')
    print(f"Payload: {payload}")
    print(f"Secret Key: {secret_key}")
    print("Generated Token: ", token)
    return jsonify({"success": True, "token": token}), 200

if __name__ == '__main__':
    app.run(debug=True)