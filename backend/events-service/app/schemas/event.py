import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.event import EventState, EventType

class EventBase(BaseModel):
    title:str = Field(min_length=1, max_length=255)
    description:str = Field(min_length=1)
    type: EventType
    start_date:datetime
    end_date:datetime
    location:str = Field(min_length=1, max_length=255)
    image_url:str|None = Field(default=None, max_length=500)
    max_participants:int|None = Field(default=None, gt=0)
    
    @model_validator(mode="after")
    def chech_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError("end_date must be after start_date")
        return self
    
class EventCreate(EventBase):
    state:EventState = EventState.DRAFT
    
class EventUpdate(BaseModel):
    title:str|None = Field(default=None, min_length=1, max_length=255)
    description:str|None = Field(default=None, min_length=1)
    type:EventType|None = None
    start_date:datetime|None = None
    end_date:datetime|None = None
    location:str|None = Field(default=None, min_length=1, max_length=255)
    image_url:str|None = Field(default=None, max_length=500)
    max_participants:int|None = Field(default=None, gt=0)
    state:EventState|None = None
    
class EventOut(EventBase):
    model_config = ConfigDict(from_attributes=True)
    
    id:uuid.UUID
    state:EventState
    created_by: uuid.UUID