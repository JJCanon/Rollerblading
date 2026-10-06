import uuid
from datetime import date, time

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.schedule import Level, Weekday

class ScheduleBase(BaseModel):
    weekday:Weekday
    specific_date:date|None = None
    start_time:time
    end_time:time
    location:str = Field(min_length=1, max_length=255)
    activity:str = Field(min_length=1, max_length=255)
    level:Level
    recurring:bool = False
    
    @model_validator(mode="after")
    def check_times(self):
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time")
        return self
    

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseModel):
    weekday: Weekday | None = None
    specific_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    location: str | None = Field(default=None, min_length=1, max_length=255)
    activity: str | None = Field(default=None, min_length=1, max_length=255)
    level: Level | None = None
    recurring: bool | None = None
    
class ScheduleOut(ScheduleBase):
    model_config = ConfigDict(from_attributes=True)
    
    id:uuid.UUID