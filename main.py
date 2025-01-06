from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class DataItem(BaseModel):
    id: int
    name: str
    value: int
app = FastAPI()

dummy_data = {
    "data": [
        {"id": 1, "name": "Sales", "value": 120},
        {"id": 2, "name": "Marketing", "value": 200},
        {"id": 3, "name": "Development", "value": 150},
        {"id": 4, "name": "Support", "value": 180},
    ]
}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, React!"}

@app.get("/data")
async def get_data():
    return dummy_data

@app.get("/data/filter")
async def filter_data(name: str):
    filtered_data = [item for item in dummy_data["data"] if item["name"].lower() == name.lower()]
    return {"filtered_data": filtered_data}


@app.post("/data/add")
async def add_data(item: DataItem):
    dummy_data["data"].append(item.dict())
    return {"message": "Data added successfully", "new_data": dummy_data}
