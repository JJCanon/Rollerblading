import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.security import require_role
from app.models.schedule import Level, Weekday
from app.schemas.schedule import ScheduleCreate, ScheduleOut, ScheduleUpdate
from app.services import schedule_service as service

router = APIRouter(prefix="/api/schedules", tags=["schedules"])


@router.get("", response_model=list[ScheduleOut])
def list_schedules(
    weekday: Weekday | None = None,
    level: Level | None = None,
    db: Session = Depends(get_db),
):
    return service.list_schedules(db, weekday=weekday, level=level)


@router.get("/{schedule_id}", response_model=ScheduleOut)
def get_schedule(schedule_id: uuid.UUID, db: Session = Depends(get_db)):
    return service.get_schedule(db, schedule_id)


@router.post("", response_model=ScheduleOut, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_role("admin"))])
def create_schedule(payload: ScheduleCreate, db: Session = Depends(get_db)):
    return service.create_schedule(db, payload)


@router.put("/{schedule_id}", response_model=ScheduleOut,
            dependencies=[Depends(require_role("admin"))])
def update_schedule(schedule_id: uuid.UUID, payload: ScheduleUpdate, db: Session = Depends(get_db)):
    return service.update_schedule(db, schedule_id, payload)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_role("admin"))])
def delete_schedule(schedule_id: uuid.UUID, db: Session = Depends(get_db)):
    service.delete_schedule(db, schedule_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)