import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.schedule import Schedule
from app.repositories import schedule_repository as repo
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate


def list_schedules(db: Session, **filters):
    return repo.list_schedules(db, **filters)


def get_schedule(db: Session, schedule_id: uuid.UUID) -> Schedule:
    schedule = repo.get_schedule(db, schedule_id)
    if schedule is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Schedule not found")
    return schedule


def create_schedule(db: Session, payload: ScheduleCreate) -> Schedule:
    return repo.create_schedule(db, payload.model_dump())


def update_schedule(db: Session, schedule_id: uuid.UUID, payload: ScheduleUpdate) -> Schedule:
    schedule = get_schedule(db, schedule_id)
    data = payload.model_dump(exclude_unset=True)
    start = data.get("start_time", schedule.start_time)
    end = data.get("end_time", schedule.end_time)
    if end <= start:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "end_time must be after start_time")
    return repo.update_schedule(db, schedule, data)


def delete_schedule(db: Session, schedule_id: uuid.UUID) -> None:
    repo.delete_schedule(db, get_schedule(db, schedule_id))