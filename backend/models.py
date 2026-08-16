from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class Process(Base):
    __tablename__ = "processes"

    id = Column(Integer, primary_key=True, index=True)

    industry = Column(String(100), nullable=False)

    process_name = Column(String(200), nullable=False)

    description = Column(Text, nullable=False)

    objective = Column(Text, nullable=False)

    status = Column(
        String(50),
        default="Pending",
        nullable=False
    )


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    process_id = Column(
        Integer,
        ForeignKey("processes.id"),
        nullable=False
    )

    current_process = Column(Text, nullable=False)

    problems = Column(Text, nullable=False)

    opportunities = Column(Text, nullable=False)

    future_process = Column(Text, nullable=False)