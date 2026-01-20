# Portfolio Admin Panel - FastAPI Implementation Plan

## 🎯 Project Overview

**Tech Stack:**
- **Backend:** FastAPI + Python 3.11+
- **Database:** PostgreSQL (SQLAlchemy ORM)
- **Auth:** JWT (JSON Web Tokens)
- **Storage:** Local filesystem + AWS S3 (optional)
- **Cache:** Redis (optional, for sessions)
- **Admin UI:** React (separate admin dashboard)
- **Deployment:** Railway/Render + Vercel

**Architecture:**
```
React Portfolio (hamzax.me) → FastAPI Backend (/api) → PostgreSQL
React Admin Panel (admin.hamzax.me) → FastAPI Backend (/api) → PostgreSQL
```

---

## 📁 Project Structure

```
portfolio-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Environment variables, settings
│   ├── database.py             # Database connection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── skill.py
│   │   ├── service.py
│   │   ├── contact.py
│   │   ├── visitor.py          # User tracking
│   │   └── resume.py
│   │
│   ├── schemas/                # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── skill.py
│   │   ├── contact.py
│   │   └── visitor.py
│   │
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── auth.py             # Login, logout, token refresh
│   │   ├── projects.py         # CRUD for projects
│   │   ├── skills.py           # CRUD for skills
│   │   ├── about.py            # Update about section
│   │   ├── contact.py          # Contact form inbox
│   │   ├── resume.py           # Resume upload/download
│   │   ├── analytics.py        # Dashboard stats
│   │   └── tracking.py         # Visitor tracking
│   │
│   ├── core/                   # Core utilities
│   │   ├── __init__.py
│   │   ├── security.py         # Password hashing, JWT
│   │   ├── dependencies.py     # Auth dependencies
│   │   └── storage.py          # File upload handling
│   │
│   └── utils/                  # Helper functions
│       ├── __init__.py
│       ├── ip_lookup.py        # IP to location
│       └── device_parser.py    # User-agent parsing
│
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/                      # Unit tests
│   ├── test_auth.py
│   ├── test_projects.py
│   └── test_analytics.py
│
├── uploads/                    # Local file storage
│   ├── resumes/
│   └── images/
│
├── .env                        # Environment variables
├── .env.example
├── requirements.txt
├── alembic.ini
├── Dockerfile
└── README.md
```

---

## 🗄️ Database Schema Design

### **1. Admin Access Table** (Simple PIN Authentication)
```sql
CREATE TABLE admin_access (
    id SERIAL PRIMARY KEY,
    pin_code VARCHAR(5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**SQLAlchemy Model:**
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

class AdminAccess(Base):
    __tablename__ = "admin_access"
    
    id = Column(Integer, primary_key=True, index=True)
    pin_code = Column(String(5), nullable=False)
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Note:** Store only ONE active PIN code. No passwords, no usernames - just a simple 5-digit code!

---

### **2. Projects Table**
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[],                    -- Array of technologies
    image_url VARCHAR(500),
    github_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,      -- Optional manual ordering (default: order by created_at DESC)
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**SQLAlchemy Model:**
```python
from sqlalchemy import Column, Integer, String, Text, ARRAY, Boolean, DateTime
from sqlalchemy.dialects.postgresql import ARRAY

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(String))  # PostgreSQL array
    image_url = Column(String(500))
    github_url = Column(String(500))
    display_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

### **3. Skills Table**
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,        -- 'Frontend', 'Backend', etc.
    icon_name VARCHAR(100),               -- React icon name
    icon_color VARCHAR(7),                -- Hex color
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **4. Services Table** (Carousel Items)
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title_part1 VARCHAR(50),              -- First colored word
    title_part2 VARCHAR(50),              -- Second word
    description TEXT NOT NULL,
    icon_name VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **5. Contact Messages Table**
```sql
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### **6. Visitors Table** (User Tracking) ⭐ **NEW**
```sql
CREATE TABLE visitors (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    device_type VARCHAR(50),              -- 'mobile', 'tablet', 'desktop'
    device_brand VARCHAR(100),            -- 'Apple', 'Samsung', 'Google', etc.
    device_model VARCHAR(100),            -- 'iPhone 13 Pro', 'Galaxy S21', 'MacBook Pro', etc.
    browser VARCHAR(100),                 -- 'Chrome', 'Firefox', etc.
    os VARCHAR(100),                      -- 'Windows', 'MacOS', 'Android', etc.
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    first_visit TIMESTAMP DEFAULT NOW(),
    last_visit TIMESTAMP DEFAULT NOW(),
    visit_count INTEGER DEFAULT 1,
    pages_visited TEXT[],                 -- Array of visited pages
    created_at TIMESTAMP DEFAULT NOW()
);
```

**SQLAlchemy Model:**
```python
from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, ARRAY

class Visitor(Base):
    __tablename__ = "visitors"
    
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(45), unique=True, index=True)
    device_type = Column(String(50))
    device_brand = Column(String(100))
    device_model = Column(String(100))
    browser = Column(String(100))
    os = Column(String(100))
    country = Column(String(100))
    city = Column(String(100))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    first_visit = Column(DateTime, default=datetime.utcnow)
    last_visit = Column(DateTime, default=datetime.utcnow)
    visit_count = Column(Integer, default=1)
    pages_visited = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

### **7. About Section Table**
```sql
CREATE TABLE about_section (
    id SERIAL PRIMARY KEY,
    bio_text TEXT NOT NULL,
    profile_image_url VARCHAR(500),
    github_url VARCHAR(200),
    linkedin_url VARCHAR(200),
    twitter_url VARCHAR(200),
    instagram_url VARCHAR(200),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **8. Resume Table**
```sql
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,                    -- Bytes
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,       -- Only one active at a time
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

### **9. Analytics Events Table** (Optional - for detailed tracking)
```sql
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,      -- 'page_view', 'button_click', 'form_submit'
    event_data JSONB,                     -- Flexible JSON data
    visitor_id INTEGER REFERENCES visitors(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Feature 1: Simple PIN Authentication

### **1.1 Setup (app/core/security.py)**

```python
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status

SECRET_KEY = "your-secret-key-here-generate-with-openssl"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24  # Token valid for 24 hours

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT token after PIN verification"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("admin") is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### **1.2 Auth Dependency (app/core/dependencies.py)**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token

security = HTTPBearer()

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Verify admin access via JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    return payload  # Returns {'admin': True, 'exp': ...}
```

### **1.3 PIN Verification Endpoint (app/api/auth.py)**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta, datetime

from app.database import get_db
from app.models.admin_access import AdminAccess
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_HOURS
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class PINVerify(BaseModel):
    pin: str

@router.post("/verify-pin")
def verify_pin(
    pin_data: PINVerify,
    db: Session = Depends(get_db)
):
    """Verify 5-digit PIN and return access token"""
    # Validate PIN format
    if not pin_data.pin.isdigit() or len(pin_data.pin) != 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PIN must be 5 digits"
        )
    
    # Check if PIN exists and is active
    admin = db.query(AdminAccess).filter(
        AdminAccess.pin_code == pin_data.pin,
        AdminAccess.is_active == True
    ).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid PIN code"
        )
    
    # Update last used timestamp
    admin.last_used = datetime.utcnow()
    db.commit()
    
    # Create access token (valid for 24 hours)
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"admin": True},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_HOURS * 3600  # seconds
    }

@router.get("/verify")
def verify_token_endpoint(admin = Depends(get_current_admin)):
    """Check if current token is valid"""
    return {"valid": True, "admin": admin}
```

---

## 📊 Feature 2: Dashboard Overview

### **2.1 Analytics API (app/api/analytics.py)**

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models import Visitor, ContactMessage, Project, Resume

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Total visitors (unique IPs)
    total_visitors = db.query(func.count(Visitor.id)).scalar()
    
    # Visitors today
    today = datetime.utcnow().date()
    visitors_today = db.query(func.count(Visitor.id)).filter(
        func.date(Visitor.last_visit) == today
    ).scalar()
    
    # Total visits (including repeat visits)
    total_visits = db.query(func.sum(Visitor.visit_count)).scalar() or 0
    
    # Unread messages
    unread_messages = db.query(func.count(ContactMessage.id)).filter(
        ContactMessage.is_read == False
    ).scalar()
    
    # Total projects
    total_projects = db.query(func.count(Project.id)).scalar()
    
    # Resume downloads
    resume_downloads = db.query(func.sum(Resume.download_count)).scalar() or 0
    
    # Recent visitors (last 10)
    recent_visitors = db.query(Visitor).order_by(
        Visitor.last_visit.desc()
    ).limit(10).all()
    
    # Geographic distribution (top 5 countries)
    geo_stats = db.query(
        Visitor.country,
        func.count(Visitor.id).label('count')
    ).group_by(Visitor.country).order_by(
        func.count(Visitor.id).desc()
    ).limit(5).all()
    
    return {
        "total_visitors": total_visitors,
        "visitors_today": visitors_today,
        "total_visits": total_visits,
        "unread_messages": unread_messages,
        "total_projects": total_projects,
        "resume_downloads": resume_downloads,
        "recent_visitors": [
            {
                "ip": v.ip_address,
                "country": v.country,
                "city": v.city,
                "device": v.device_type,
                "last_visit": v.last_visit
            } for v in recent_visitors
        ],
        "geo_distribution": [
            {"country": g[0], "count": g[1]} for g in geo_stats
        ]
    }

@router.get("/chart-data")
def get_chart_data(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get visitor data for charts (last N days)"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Daily visitor counts
    daily_stats = db.query(
        func.date(Visitor.last_visit).label('date'),
        func.count(Visitor.id).label('visitors')
    ).filter(
        Visitor.last_visit >= start_date
    ).group_by(
        func.date(Visitor.last_visit)
    ).order_by(
        func.date(Visitor.last_visit)
    ).all()
    
    return {
        "labels": [str(stat.date) for stat in daily_stats],
        "visitors": [stat.visitors for stat in daily_stats]
    }
```

---

## 📦 Feature 3: Projects Management

### **3.1 Projects API (app/api/projects.py)**

```python
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.storage import save_image

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("/", response_model=List[ProjectResponse])
def get_all_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Public endpoint - get all featured projects (newest first)"""
    projects = db.query(Project).filter(
        Project.is_featured == True
    ).order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - create new project"""
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - update project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - delete project"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

@router.post("/{project_id}/upload-image")
def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - upload project image"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Save image and get URL
    image_url = save_image(file, folder="projects")
    db_project.image_url = image_url
    db.commit()
    
    return {"image_url": image_url}

@router.post("/reorder")
def reorder_projects(
    project_ids: List[int],
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - reorder projects"""
    for index, project_id in enumerate(project_ids):
        db.query(Project).filter(Project.id == project_id).update(
            {"display_order": index}
        )
    db.commit()
    return {"message": "Projects reordered successfully"}
```

### **3.2 Pydantic Schemas (app/schemas/project.py)**

```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    github_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    is_featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int
    image_url: Optional[str]
    display_order: int
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

---

## 🎯 Feature 4: Skills Management

### **4.1 Skills API (app/api/skills.py)**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("/", response_model=List[SkillResponse])
def get_all_skills(db: Session = Depends(get_db)):
    """Public endpoint - grouped by category"""
    skills = db.query(Skill).order_by(Skill.category, Skill.display_order).all()
    return skills

@router.post("/", response_model=SkillResponse)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_skill = Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill: SkillUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    for key, value in skill.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}
```

---

## 👤 Feature 5: About Section Editor

### **5.1 About API (app/api/about.py)**

```python
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.about import AboutSection
from app.schemas.about import AboutUpdate, AboutResponse
from app.core.storage import save_image

router = APIRouter(prefix="/api/about", tags=["About"])

@router.get("/", response_model=AboutResponse)
def get_about_section(db: Session = Depends(get_db)):
    """Public endpoint"""
    about = db.query(AboutSection).first()
    if not about:
        # Return default if not exists
        return AboutResponse(
            bio_text="",
            profile_image_url="",
            github_url="",
            linkedin_url="",
            twitter_url="",
            instagram_url=""
        )
    return about

@router.put("/", response_model=AboutResponse)
def update_about_section(
    about: AboutUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - update about section"""
    db_about = db.query(AboutSection).first()
    
    if not db_about:
        # Create if doesn't exist
        db_about = AboutSection(**about.dict())
        db.add(db_about)
    else:
        for key, value in about.dict(exclude_unset=True).items():
            setattr(db_about, key, value)
    
    db.commit()
    db.refresh(db_about)
    return db_about

@router.post("/upload-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - upload profile photo"""
    image_url = save_image(file, folder="about")
    
    db_about = db.query(AboutSection).first()
    if db_about:
        db_about.profile_image_url = image_url
        db.commit()
    
    return {"image_url": image_url}
```

---

## 📬 Feature 6: Contact Form Inbox

### **6.1 Contact API (app/api/contact.py)**

```python
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse)
def submit_contact_form(
    message: ContactCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Public endpoint - submit contact form"""
    db_message = ContactMessage(
        **message.dict(),
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # TODO: Send EmailJS notification here
    
    return db_message

@router.get("/", response_model=List[ContactResponse])
def get_all_messages(
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - get all messages"""
    query = db.query(ContactMessage)
    
    if unread_only:
        query = query.filter(ContactMessage.is_read == False)
    
    messages = query.order_by(
        ContactMessage.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return messages

@router.put("/{message_id}/mark-read")
def mark_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - mark message as read"""
    db_message = db.query(ContactMessage).filter(
        ContactMessage.id == message_id
    ).first()
    
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db_message.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - delete message"""
    db_message = db.query(ContactMessage).filter(
        ContactMessage.id == message_id
    ).first()
    
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(db_message)
    db.commit()
    return {"message": "Message deleted"}
```

---

## 📄 Feature 7: Resume Management

### **7.1 Resume API (app/api/resume.py)**

```python
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.resume import Resume
from app.core.storage import save_file

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - upload new resume"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    # Save file
    file_path = save_file(file, folder="resumes")
    file_size = os.path.getsize(file_path)
    
    # Deactivate old resumes
    db.query(Resume).update({"is_active": False})
    
    # Create new resume entry
    db_resume = Resume(
        filename=file.filename,
        file_path=file_path,
        file_size=file_size,
        is_active=True
    )
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    
    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "size": file_size
    }

@router.get("/download")
def download_resume(db: Session = Depends(get_db)):
    """Public endpoint - download active resume"""
    active_resume = db.query(Resume).filter(Resume.is_active == True).first()
    
    if not active_resume:
        raise HTTPException(status_code=404, detail="No active resume found")
    
    if not os.path.exists(active_resume.file_path):
        raise HTTPException(status_code=404, detail="Resume file not found")
    
    # Increment download count
    active_resume.download_count += 1
    db.commit()
    
    return FileResponse(
        path=active_resume.file_path,
        filename=active_resume.filename,
        media_type='application/pdf'
    )

@router.get("/stats")
def get_resume_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - get resume download stats"""
    active_resume = db.query(Resume).filter(Resume.is_active == True).first()
    
    if not active_resume:
        return {"download_count": 0}
    
    return {
        "filename": active_resume.filename,
        "download_count": active_resume.download_count,
        "uploaded_at": active_resume.uploaded_at,
        "file_size": active_resume.file_size
    }
```

---

## 📊 Feature 8 & 10: Analytics + User Tracking ⭐

### **8.1 Visitor Tracking Middleware (app/utils/tracking.py)**

```python
from fastapi import Request
from sqlalchemy.orm import Session
from user_agents import parse
import httpx
from datetime import datetime

from app.models.visitor import Visitor

async def get_ip_location(ip: str) -> dict:
    """Get location from IP using ipapi.co (free tier)"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://ipapi.co/{ip}/json/")
            if response.status_code == 200:
                data = response.json()
                return {
                    "country": data.get("country_name"),
                    "city": data.get("city"),
                    "latitude": data.get("latitude"),
                    "longitude": data.get("longitude")
                }
    except:
        pass
    
    return {
        "country": "Unknown",
        "city": "Unknown",
        "latitude": None,
        "longitude": None
    }

def parse_user_agent(user_agent_string: str) -> dict:
    """Parse user agent to extract device, browser, OS"""
    ua = parse(user_agent_string)
    
    # Determine device type
    if ua.is_mobile:
        device_type = "mobile"
    elif ua.is_tablet:
        device_type = "tablet"
    else:
        device_type = "desktop"
    
    # Extract device brand and model
    device_brand = ua.device.brand or "Unknown"
    device_model = ua.device.model or "Unknown"
    
    # Clean up brand and model
    if device_brand == "Generic":
        device_brand = "Unknown"
    
    return {
        "device_type": device_type,
        "device_brand": device_brand,
        "device_model": device_model,
        "browser": f"{ua.browser.family} {ua.browser.version_string}",
        "os": f"{ua.os.family} {ua.os.version_string}"
    }

async def track_visitor(request: Request, db: Session, page: str = "/"):
    """Track or update visitor information"""
    ip_address = request.client.host
    user_agent = request.headers.get("user-agent", "")
    
    # Check if visitor exists
    visitor = db.query(Visitor).filter(Visitor.ip_address == ip_address).first()
    
    if visitor:
        # Update existing visitor
        visitor.last_visit = datetime.utcnow()
        visitor.visit_count += 1
        
        # Update pages visited
        if visitor.pages_visited is None:
            visitor.pages_visited = [page]
        elif page not in visitor.pages_visited:
            visitor.pages_visited.append(page)
    else:
        # New visitor - get location and device info
        location = await get_ip_location(ip_address)
        device_info = parse_user_agent(user_agent)
        
        visitor = Visitor(
            ip_address=ip_address,
            country=location["country"],
            city=location["city"],
            latitude=location["latitude"],
            longitude=location["longitude"],
            device_type=device_info["device_type"],
            device_brand=device_info["device_brand"],
            device_model=device_info["device_model"],
            browser=device_info["browser"],
            os=device_info["os"],
            pages_visited=[page]
        )
        db.add(visitor)
    
    db.commit()
    return visitor
```

### **8.2 Tracking Endpoint (app/api/tracking.py)**

```python
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.utils.tracking import track_visitor

router = APIRouter(prefix="/api/track", tags=["Tracking"])

@router.post("/pageview")
async def track_pageview(
    request: Request,
    page: str = "/",
    db: Session = Depends(get_db)
):
    """Public endpoint - track page view"""
    visitor = await track_visitor(request, db, page)
    
    return {
        "message": "Tracked successfully",
        "visitor_id": visitor.id,
        "visit_count": visitor.visit_count
    }

@router.get("/visitors")
def get_all_visitors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - get all tracked visitors"""
    visitors = db.query(Visitor).order_by(
        Visitor.last_visit.desc()
    ).offset(skip).limit(limit).all()
    
    return visitors

@router.get("/map-data")
def get_map_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin only - get visitor locations for map visualization"""
    visitors = db.query(Visitor).filter(
        Visitor.latitude.isnot(None),
        Visitor.longitude.isnot(None)
    ).all()
    
    return [
        {
            "lat": float(v.latitude),
            "lng": float(v.longitude),
            "city": v.city,
            "country": v.country,
            "visits": v.visit_count
        } for v in visitors
    ]
```

**Frontend Integration (React):**
```javascript
// Track page view on portfolio
useEffect(() => {
  fetch('https://api.hamzax.me/api/track/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: window.location.pathname })
  })
}, [])
```

---

## ⚙️ Feature 9: Settings

### **9.1 Settings API (app/api/settings.py)**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.schemas.settings import PasswordChange

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.post("/change-password")
def change_password(
    passwords: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change admin password"""
    # Verify current password
    if not verify_password(passwords.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    # Update password
    current_user.hashed_password = hash_password(passwords.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}
```

---

## 🚀 Complete Setup & Deployment Guide

### **Step 1: Create Project**

```bash
mkdir portfolio-backend
cd portfolio-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary alembic python-jose[cryptography] passlib[bcrypt] python-multipart httpx user-agents
pip freeze > requirements.txt
```

### **Step 2: Setup Database (app/database.py)**

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **Step 3: Environment Variables (.env)**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db

# Security
SECRET_KEY=your-secret-key-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=https://hamzax.me
ADMIN_URL=https://admin.hamzax.me

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# IP Geolocation (optional)
IPAPI_KEY=your-key-if-using-paid-tier
```

### **Step 4: Initialize Alembic (Migrations)**

```bash
alembic init alembic
```

Edit `alembic/env.py`:
```python
from app.database import Base
from app.models import *  # Import all models

target_metadata = Base.metadata
```

Create initial migration:
```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### **Step 5: Create Admin PIN (seed_admin.py)**

```python
from app.database import SessionLocal
from app.models.admin_access import AdminAccess

db = SessionLocal()

# Set your 5-digit PIN code here
YOUR_PIN = "12345"  # Change this to your desired PIN

# Deactivate any existing PINs
db.query(AdminAccess).update({"is_active": False})

# Create new active PIN
admin_pin = AdminAccess(
    pin_code=YOUR_PIN,
    is_active=True
)

db.add(admin_pin)
db.commit()
print(f"Admin PIN created: {YOUR_PIN}")
print("Keep this PIN secure!")
```

Run: `python seed_admin.py`

**Security Note:** Store your PIN in environment variable for production!

### **Step 6: Main App (app/main.py)**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import auth, projects, skills, about, contact, resume, analytics, tracking
from app.config import settings

app = FastAPI(
    title="Portfolio Admin API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, settings.ADMIN_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(skills.router)
app.include_router(about.router)
app.include_router(contact.router)
app.include_router(resume.router)
app.include_router(analytics.router)
app.include_router(tracking.router)

@app.get("/")
def root():
    return {"message": "Portfolio Admin API", "version": "1.0.0"}
```

### **Step 7: Run Locally**

```bash
uvicorn app.main:app --reload --port 8000
```

Visit: `http://localhost:8000/docs` for API documentation

---

## 🌐 Deployment

### **Option 1: Railway (Recommended)**

1. Create `railway.toml`:
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
```

2. Create account on Railway.app
3. Connect GitHub repo
4. Add PostgreSQL database (Railway plugin)
5. Set environment variables
6. Deploy!

**Custom Domain:** Add `api.hamzax.me` in Railway settings

### **Option 2: Render**

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: portfolio-api
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: portfolio-db
          property: connectionString

databases:
  - name: portfolio-db
    databaseName: portfolio
    user: portfolio_user
```

2. Connect GitHub, deploy
3. Add custom domain

---

## 📱 Admin Panel Frontend (React)

### **Quick Setup Example**

```bash
npx create-vite admin-panel --template react
cd admin-panel
npm install axios react-router-dom recharts
```

**Simple PIN Login Component:**
```javascript
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://api.hamzax.me';

function PINLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-pin`, {
        pin: pin
      });

      // Save token to localStorage
      localStorage.setItem('token', response.data.access_token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid PIN code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-login">
      <h1>Admin Access</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          inputMode="numeric"
          maxLength="5"
          placeholder="Enter 5-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
          disabled={loading}
        />
        <button type="submit" disabled={loading || pin.length !== 5}>
          {loading ? 'Verifying...' : 'Access Dashboard'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default PINLogin;
```

**Dashboard Component:**
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://api.hamzax.me';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/api/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error(err));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Portfolio Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p>{stats.total_visitors}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Visitors</h3>
          <p>{stats.visitors_today}</p>
        </div>
        <div className="stat-card">
          <h3>Unread Messages</h3>
          <p>{stats.unread_messages}</p>
        </div>
        <div className="stat-card">
          <h3>Resume Downloads</h3>
          <p>{stats.resume_downloads}</p>
        </div>
      </div>

      <div className="recent-visitors">
        <h2>Recent Visitors</h2>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>City</th>
              <th>Device</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_visitors.map((v, i) => (
              <tr key={i}>
                <td>{v.country}</td>
                <td>{v.city}</td>
                <td>{v.device}</td>
                <td>{new Date(v.last_visit).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
```

---

## 📋 Implementation Checklist

### **Phase 1: Backend Setup** (Week 1)
- [ ] Setup FastAPI project structure
- [ ] Configure PostgreSQL database
- [ ] Create all database models
- [ ] Setup Alembic migrations
- [ ] Implement PIN authentication (JWT)
- [ ] Create admin PIN seed script

### **Phase 2: Core APIs** (Week 2)
- [ ] Projects CRUD endpoints
- [ ] Skills CRUD endpoints
- [ ] About section API
- [ ] Contact form API
- [ ] Resume upload/download API

### **Phase 3: Analytics & Tracking** (Week 3)
- [ ] Visitor tracking middleware
- [ ] IP geolocation integration
- [ ] User agent parsing
- [ ] Dashboard analytics API
- [ ] Chart data endpoints

### **Phase 4: File Handling** (Week 4)
- [ ] Image upload functionality
- [ ] Resume PDF handling
- [ ] File validation
- [ ] Storage optimization

### **Phase 5: Admin Panel Frontend** (Week 5-6)
- [ ] Simple PIN entry page
- [ ] Dashboard with stats
- [ ] Projects management UI
- [ ] Skills management UI
- [ ] Contact inbox UI
- [ ] Resume upload UI
- [ ] Visitor tracking visualization

### **Phase 6: Testing & Deployment** (Week 7)
- [ ] Write unit tests
- [ ] API testing (Postman)
- [ ] Security audit
- [ ] Deploy to Railway/Render
- [ ] Configure custom domain
- [ ] SSL setup

### **Phase 7: Integration** (Week 8)
- [ ] Connect React portfolio to API
- [ ] Test all endpoints
- [ ] Performance optimization
- [ ] Documentation
- [ ] Go live!

---

## 🎉 Final Notes

**Total Development Time:** ~2 months (part-time)  
**Cost:** $0 (using free tiers)  
**Scalability:** Can handle 1000+ visitors/day easily

**Dependencies Required:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.1
user-agents==2.2.0
```

Ye plan future mein implement karne ke liye **complete blueprint** hai. Har feature detailed hai with code examples! 🚀
