from flask import Flask, render_template, abort

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    from elsa import cli
    cli(app, base_url="https://orangethewell.github.io")

