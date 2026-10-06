import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.schedule import Schedule

def list_schedules(db: Session, *, weekday=None, level=None):
    q = select(Schedule)
    if weekday:
        q = q.where(Schedule.weekday == weekday)
    if level:
        q = q.where(Schedule.level == level)
    return db.scalars(q.order_by(Schedule.weekday, Schedule.start_time)).all()


def get_schedule(db: Session, schedule_id: uuid.UUID) -> Schedule | None:
    return db.get(Schedule, schedule_id)


def create_schedule(db: Session, data: dict) -> Schedule:
    schedule = Schedule(**data)
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


def update_schedule(db: Session, schedule: Schedule, data: dict) -> Schedule:
    for key, value in data.items():
        setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    return schedule


def delete_schedule(db: Session, schedule: Schedule) -> None:
    db.delete(schedule)
    db.commit()