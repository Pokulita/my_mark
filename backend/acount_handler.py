import datetime

from flask import Flask, jsonify, request
import cx_Oracle
import bcrypt

from flask import Flask, jsonify, request
import cx_Oracle
import bcrypt
import jwt
from flask_cors import CORS, cross_origin  # Import the CORS package

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

    cursor.execute("SELECT id FROM users WHERE email = :email", {'email': email})
    user_id = cursor.fetchone()[0]

    cursor.execute("SELECT id FROM courses")
    courses = cursor.fetchall()

    print(courses)
    print(user_id)
    for course in courses:
        course_id = course[0]
        cursor.execute(
            "INSERT INTO student_courses (user_id, course_id,passed) VALUES (:user_id, :course_id, 0)",
            {'user_id': user_id, 'course_id': course_id}
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

    cursor.execute("SELECT id,password,username FROM users WHERE email = :email", {'email': email})
    result = cursor.fetchone()

    if result is None:
        return jsonify({"success": False, "message": "Email not found."}), 400

    # Check if the email and password combination is correct

    user_id,stored_password, username = result  # Unpack the result

    # Check if the password matches
    if not bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        return jsonify({"success": False, "message": "Password incorrect."}), 400

    # Generate JWT token (set an expiration time if necessary)
    payload = {
        'id':user_id,
        'username': username,
        'email': email
    }
    secret_key = '12'
    # You need to have a secret key in your app's config
    token = jwt.encode(payload,secret_key , algorithm='HS256')
    print(f"Payload: {payload}")
    print(f"Secret Key: {secret_key}")
    print("Generated Token: ", token)


    cursor.close()
    connection.close()
    return jsonify({"success": True, "token": token}), 200




@app.route('/courses', methods=['GET'])
def get_user_courses():
    tuser_id = request.args.get('user_id')
    connection = get_db_connection()
    cursor = connection.cursor()

    print(tuser_id)
    cursor.execute("""    SELECT c.id, c.name, c.ects, sc.passed 
                            FROM student_courses sc
                            JOIN courses c ON c.id = sc.course_id
                            WHERE sc.user_id = :user_id""",
                   {
        'user_id': tuser_id
    })  # Adjust with your actual table and columns
    result = cursor.fetchall()

    # Convert the result to a list of dictionaries
    courses = [{"id": row[0], "name": row[1], "ects": row[2],"passed" :row[3]} for row in result]

    cursor.close()
    connection.close()

    return jsonify(courses)

@app.route('/mark_course_passed', methods=['POST'])
def mark_course_passed():
    data = request.get_json()
    user_id = data.get('user_id')
    course_id = data.get('course_id')

    if not user_id or not course_id:
        return jsonify({"success": False, "message": "User ID and Course ID are required"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()


    # Update the 'passed' status of the course
    cursor.execute("""
        UPDATE student_courses
        SET passed = 1
        WHERE user_id = :user_id AND course_id = :course_id
    """, {
        'user_id': user_id,
        'course_id': course_id
    })
    connection.commit()
    return jsonify({"success": True, "message": "Course marked as passed"}), 200

if __name__ == '__main__':
    app.run(debug=True)