from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
<<<<<<< HEAD
    return render_template("home.html")


if __name__ == "__main__":
    app.debug = True
    app.run(host = '0.0.0.0', port=8000)
=======
	return render_template("home.html")

if __name__ == "__main__":
	app.debug = True
	app.run(host = '0.0.0.0', port=8000)
>>>>>>> master
