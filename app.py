from flask import Flask, render_template, request, send_from_directory, redirect, url_for, session, flash
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  

db_config = {
    'host': 'localhost',
    'user': 'root',  # Change to your MySQL username
    'password': 'some pswd',   # Change to your MySQL password
    'database': 'globify_db'
}

def create_database():
    """Create database and tables if they don't exist"""
    try:
        conn = mysql.connector.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password']
        )
        cursor = conn.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS globify_db")
        cursor.execute("USE globify_db")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                company VARCHAR(100),
                role VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database and tables created successfully!")
    except mysql.connector.Error as err:
        print(f"❌ Database error: {err}")

def get_db_connection():
    """Get database connection"""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        return None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/styles.css')
def serve_css():
    return send_from_directory('templates', 'styles.css')

# Globify beta routes
@app.route('/beta')
def beta_model():
    return send_from_directory('globify beta', 'index.html')

@app.route('/beta/<path:filename>')
def beta_static(filename):
    return send_from_directory('globify beta', filename)

# Chatbot static
@app.route('/chatbot/<path:filename>')
def chatbot_static(filename):
    return send_from_directory('chatbot', filename)

# Dashboard routes
@app.route('/dashboard')
def dashboard_page():
    # Simple auth check; redirect to login if not logged in
    if not session.get('user_id'):
        flash('Please login to continue', 'error')
        return redirect(url_for('login'))
    return send_from_directory('dashboard', 'index.html')

@app.route('/dashboard/<path:filename>')
def dashboard_static(filename):
    # Optionally enforce auth for assets; usually not needed
    return send_from_directory('dashboard', filename)

# Auth routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    # POST method - handle login
    email = request.form.get('email')
    password = request.form.get('password')
    
    conn = get_db_connection()
    if not conn:
        flash('Database connection error', 'error')
        return redirect(url_for('login'))
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard_page'))
        else:
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))
            
    except mysql.connector.Error as err:
        flash(f'Database error: {err}', 'error')
        return redirect(url_for('login'))
    finally:
        cursor.close()
        conn.close()

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    
    # POST method - handle signup
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    company = request.form.get('company')
    role = request.form.get('role')
    
    # Basic validation
    if not username or not email or not password:
        flash('All fields are required', 'error')
        return redirect(url_for('signup'))
    
    conn = get_db_connection()
    if not conn:
        flash('Database connection error', 'error')
        return redirect(url_for('signup'))
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Check if email already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            flash('Email already registered', 'error')
            return redirect(url_for('signup'))
        
        # Check if username already exists
        cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            flash('Username already taken', 'error')
            return redirect(url_for('signup'))
        
        # Hash password and insert user
        password_hash = generate_password_hash(password)
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, company, role)
            VALUES (%s, %s, %s, %s, %s)
        """, (username, email, password_hash, company, role))
        
        conn.commit()
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
        
    except mysql.connector.Error as err:
        flash(f'Database error: {err}', 'error')
        return redirect(url_for('signup'))
    finally:
        cursor.close()
        conn.close()

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'GET':
        return render_template('forgot_password.html')
    
    email = request.form.get('email')
    # In a real app, generate token and send email
    flash('If an account with that email exists, a reset link has been sent.', 'success')
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('home'))

@app.route('/contact', methods=['POST'])
def contact():
    name = request.form.get('name')
    email = request.form.get('email')
    company = request.form.get('company')
    role = request.form.get('role')
    message = request.form.get('message')

    print(f"📩 New contact form submission:")
    print(f"Name: {name}, Email: {email}, Company: {company}, Role: {role}, Message: {message}")

    return f"Thank you, {name}! We'll be in touch soon."

if __name__ == '__main__':
    # Create database and tables on startup
    create_database()
    app.run(debug=True)
