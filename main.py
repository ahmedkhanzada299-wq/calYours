from fastapi import FastAPI, Request , Response
from fastapi.responses import HTMLResponse , FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import time , json

class NoCacheStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response: Response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
        return response

app = FastAPI()

# Templates and static directory config
templates = Jinja2Templates(directory="templates")
templates.env.auto_reload = True  # Enable auto reload
templates.env.cache = {}          # Disable caching
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request ,"ts": time.time()})


@app.get("/about_us", response_class=HTMLResponse)
async def about_us(request: Request):
    return templates.TemplateResponse("about_us.html", {"request": request,"ts": time.time()})

@app.get("/contact_us", response_class=HTMLResponse)
async def contact_us(request: Request):
    return templates.TemplateResponse("contact_us.html", {"request": request,"ts": time.time()})


@app.get("/privacy_policy", response_class=HTMLResponse)
async def privacy_policy(request: Request):
    return templates.TemplateResponse("privacy_policy.html", {"request": request,"ts": time.time()})

@app.get("/article", response_class=HTMLResponse)
async def all_articles(request: Request):
    with open("articles.json" , encoding="utf-8") as f:
        articles =json.load(f)
    return templates.TemplateResponse("article.html", {"request": request, "articles": articles, "ts": time.time()})

@app.get("/articles/{article_id}", response_class=HTMLResponse)
async def get_article(request: Request, article_id: str):
    with open("articles.json" , encoding="utf-8" ) as f:
        articles =json.load(f)
    article = next((a for a in articles if str(a["id"]) == article_id), None)
    if not article:
        return HTMLResponse(content="Article not found", status_code=404)
    return templates.TemplateResponse("article_details.html", {
        "request": request,
        "article": article
    })

@app.get("/calculator", response_class=HTMLResponse)
async def calculator(request: Request):
    return templates.TemplateResponse("calculator.html", {"request": request,"ts": time.time()})


@app.get("/compound_interest_calculator", response_class=HTMLResponse)
async def compound_interest_calculator(request: Request):
    return templates.TemplateResponse("compound_interest_calculator.html", {"request": request,"ts": time.time()})

@app.get("/mortgage_calculator", response_class=HTMLResponse)
async def mortgage_calculator(request: Request):
    return templates.TemplateResponse("mortgage_calculator.html", {"request": request,"ts": time.time()})

@app.get("/sip_calculator", response_class=HTMLResponse)
async def sip_calculator(request: Request):
    return templates.TemplateResponse("sip_calculator.html", {"request": request,"ts": time.time()})


@app.get("/term_condition", response_class=HTMLResponse)
async def term_condition(request: Request):
    return templates.TemplateResponse("term_condition.html", {"request": request,"ts": time.time()})


from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Serve robots.txt
@app.get("/robots.txt", response_class=FileResponse, include_in_schema=False)
async def robots():
    path = "static/robots.txt"
    if os.path.exists(path):
        return FileResponse(path, media_type="text/plain")
    return {"detail": "robots.txt not found"}

# Serve sitemap.xml
@app.get("/sitemap.xml", response_class=FileResponse, include_in_schema=False)
async def sitemap():
    path = "static/sitemap.xml"
    if os.path.exists(path):
        return FileResponse(path, media_type="application/xml")
    return {"detail": "sitemap.xml not found"}

# Serve ads.txt (adding this based on your earlier question)
@app.get("/ads.txt", response_class=FileResponse, include_in_schema=False)
async def ads():
    path = "ads.txt"
    if os.path.exists(path):
        return FileResponse(path, media_type="text/plain")
    return {"detail": "ads.txt not found"}
