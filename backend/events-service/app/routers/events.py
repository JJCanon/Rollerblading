import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user, require_role
from app.models.event import EventState, EventType
from app.schemas.event import EventCreate, EventOut, EventUpdate
from app.services import event_service as service

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=list[EventOut])
def list_events(
    type: EventType | None = None,
    state: EventState | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    user: CurrentUser | None = Depends(get_current_user),
):
    return service.list_events(db, user, type=type, state=state, skip=skip, limit=limit)


@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: CurrentUser | None = Depends(get_current_user),
):
    return service.get_event(db, event_id, user)


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_role("admin")),
):
    return service.create_event(db, payload, user)


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    event_id: uuid.UUID,
    payload: EventUpdate,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_role("admin")),
):
    return service.update_event(db, event_id, payload, user)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_role("admin")),
):
    service.delete_event(db, event_id, user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)