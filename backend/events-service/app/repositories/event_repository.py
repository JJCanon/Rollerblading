import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.event import Event, EventState

def list_events(db:Session, *, type=None, state= None, hide_drafts=True, skip=0, limit=50):
    q = select(Event)
    if type:
        q = q.where(Event.type == type)
    if state:
        q = q.where(Event.state == state)
    if hide_drafts:
        q = q.where(Event.state != EventState.DRAFT)
    return db.scalars(q.order_by(Event.start_date).offset(skip).limit(limit)).all()

def get_event(db:Session, event_id:uuid.UUID) -> Event|None:
    return db.get(Event, event_id)

def create_event(db: Session, data: dict, created_by: uuid.UUID) -> Event:
    event = Event(**data, created_by=created_by)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def update_event(db: Session, event: Event, data: dict) -> Event:
    for key, value in data.items():
        setattr(event,key,value)
    db.commit()
    db.refresh(event)
    return event

def delete_event(db: Session, event: Event) -> None:
    db.delete(event)
    db.commit()