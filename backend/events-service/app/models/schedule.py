import enum
import uuid
from datetime import date, time

from sqlalchemy import Boolean, Date, Enum, String, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class Weekday(str, enum.Enum):
    MONDAY = "MONDAY"
    TUESDAY = "TUESDAY"
    WEDNESDAY = "WEDNESDAY"
    THURSDAY = "THURSDAY"
    FRIDAY = "FRIDAY"
    SATURDAY = "SATURDAY"
    SUNDAY = "SUNDAY"


class Level(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    
class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    weekday: Mapped[Weekday] = mapped_column(Enum(Weekday, name="weekday"), nullable=False)
    specific_date: Mapped[date | None] = mapped_column(Date)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    activity: Mapped[str] = mapped_column(String(255), nullable=False)
    level: Mapped[Level] = mapped_column(Enum(Level, name="schedule_level"), nullable=False)
    recurring: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)