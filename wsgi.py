from main import app, db

if __name__ == "__main__":
    app.secret_key = "ThisIsNotASecret:p"
    db.create_all()
    app.run()
