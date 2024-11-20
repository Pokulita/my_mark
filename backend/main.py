from flask import Flask, jsonify, request
import cx_Oracle

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def get_db_connection():
    dsn = cx_Oracle.makedsn('localhost', '1522', service_name='FREE')
    connection = cx_Oracle.connect(user='SYSTEM', password='pokulita', dsn=dsn)
    return connection


@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM COURSES")
        result = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)