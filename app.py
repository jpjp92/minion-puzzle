from flask import Flask, render_template, jsonify, request
from supabase import create_client, Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['GET'])
def get_scores():
    try:
        response = supabase.table('puzzle_scores')\
            .select('player_name,score,difficulty,time_taken,moves,created_at')\
            .order('time_taken', asc=True)\
            .order('moves', asc=True)\
            .limit(10)\
            .execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import Flask, render_template, jsonify, request
from supabase import create_client, Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['GET'])
def get_scores():
    try:
        response = supabase.table('puzzle_scores')\
            .select('player_name,score,difficulty,time_taken,moves,created_at')\
            .order('time_taken', asc=True)\
            .order('moves', asc=True)\
            .limit(10)\
            .execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/scores', methods=['POST'])
def save_score():
    try:
        data = request.json
        # 데이터 유효성 검사
        required = ['player_name', 'difficulty', 'time_taken', 'moves']
        if not all(k in data for k in required):
            return jsonify({'error': 'Invalid data'}), 400
        result = supabase.table('puzzle_scores').insert({
            'player_name': data['player_name'],
            'score': data.get('score', 0),
            'difficulty': data['difficulty'],
            'time_taken': data['time_taken'],
            'moves': data['moves'],
            'created_at': datetime.now().isoformat()
        }).execute()
        return jsonify(result.data)
    except Exception as e:
        print('Error:', e)  # 로그로 출력
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)
