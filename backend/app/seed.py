import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.models import User, StudentProfile, CompanyProfile, Internship, Application
from app.matching.factory import get_matching_engine

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        print("Database already contains data. Skipping seed.")
        db.close()
        return

    print("Seeding demo accounts and realistic portal data...")

    # 1. Admin Account
    admin_user = User(
        email="admin@academia-portal.edu",
        hashed_password=hash_password("AdminPass123!"),
        full_name="Dr. Eleanor Vance (Dean of Partnerships)",
        role="admin",
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)

    # 2. Company Accounts & Profiles
    # Company 1: NovaTech AI
    c1_user = User(
        email="contact@novatech.ai",
        hashed_password=hash_password("CompanyPass123!"),
        full_name="NovaTech AI Labs",
        role="company",
        avatar_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(c1_user)
    db.commit()
    db.refresh(c1_user)

    c1_profile = CompanyProfile(
        user_id=c1_user.id,
        company_name="NovaTech AI Labs",
        industry="Artificial Intelligence & Robotics",
        website="https://novatech.ai",
        location="San Francisco, CA",
        description="Pioneering next-generation multimodal neural networks, autonomous agents, and scalable cognitive computing for enterprise workflows.",
        logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        is_verified=True
    )
    db.add(c1_profile)

    # Company 2: FinEdge Capital
    c2_user = User(
        email="recruiter@finedge.com",
        hashed_password=hash_password("CompanyPass123!"),
        full_name="FinEdge Analytics",
        role="company",
        avatar_url="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(c2_user)
    db.commit()
    db.refresh(c2_user)

    c2_profile = CompanyProfile(
        user_id=c2_user.id,
        company_name="FinEdge Analytics",
        industry="FinTech & Quantitative Analytics",
        website="https://finedge-capital.com",
        location="New York, NY",
        description="High-frequency algorithmic trading systems, risk analytics, and quantitative modeling platform serving global financial institutions.",
        logo_url="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80",
        is_verified=True
    )
    db.add(c2_profile)

    # Company 3: GreenPulse CleanTech
    c3_user = User(
        email="careers@greenpulse.org",
        hashed_password=hash_password("CompanyPass123!"),
        full_name="GreenPulse CleanTech",
        role="company",
        avatar_url="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(c3_user)
    db.commit()
    db.refresh(c3_user)

    c3_profile = CompanyProfile(
        user_id=c3_user.id,
        company_name="GreenPulse CleanTech",
        industry="Clean Energy & Smart Grid IoT",
        website="https://greenpulse.org",
        location="Austin, TX",
        description="Building intelligent IoT energy telemetry, solar grid load balancers, and predictive climate modeling infrastructure.",
        logo_url="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=150&auto=format&fit=crop&q=80",
        is_verified=True
    )
    db.add(c3_profile)

    # Company 4: CyberGuard Security (Pending verification)
    c4_user = User(
        email="security@cyberguard.io",
        hashed_password=hash_password("CompanyPass123!"),
        full_name="CyberGuard Intelligence",
        role="company",
        avatar_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(c4_user)
    db.commit()
    db.refresh(c4_user)

    c4_profile = CompanyProfile(
        user_id=c4_user.id,
        company_name="CyberGuard Intelligence",
        industry="Cybersecurity & Defense Systems",
        website="https://cyberguard.io",
        location="Boston, MA",
        description="Specializing in zero-trust network monitoring, vulnerability assessment, and threat hunting for critical infrastructure.",
        logo_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80",
        is_verified=False  # Pending approval by Admin
    )
    db.add(c4_profile)
    db.commit()
    db.refresh(c1_profile)
    db.refresh(c2_profile)
    db.refresh(c3_profile)
    db.refresh(c4_profile)

    # 3. Student Accounts & Profiles
    # Student 1: Alex Rivera (AI / ML)
    s1_user = User(
        email="alex.rivera@university.edu",
        hashed_password=hash_password("StudentPass123!"),
        full_name="Alex Rivera",
        role="student",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(s1_user)
    db.commit()
    db.refresh(s1_user)

    s1_profile = StudentProfile(
        user_id=s1_user.id,
        headline="AI & Machine Learning Researcher | CS Honors",
        major="Computer Science & Artificial Intelligence",
        university="State University of Technology",
        graduation_year=2026,
        gpa=3.92,
        bio="Honors student passionate about neural architectures, transformer fine-tuning, and scalable inference. Published a workshop paper on sparse attention in 2025.",
        skills=["Python", "PyTorch", "Deep Learning", "TensorFlow", "FastAPI", "Git", "Linear Algebra", "NLP", "Docker"],
        certifications=[
            {"title": "AWS Certified Machine Learning - Specialty", "issuer": "Amazon Web Services", "year": 2025, "credential_id": "AWS-ML-8921"},
            {"title": "Deep Learning Specialization", "issuer": "DeepLearning.AI", "year": 2024, "credential_id": "DL-9082"}
        ],
        interests=["Natural Language Processing", "Autonomous Systems", "Computer Vision", "Multimodal AI"],
        location_preference="Remote",
        github_url="https://github.com/alexrivera-ai",
        linkedin_url="https://linkedin.com/in/alexrivera-ai",
        portfolio_url="https://alexrivera.dev"
    )
    db.add(s1_profile)

    # Student 2: Sarah Chen (Full-Stack & Cloud)
    s2_user = User(
        email="sarah.chen@university.edu",
        hashed_password=hash_password("StudentPass123!"),
        full_name="Sarah Chen",
        role="student",
        avatar_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(s2_user)
    db.commit()
    db.refresh(s2_user)

    s2_profile = StudentProfile(
        user_id=s2_user.id,
        headline="Full-Stack Web & Cloud Developer | React, Next.js, Python",
        major="Software Engineering",
        university="Metropolitan Institute of Technology",
        graduation_year=2026,
        gpa=3.88,
        bio="Full-stack engineer crafting responsive interfaces and high-performance microservices. Lead developer for our university's student portal app.",
        skills=["React", "TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "Tailwind CSS", "Docker", "RESTful API"],
        certifications=[
            {"title": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "year": 2025, "credential_id": "AWS-CCP-4411"},
            {"title": "Meta Frontend Developer Professional", "issuer": "Meta", "year": 2024, "credential_id": "META-FE-5521"}
        ],
        interests=["Modern Web Frameworks", "Cloud Infrastructure", "UI/UX Systems", "Distributed Databases"],
        location_preference="San Francisco, CA or Remote",
        github_url="https://github.com/sarahchen-dev",
        linkedin_url="https://linkedin.com/in/sarahchen-dev"
    )
    db.add(s2_profile)

    # Student 3: Marcus Johnson (Data Science)
    s3_user = User(
        email="marcus.j@university.edu",
        hashed_password=hash_password("StudentPass123!"),
        full_name="Marcus Johnson",
        role="student",
        avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(s3_user)
    db.commit()
    db.refresh(s3_user)

    s3_profile = StudentProfile(
        user_id=s3_user.id,
        headline="Quantitative Data Scientist & Statistical Analyst",
        major="Data Science & Applied Statistics",
        university="National Science University",
        graduation_year=2025,
        gpa=3.76,
        bio="Data scientist skilled in statistical modeling, exploratory data analysis, and predictive machine learning. 2-time regional hackathon winner.",
        skills=["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "Statistics", "Data Visualization", "R", "Git"],
        certifications=[
            {"title": "Google Data Analytics Professional Certificate", "issuer": "Google", "year": 2024, "credential_id": "GOOG-DA-9912"}
        ],
        interests=["Quantitative Finance", "Predictive Analytics", "Econometrics", "Time Series Analysis"],
        location_preference="New York, NY or Remote",
        github_url="https://github.com/marcusj-data"
    )
    db.add(s3_profile)

    # Student 4: Priya Patel (Cybersecurity)
    s4_user = User(
        email="priya.patel@university.edu",
        hashed_password=hash_password("StudentPass123!"),
        full_name="Priya Patel",
        role="student",
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        is_active=True
    )
    db.add(s4_user)
    db.commit()
    db.refresh(s4_user)

    s4_profile = StudentProfile(
        user_id=s4_user.id,
        headline="Cybersecurity & Information Assurance Scholar",
        major="Cybersecurity & Network Systems",
        university="State Polytechnic Institute",
        graduation_year=2026,
        gpa=3.82,
        bio="Focused on defense-in-depth, reverse engineering, and threat intelligence. President of the University Ethical Hacking Club.",
        skills=["Linux", "Python", "Bash", "Network Security", "Wireshark", "Cryptography", "C++", "Docker"],
        certifications=[
            {"title": "CompTIA Security+", "issuer": "CompTIA", "year": 2025, "credential_id": "COMP-SEC-7761"},
            {"title": "Cisco Certified Support Technician - Cybersecurity", "issuer": "Cisco", "year": 2024, "credential_id": "CISCO-CCST-12"}
        ],
        interests=["Zero Trust Architecture", "Threat Intelligence", "Penetration Testing", "Cloud Security"],
        location_preference="Remote"
    )
    db.add(s4_profile)
    db.commit()
    db.refresh(s1_profile)
    db.refresh(s2_profile)
    db.refresh(s3_profile)
    db.refresh(s4_profile)

    # 4. Internships
    internships_data = [
        Internship(
            company_id=c1_profile.id,
            title="Machine Learning Research Intern",
            department="Applied AI Research",
            description="Collaborate with senior researchers to train transformer models, benchmark inference throughput, and evaluate prompt optimization strategies for multimodal systems.",
            location_type="remote",
            location="Remote (US & Global)",
            duration_weeks=12,
            stipend_monthly=5200.0,
            required_skills=["Python", "PyTorch", "Deep Learning", "Linear Algebra"],
            preferred_skills=["Docker", "NLP", "CUDA", "FastAPI"],
            academic_fields=["Computer Science", "Artificial Intelligence", "Data Science"],
            min_gpa=3.5,
            openings=2,
            deadline="2026-11-30",
            status="open"
        ),
        Internship(
            company_id=c1_profile.id,
            title="Full-Stack AI Application Engineer Intern",
            department="Frontend & Product Engineering",
            description="Build real-time interactive user interfaces for our generative AI developer console. Integrate with FastAPI streaming endpoints and design intuitive workflow graphs.",
            location_type="hybrid",
            location="San Francisco, CA",
            duration_weeks=12,
            stipend_monthly=4600.0,
            required_skills=["React", "FastAPI", "Python", "TypeScript"],
            preferred_skills=["Docker", "Tailwind CSS", "PostgreSQL", "Next.js"],
            academic_fields=["Software Engineering", "Computer Science"],
            min_gpa=3.2,
            openings=3,
            deadline="2026-12-15",
            status="open"
        ),
        Internship(
            company_id=c2_profile.id,
            title="Quantitative Data Science Intern",
            department="Quantitative Strategies",
            description="Analyze petabyte-scale market microstructure feeds, build predictive volatility features, and backtest statistical arbitrage signals using Python and high-performance SQL.",
            location_type="onsite",
            location="New York, NY (Wall St)",
            duration_weeks=10,
            stipend_monthly=5500.0,
            required_skills=["Python", "SQL", "Pandas", "Scikit-Learn"],
            preferred_skills=["Statistics", "Time Series Analysis", "AWS", "Docker"],
            academic_fields=["Data Science", "Applied Statistics", "Mathematics", "Computer Science"],
            min_gpa=3.5,
            openings=2,
            deadline="2026-11-15",
            status="open"
        ),
        Internship(
            company_id=c2_profile.id,
            title="Cloud Backend Systems Intern",
            department="Core Infrastructure",
            description="Design resilient microservices, optimize PostgreSQL query plans, and implement asynchronous event queues for real-time transaction processing.",
            location_type="hybrid",
            location="New York, NY",
            duration_weeks=12,
            stipend_monthly=4500.0,
            required_skills=["Python", "PostgreSQL", "Docker", "RESTful API"],
            preferred_skills=["FastAPI", "Redis", "Linux", "Git"],
            academic_fields=["Computer Science", "Software Engineering"],
            min_gpa=3.0,
            openings=2,
            deadline="2026-12-01",
            status="open"
        ),
        Internship(
            company_id=c3_profile.id,
            title="IoT & Embedded Smart Grid Intern",
            department="Hardware & Edge Telemetry",
            description="Develop embedded firmware and edge processing routines for solar array IoT hubs. Stream telemetry over MQTT and integrate with cloud dashboards.",
            location_type="hybrid",
            location="Austin, TX",
            duration_weeks=14,
            stipend_monthly=4000.0,
            required_skills=["C++", "Python", "Linux", "Bash"],
            preferred_skills=["Network Security", "Git", "Docker"],
            academic_fields=["Electrical Engineering", "Computer Engineering", "Computer Science"],
            min_gpa=3.0,
            openings=2,
            deadline="2026-12-20",
            status="open"
        ),
        Internship(
            company_id=c3_profile.id,
            title="Sustainability Data Analyst Intern",
            department="Environmental Intelligence",
            description="Aggregate renewable generation data from wind and solar farms. Create insightful Tableau dashboards and automated regression models for grid efficiency.",
            location_type="remote",
            location="Remote",
            duration_weeks=10,
            stipend_monthly=3600.0,
            required_skills=["Python", "SQL", "Tableau", "Data Visualization"],
            preferred_skills=["Pandas", "Statistics", "R"],
            academic_fields=["Data Science", "Environmental Engineering", "Applied Statistics"],
            min_gpa=3.0,
            openings=1,
            deadline="2026-11-25",
            status="open"
        ),
        Internship(
            company_id=c4_profile.id,
            title="Cloud Security & Threat Intelligence Intern",
            department="Cyber Threat Operations",
            description="Monitor enterprise infrastructure logs, configure automated SIEM alerts, identify anomalous traffic patterns, and conduct penetration testing labs.",
            location_type="remote",
            location="Remote",
            duration_weeks=12,
            stipend_monthly=4800.0,
            required_skills=["Linux", "Python", "Bash", "Network Security"],
            preferred_skills=["Cryptography", "Wireshark", "Docker", "AWS"],
            academic_fields=["Cybersecurity", "Computer Science"],
            min_gpa=3.4,
            openings=2,
            deadline="2026-12-10",
            status="open"
        ),
    ]

    for intern in internships_data:
        db.add(intern)
    db.commit()

    # Re-fetch internships
    intern_list = db.query(Internship).all()
    ml_intern = intern_list[0]
    fullstack_intern = intern_list[1]
    quant_intern = intern_list[2]
    backend_intern = intern_list[3]
    iot_intern = intern_list[4]
    cyber_intern = intern_list[6]

    # 5. Pre-seed Sample Applications with calculated match scores
    engine_obj = get_matching_engine()

    # Alex Rivera -> ML Research Intern (High Match ~95%)
    res_alex_ml = engine_obj.calculate_match(s1_profile, ml_intern)
    app1 = Application(
        internship_id=ml_intern.id,
        student_id=s1_profile.id,
        status="shortlisted",
        cover_letter="I have deep experience with PyTorch and transformer architectures, having published a workshop paper in sparse attention. My AWS Machine Learning specialty certification directly aligns with your requirements.",
        match_score_at_application=res_alex_ml.overall_score,
        match_breakdown=res_alex_ml.to_dict()
    )
    db.add(app1)

    # Sarah Chen -> Fullstack AI Engineer Intern (High Match ~94%)
    res_sarah_fs = engine_obj.calculate_match(s2_profile, fullstack_intern)
    app2 = Application(
        internship_id=fullstack_intern.id,
        student_id=s2_profile.id,
        status="interviewing",
        cover_letter="I have built end-to-end fullstack applications using React, Next.js, and FastAPI. Excited to contribute to NovaTech's generative AI user interface!",
        match_score_at_application=res_sarah_fs.overall_score,
        match_breakdown=res_sarah_fs.to_dict()
    )
    db.add(app2)

    # Marcus Johnson -> Quant Data Science Intern (High Match ~92%)
    res_marcus_quant = engine_obj.calculate_match(s3_profile, quant_intern)
    app3 = Application(
        internship_id=quant_intern.id,
        student_id=s3_profile.id,
        status="under_review",
        cover_letter="With my background in statistical modeling, Pandas, and SQL, I am eager to apply quantitative predictive methods to market time-series datasets.",
        match_score_at_application=res_marcus_quant.overall_score,
        match_breakdown=res_marcus_quant.to_dict()
    )
    db.add(app3)

    # Priya Patel -> Cyber Threat Intern (High Match ~93%)
    res_priya_sec = engine_obj.calculate_match(s4_profile, cyber_intern)
    app4 = Application(
        internship_id=cyber_intern.id,
        student_id=s4_profile.id,
        status="applied",
        cover_letter="I hold CompTIA Security+ and Cisco CCST certifications with strong hands-on experience in Linux hardening and network traffic analysis using Wireshark.",
        match_score_at_application=res_priya_sec.overall_score,
        match_breakdown=res_priya_sec.to_dict()
    )
    db.add(app4)

    # Alex Rivera -> Fullstack AI Engineer Intern (Partial Match ~75%)
    res_alex_fs = engine_obj.calculate_match(s1_profile, fullstack_intern)
    app5 = Application(
        internship_id=fullstack_intern.id,
        student_id=s1_profile.id,
        status="applied",
        cover_letter="Interested in expanding my AI research into full-stack product interfaces.",
        match_score_at_application=res_alex_fs.overall_score,
        match_breakdown=res_alex_fs.to_dict()
    )
    db.add(app5)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
