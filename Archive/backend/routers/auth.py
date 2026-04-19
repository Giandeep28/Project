from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from backend.schemas.schemas import UserCreate, UserLogin, Token, UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

SECRET_KEY = "SKY-VOYAGE-SECRET-SECURE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    # Mock registration (in production, save to DB)
    hashed_password = pwd_context.hash(user.password)
    return {
        "id": 1,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "loyalty_tier": "Silver",
        "miles_balance": 0
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock login
    if form_data.username == "voyager@sky.com" and form_data.password == "premium":
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Incorrect email or password")

@router.get("/me", response_model=UserOut)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Mock current user
    return {
        "id": 1,
        "email": "voyager@sky.com",
        "first_name": "John",
        "last_name": "Doe",
        "loyalty_tier": "Gold",
        "miles_balance": 18450
    }
