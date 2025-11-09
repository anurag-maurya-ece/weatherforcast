from app import app as application

# Backwards-compatible entrypoint: `your_application.wsgi` will expose `application` for Gunicorn
if __name__ == '__main__':
    application.run()
