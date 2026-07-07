from datetime import datetime, timezone

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from app.models import CandidateProfile, Conversation, EmployerProfile, Message


def get_or_create_conversation(db: Session, *, employer_id, candidate_id, job_id=None) -> Conversation:
    stmt = select(Conversation).where(
        Conversation.employer_id == employer_id, Conversation.candidate_id == candidate_id
    )
    stmt = stmt.where(Conversation.job_id == job_id) if job_id else stmt.where(Conversation.job_id.is_(None))
    existing = db.scalar(stmt)
    if existing:
        return existing

    conversation = Conversation(employer_id=employer_id, candidate_id=candidate_id, job_id=job_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def list_conversations(db: Session, user_id):
    unread_subquery = (
        select(func.count())
        .select_from(Message)
        .where(
            Message.conversation_id == Conversation.id,
            Message.sender_id != user_id,
            Message.read_at.is_(None),
        )
        .correlate(Conversation)
        .scalar_subquery()
    )

    rows = db.execute(
        select(Conversation, EmployerProfile, CandidateProfile, unread_subquery.label("unread"))
        .outerjoin(EmployerProfile, Conversation.employer_id == EmployerProfile.user_id)
        .outerjoin(CandidateProfile, Conversation.candidate_id == CandidateProfile.user_id)
        .where(or_(Conversation.employer_id == user_id, Conversation.candidate_id == user_id))
        .order_by(Conversation.last_message_at.desc())
    ).all()

    result = []
    for conv, employer_profile, candidate_profile, unread in rows:
        other_name = (
            (candidate_profile.full_name if candidate_profile else None) or "Namizəd"
            if conv.employer_id == user_id
            else (employer_profile.full_name if employer_profile else None) or "İşəgötürən"
        )
        result.append(
            {
                "id": conv.id,
                "last_message_at": conv.last_message_at,
                "unread": unread,
                "other_name": other_name,
            }
        )
    return result


def get_conversation_thread(db: Session, conversation_id, user_id):
    conv = db.get(Conversation, conversation_id)
    if not conv or (conv.employer_id != user_id and conv.candidate_id != user_id):
        return None

    thread = db.scalars(
        select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    ).all()

    db.execute(
        Message.__table__.update()
        .where(
            Message.conversation_id == conversation_id,
            Message.sender_id != user_id,
            Message.read_at.is_(None),
        )
        .values(read_at=datetime.now(timezone.utc))
    )
    db.commit()

    return {"conversation": conv, "messages": thread}


def send_message(db: Session, *, conversation_id, sender_id, body: str) -> dict:
    conv = db.get(Conversation, conversation_id)
    if not conv or (conv.employer_id != sender_id and conv.candidate_id != sender_id):
        return {"ok": False}

    db.add(Message(conversation_id=conversation_id, sender_id=sender_id, body=body))
    conv.last_message_at = datetime.now(timezone.utc)
    db.commit()
    return {"ok": True, "conversation": conv}
