"""Add clerk_id column to users table

Revision ID: 1b720cbf2ec3
Revises: 746ec6cc6d96
Create Date: 2025-11-18 16:46:33.276538
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '1b720cbf2ec3'
down_revision: Union[str, Sequence[str], None] = '746ec6cc6d96'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: Add clerk_id column."""
    # Add column only if not already existing (safe for multiple runs)
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    columns = [col['name'] for col in inspector.get_columns('users')]

    if 'clerk_id' not in columns:
        op.add_column('users', sa.Column('clerk_id', sa.String(), nullable=True))
        op.create_index('ix_users_clerk_id', 'users', ['clerk_id'], unique=True)


def downgrade() -> None:
    """Downgrade schema: Remove clerk_id column."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    columns = [col['name'] for col in inspector.get_columns('users')]

    if 'clerk_id' in columns:
        op.drop_index('ix_users_clerk_id', table_name='users')
        op.drop_column('users', 'clerk_id')
