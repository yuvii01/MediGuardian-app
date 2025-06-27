from cryptography.fernet import Fernet

# In production, store this securely (e.g., in .env or a secret manager)
# Generate this key only ONCE and save it.
SECRET_KEY = b'REPLACE_WITH_YOUR_OWN_FERNET_KEY'  # base64-encoded key
fernet = Fernet(SECRET_KEY)

def encrypt_password(password: str) -> str:
    return fernet.encrypt(password.encode()).decode()

def decrypt_password(encrypted_password: str) -> str:
    return fernet.decrypt(encrypted_password.encode()).decode()
