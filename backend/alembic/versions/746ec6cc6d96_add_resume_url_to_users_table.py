"""Add resume_url to Users table

Revision ID: 746ec6cc6d96
Revises: 
Create Date: 2025-11-18 11:55:26.124981

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '746ec6cc6d96'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Apply migration: Add resume_url column."""
    op.add_column('users', sa.Column('resume_url', sa.String(), nullable=True))


def downgrade() -> None:
    """Rollback migration: Remove resume_url column."""
    op.drop_column('users', 'resume_url')
