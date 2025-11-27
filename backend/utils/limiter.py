import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize the Limiter here
# If using Redis: storage_uri="redis://localhost:6379"
limiter = Limiter(key_func=get_remote_address)