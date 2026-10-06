import uuid
from dataclasses import dataclass

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

bearer = HTTPBearer(auto_error=False)

@dataclass
class CurrentUser:
    id:uuid.UUID
    role:str
    
def get_current_user(creds:HTTPAuthorizationCredentials|None=Depends(bearer),) -> CurrentUser|None:
    # Returns None for "invited" (Without token). 401 if the token is invalid.
    if creds is None:
        return None
    try:
        payload = jwt.decode(creds.credentials, settings.jwt_secret, algorithms=["HS256"])
        return CurrentUser(id=uuid.UUID(payload["sub"]), role=payload["role"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Access Token invalid or expired")

def require_role(*allowed:str):
    def checker(user:CurrentUser|None = Depends(get_current_user)) -> CurrentUser:
        if user is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Access Token required")
        if user.role not in allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "You don't have permission for this action")
        return user
    return checker