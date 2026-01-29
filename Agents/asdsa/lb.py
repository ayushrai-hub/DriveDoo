from dataclasses import dataclass, field
from typing import Dict, List, Optional, Union, Any
from enum import Enum
import logging
import json
import csv
from decimal import Decimal, ROUND_HALF_UP
from functools import lru_cache
from pathlib import Path
import shutil
from datetime import datetime
import re

def setup_logging():
    logger = logging.getLogger('GradeSystem')
    logger.setLevel(logging.INFO)
    fh = logging.FileHandler('grades.log')
    fh.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    logger.addHandler(fh)
    logger.addHandler(ch)
    return logger

logger = setup_logging()

class GradeError(Exception): pass
class StudentError(Exception): pass
class DataPersistenceError(Exception): pass

class Grade(Enum):
    A = (90, 100, "Excellent")
    B = (80, 89.99, "Good")
    C = (70, 79.99, "Satisfactory")
    D = (60, 69.99, "Needs Improvement")
    F = (0, 59.99, "Failing")

    @classmethod
    def from_score(cls, score: float) -> 'Grade':
        if not isinstance(score, (int, float)) or score < 0 or score > 100:
            raise GradeError(f"Invalid score: {score}")
        for grade in cls:
            min_score, max_score, _ = grade.value
            if min_score <= score <= max_score:
                return grade
        raise GradeError(f"Score {score} out of valid range")

    @property
    def description(self) -> str:
        return self.value[2]

@dataclass
class Subject:
    name: str
    max_grades: int = 50
    grades: List[float] = field(default_factory=list)
    _average_cache: Optional[float] = field(default=None, repr=False)
    
    def _post_init_(self):
        self.name = self._normalize_subject_name(self.name)
    
    @staticmethod
    def _normalize_subject_name(name: str) -> str:
        return name.strip().lower().capitalize()
    
    def add_grade(self, grade: float) -> None:
        try:
            grade_decimal = Decimal(str(grade)).quantize(Decimal('0.01'), ROUND_HALF_UP)
            grade_float = float(grade_decimal)
            
            if not 0 <= grade_float <= 100:
                raise GradeError(f"Grade must be between 0-100, got {grade_float}")
            
            if len(self.grades) >= self.max_grades:
                raise GradeError(f"Maximum number of grades ({self.max_grades}) reached for {self.name}")
            
            self.grades.append(grade_float)
            self._average_cache = None
            
        except (ValueError, Decimal.InvalidOperation):
            raise GradeError(f"Invalid grade format: {grade}")

    @property
    def average(self) -> Optional[float]:
        if not self.grades:
            return None
        
        if self._average_cache is None:
            avg = Decimal(str(sum(self.grades))) / Decimal(str(len(self.grades)))
            self._average_cache = float(avg.quantize(Decimal('0.01'), ROUND_HALF_UP))
        
        return self._average_cache

    @property
    def letter_grade(self) -> Optional[str]:
        if self.average is None:
            return None
        return Grade.from_score(self.average).name

    def to_dict(self) -> Dict[str, Any]:
        return {
            'name': self.name,
            'grades': self.grades,
            'max_grades': self.max_grades
        }

@dataclass
class Student:
    id: int
    name: str
    subjects: Dict[str, Subject] = field(default_factory=dict)

    def _post_init_(self):
        self.validate_student_data()

    def validate_student_data(self) -> None:
        if not isinstance(self.id, int) or self.id < 1:
            raise StudentError(f"Invalid student ID: {self.id}")
        if not self.name or not isinstance(self.name, str):
            raise StudentError(f"Invalid student name: {self.name}")
        self.name = self.name.strip()

    def add_subject(self, subject_name: str) -> None:
        normalized_name = Subject._normalize_subject_name(subject_name)
        if normalized_name not in self.subjects:
            self.subjects[normalized_name] = Subject(normalized_name)

    def add_grade(self, subject_name: str, grade: float) -> None:
        normalized_name = Subject._normalize_subject_name(subject_name)
        if normalized_name not in self.subjects:
            self.add_subject(normalized_name)
        self.subjects[normalized_name].add_grade(grade)

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'subjects': {name: subject.to_dict() for name, subject in self.subjects.items()}
        }

class GradeManager:
    def _init_(self, data_dir: str = "grade_data"):
        self.students: Dict[int, Student] = {}
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.backup_dir = self.data_dir / "backups"
        self.backup_dir.mkdir(exist_ok=True)

    def add_student(self, student_id: int, name: str) -> None:
        if student_id in self.students:
            raise StudentError(f"Student ID {student_id} already exists")
        
        student = Student(student_id, name)
        self.students[student_id] = student
        logger.info(f"Added student: {name} (ID: {student_id})")
        self._save_data()

    def add_grade(self, student_id: int, subject: str, grade: float) -> None:
        if student_id not in self.students:
            raise StudentError(f"Student {student_id} not found")
        
        try:
            self.students[student_id].add_grade(subject, grade)
            logger.info(f"Added grade {grade} for student {student_id} in {subject}")
            self._save_data()
        except (StudentError, GradeError) as e:
            logger.error(str(e))
            raise

    def _save_data(self) -> None:
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            data = {str(sid): student.to_dict() for sid, student in self.students.items()}
            
            current_file = self.data_dir / "grades.json"
            with open(current_file, 'w') as f:
                json.dump(data, f, indent=2)
            
            backup_file = self.backup_dir / f"grades_backup_{timestamp}.json"
            shutil.copy2(current_file, backup_file)
            
            backups = sorted(self.backup_dir.glob("grades_backup_*.json"))
            if len(backups) > 5:
                for backup in backups[:-5]:
                    backup.unlink()
                    
        except Exception as e:
            logger.error(f"Failed to save data: {str(e)}")
            raise DataPersistenceError(f"Failed to save data: {str(e)}")

    def load_data(self) -> None:
        try:
            data_file = self.data_dir / "grades.json"
            if not data_file.exists():
                return
            
            with open(data_file, 'r') as f:
                data = json.load(f)
            
            self.students = {}
            for student_id, student_data in data.items():
                student = Student(
                    id=int(student_id),
                    name=student_data['name']
                )
                for subject_data in student_data['subjects'].values():
                    subject = Subject(
                        name=subject_data['name'],
                        max_grades=subject_data['max_grades']
                    )
                    for grade in subject_data['grades']:
                        subject.add_grade(grade)
                    student.subjects[subject.name] = subject
                self.students[int(student_id)] = student
                
        except Exception as e:
            logger.error(f"Failed to load data: {str(e)}")
            raise DataPersistenceError(f"Failed to load data: {str(e)}")

    def generate_report(self, student_id: int, format: str = 'text') -> Union[str, Dict]:
        student = self.students.get(student_id)
        if not student:
            raise StudentError(f"Student {student_id} not found")

        if format == 'json':
            return student.to_dict()
        
        elif format == 'csv':
            csv_data = []
            headers = ['Student ID', 'Student Name', 'Subject', 'Grades', 'Average', 'Letter Grade']
            
            for subject_name, subject in sorted(student.subjects.items()):
                csv_data.append([
                    student_id,
                    student.name,
                    subject_name,
                    ';'.join(map(str, subject.grades)),
                    f"{subject.average:.2f}" if subject.average is not None else 'N/A',
                    subject.letter_grade or 'N/A'
                ])
            
            return {'headers': headers, 'data': csv_data}
        
        else:
            report = [
                f"Report Card for {student.name} (ID: {student_id})",
                "=" * 50
            ]

            if not student.subjects:
                report.append("No subjects registered")
                return "\n".join(report)

            for subject_name, subject in sorted(student.subjects.items()):
                report.extend([
                    f"\nSubject: {subject_name}",
                    f"Grades: {', '.join(map(str, subject.grades)) if subject.grades else 'None'}",
                    f"Average: {subject.average:.2f if subject.average else 'N/A'}",
                    f"Letter Grade: {subject.letter_grade if subject.letter_grade else 'N/A'}",
                    f"Status: {Grade[subject.letter_grade].description if subject.letter_grade else 'N/A'}"
                ])

            return "\n".join(report)

if __name__ == "_main_":
    manager = GradeManager()
    
    manager.add_student(1001, "Alice Johnson")
    manager.add_student(1002, "Bob Smith")
    manager.add_student(1003, "Carol Williams")
    
    sample_data = [
        (1001, "Mathematics", 95.5),
        (1001, "Mathematics", 88.75),
        (1001, "Physics", 92.0),
        (1001, "Chemistry", 87.25),
        (1002, "Mathematics", 78.5),
        (1002, "Physics", 85.75),
        (1002, "Biology", 92.25),
        (1003, "Mathematics", 90.0),
        (1003, "Chemistry", 88.5),
        (1003, "Computer Science", 96.75)
    ]
    
    try:
        for student_id, subject, grade in sample_data:
            manager.add_grade(student_id, subject, grade)
        
        print("\n=== Text Reports ===")
        for student_id in [1001, 1002, 1003]:
            print(manager.generate_report(student_id))
            print("\n" + "=" * 50 + "\n")
        
        print("\n=== JSON Report Example ===")
        json_report = manager.generate_report(1001, 'json')
        print(json.dumps(json_report, indent=2))
        
        print("\n=== CSV Report Example ===")
        csv_report = manager.generate_report(1002, 'csv')
        print("Headers:", csv_report['headers'])
        for row in csv_report['data']:
            print("Data:", row)
            
    except (StudentError, GradeError, DataPersistenceError) as e:
        print(f"Error occurred: {e}")
        logger.error(str(e))