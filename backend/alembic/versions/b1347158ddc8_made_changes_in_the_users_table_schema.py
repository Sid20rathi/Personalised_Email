"""made changes in the users table schema

Revision ID: b1347158ddc8
Revises: 3b7e2fef421b
Create Date: 2025-12-25 12:27:57.007969

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


# revision identifiers, used by Alembic.
revision: str = 'b1347158ddc8'
down_revision: Union[str, Sequence[str], None] = '3b7e2fef421b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Step 1: Add column as nullable first (to avoid NOT NULL constraint violation)
    op.add_column('users', sa.Column('expires_at', sa.DateTime(), nullable=True))
    
    # Step 2: Set a default value for existing rows (1 hour from now)
    # Use SQLAlchemy's text() for safe SQL execution
    op.execute(
        text("UPDATE users SET expires_at = NOW() + INTERVAL '1 hour' WHERE expires_at IS NULL")
    )
    
    # Step 3: Now make the column NOT NULL
    op.alter_column('users', 'expires_at', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Simply drop the column when rolling back
    op.drop_column('users', 'expires_at')