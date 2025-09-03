from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Templates and static directory config
templates = Jinja2Templates(directory=r"F:/Jamal/FinaceApp/app/templates")
app.mount("/static", StaticFiles(directory=r"F:/Jamal/FinaceApp/app/static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/about_us", response_class=HTMLResponse)
async def about_us(request: Request):
    return templates.TemplateResponse("about_us.html", {"request": request})

@app.get("/contact_us", response_class=HTMLResponse)
async def contact_us(request: Request):
    return templates.TemplateResponse("contact_us.html", {"request": request})


@app.get("/privacy_policy", response_class=HTMLResponse)
async def privacy_policy(request: Request):
    return templates.TemplateResponse("privacy_policy.html", {"request": request})

@app.get("/blogs", response_class=HTMLResponse)
async def blogs(request: Request):
    return templates.TemplateResponse("blogs.html", {"request": request})

@app.get("/calculator", response_class=HTMLResponse)
async def blogs(request: Request):
    return templates.TemplateResponse("calculator.html", {"request": request})


