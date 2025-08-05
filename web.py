from flask import Flask, render_template
from flask_frozen import Freezer
import os
import json
from datetime import datetime
import hashlib
import markdown
import sys

app = Flask(__name__)
freezer = Freezer(app)

md = markdown.Markdown(
  extensions=[
    'markdown.extensions.extra',
    'markdown.extensions.attr_list',
    'markdown.extensions.sane_lists'
  ],
  output_format='html5'
)

def slug_hash(slug: str) -> str:
    return hashlib.sha1(slug.encode()).hexdigest()[:12]

def get_all_posts(lang_code):
    posts_dir = os.path.join("content", lang_code, "posts")
    files = sorted([f for f in os.listdir(posts_dir) if f.endswith(".html")], reverse=True)
    # remove a extensão .html
    return [fname[:-5] for fname in files]

def get_recent_posts(lang_code, limit=5):
    posts_dir = os.path.join("content", lang_code, "posts")
    files = sorted(os.listdir(posts_dir), reverse=True)
    posts = []

    for fname in files:
        if not fname.endswith(".html"):
            continue
        try:
            # nome: 2025-07-26-exemplo-de-post.html
            slug_parts = fname[:-5].split('-')
            slug = "-".join(slug_parts)
            date_str = fname[:10]
            date = datetime.strptime(date_str, "%Y-%m-%d").date()

            posts.append({
                "slug": slug,
                "date": date.strftime("%Y‑%m‑%d"),  # com travessão fino
                "url": f"/{lang_code}/blog/{slug}.html",
                "title": slug[10:].replace("-", " ")  # opcional
            })
        except Exception as ex:
            print(ex)
            continue

    return posts[:limit] if limit != -1 else posts

def get_string_dict(lang_code):
    strings_path = os.path.join("content", lang_code, "strings.json")
    with open(strings_path, "r", encoding="utf-8") as f:
        strings = json.load(f)

    return strings

@app.route("/")
def welcome():
    return render_template("welcome.html")

@app.route("/<lang_code>/")
def index(lang_code):
    home_path = os.path.join("content", lang_code, "home.html")

    with open(home_path, "r", encoding="utf-8") as f:
        main_content = f.read()

    return render_template(
        "main.html", 
        strings=get_string_dict(lang_code), 
        main_content=main_content, 
    )

@app.route("/<lang_code>/guestbook/")
def guestbook(lang_code):
    guestbook_path = os.path.join("content", "guestbook.html")
    with open(guestbook_path, "r", encoding="utf-8") as f:
        main_content = f.read()
    
    return render_template(
        "main.html", 
        main_content=main_content,
        strings=get_string_dict(lang_code)
    )

@app.route("/<lang_code>/blog/")
def blog(lang_code):
    index_content_path = os.path.join("content", lang_code, "blog_index.html")
    with open(index_content_path, "r", encoding="utf-8") as f:
        main_content = f.read()
    return render_template(
        "blog.html", 
        blog_index_content=main_content,
        recent_posts=get_recent_posts(lang_code),
        strings=get_string_dict(lang_code)
    )

@app.route("/<lang_code>/blog/archive/")
def blog_archive(lang_code):
    return render_template(
        "blog-archive.html", 
        recent_posts=get_recent_posts(lang_code, -1),
        strings=get_string_dict(lang_code)
    )

@app.route("/<lang_code>/blog/<slug>.html")
def blog_post(lang_code, slug):
    posts = get_all_posts(lang_code)
    idx = posts.index(slug)

    next_post = posts[idx-1] if idx > 0 else None
    prev_post = posts[idx+1] if idx < len(posts)-1 else None

    posts_dir = os.path.join("content", lang_code, "posts")
    filename = os.path.join(posts_dir, f"{slug}.html")
    title = " ".join(slug.split("-")[3:])

    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    return render_template("post.html",
        content=content,
        strings=get_string_dict(lang_code),
        lang_code=lang_code,
        title=title,
        slug=slug,
        unique_id=slug_hash(slug),
        next_post=f"/{lang_code}/blog/{next_post}.html" if next_post != None else None,
        prev_post=f"/{lang_code}/blog/{prev_post}.html" if prev_post != None else None
    )

@freezer.register_generator
def lang_based_routes():
    langs = ["en", "pt"]
    
    for lang in langs:
        yield "index", {"lang_code": lang}
        yield "guestbook", {"lang_code": lang}
        yield "blog", {"lang_code": lang}
        yield "blog_archive", {"lang_code": lang}

        for slug in get_all_posts(lang):
            yield "blog_post", {"lang_code": lang, "slug": slug}

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
        app.run(debug=True)