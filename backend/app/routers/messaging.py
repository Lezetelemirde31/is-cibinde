from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import DbDep, get_current_user, require_roles
from app.models import Conversation, User
from app.schemas import ConversationRow, ConversationThread, SendMessageIn, StartConversationIn
from app.services import messaging as messaging_service
from app.services.notifications import create_notification

router = APIRouter(prefix="/conversations", tags=["messaging"])


@router.post("")
def start_conversation(
    payload: StartConversationIn, user: User = Depends(require_roles("employer")), db: Session = DbDep
):
    conversation = messaging_service.get_or_create_conversation(
        db, employer_id=user.id, candidate_id=payload.candidate_id, job_id=payload.job_id
    )
    return {"id": conversation.id}


@router.get("", response_model=list[ConversationRow])
def list_conversations(user: User = Depends(get_current_user), db: Session = DbDep):
    return messaging_service.list_conversations(db, user.id)


@router.get("/{conversation_id}", response_model=ConversationThread)
def get_conversation(conversation_id: UUID, user: User = Depends(get_current_user), db: Session = DbDep):
    data = messaging_service.get_conversation_thread(db, conversation_id, user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Söhbət tapılmadı")
    return {"conversation_id": data["conversation"].id, "messages": data["messages"]}


@router.post("/{conversation_id}/messages")
def send_message(
    conversation_id: UUID,
    payload: SendMessageIn,
    user: User = Depends(get_current_user),
    db: Session = DbDep,
):
    result = messaging_service.send_message(db, conversation_id=conversation_id, sender_id=user.id, body=payload.body)
    if not result["ok"]:
        raise HTTPException(status_code=403, detail="Mesaj göndərilmədi")

    conv: Conversation = result["conversation"]
    recipient = conv.candidate_id if conv.employer_id == user.id else conv.employer_id
    create_notification(
        db,
        user_id=recipient,
        type="new_message",
        title="Yeni mesaj",
        body=payload.body[:80],
        href=f"/dashboard/messages/{conversation_id}",
    )
    return {"ok": True}
