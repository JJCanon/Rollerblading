import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import CurrentUser
from app.models.event import Event, EventState
from app.repositories import event_repository as repo
from app.schemas.event import EventCreate, EventUpdate


def _is_admin(user: CurrentUser | None) -> bool:
    return user is not None and user.role == "admin"


def list_events(db: Session, user: CurrentUser | None, **filters):
    return repo.list_events(db, hide_drafts=not _is_admin(user), **filters)


def get_event(db: Session, event_id: uuid.UUID, user: CurrentUser | None) -> Event:
    event = repo.get_event(db, event_id)
    if event is None or (event.state == EventState.DRAFT and not _is_admin(user)):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Event not found")
    return event


def create_event(db: Session, payload: EventCreate, user: CurrentUser) -> Event:
    return repo.create_event(db, payload.model_dump(), user.id)


def update_event(db: Session, event_id: uuid.UUID, payload: EventUpdate, user: CurrentUser) -> Event:
    event = get_event(db, event_id, user)
    data = payload.model_dump(exclude_unset=True)
    start = data.get("start_date", event.start_date)
    end = data.get("end_date", event.end_date)
    if end <= start:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "end_date must be after start_date")
    return repo.update_event(db, event, data)


def delete_event(db: Session, event_id: uuid.UUID, user: CurrentUser) -> None:
    repo.delete_event(db, get_event(db, event_id, user))