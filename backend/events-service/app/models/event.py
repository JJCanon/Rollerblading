import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base

class EventType(str, enum.Enum):
    ROLLING = "ROLLING"
    COMPETITION = "COMPETITION"
    SOCIAL = "SOCIAL"
    LEARNING = "LEARNING"
    
class EventState(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"
    
class Event(Base):
    __tablename__="events"
    
    id:Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    title:Mapped[str] = mapped_column(String(255), nullable=False)
    description:Mapped[str] = mapped_column(Text, nullable=False)
    type:Mapped[EventType] = mapped_column(Enum(EventType, name="event_type"), nullable=False)
    start_date:Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date:Mapped[datetime] = mapped_column(DateTime, nullable=False)
    location:Mapped[str] = mapped_column(String(255), nullable=False)
    image_url:Mapped[str|None] = mapped_column(String(500))
    max_participants:Mapped[int|None] = mapped_column(Integer)
    state:Mapped[EventState] = mapped_column(
        Enum(EventState, name="event_state"), nullable=False, default=EventState.DRAFT
    )
    created_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)