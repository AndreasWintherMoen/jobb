import logging
from config.env import ENVIRONMENT

class Logger:
    def __init__(self):
        logging.basicConfig(level=logging.DEBUG, format='[%(asctime)s] %(levelname)s: %(message)s')
        if (ENVIRONMENT == 'prod_gc'):
            import google.cloud.logging
            gc_logging_client = google.cloud.logging.Client()
            gc_logging_client.setup_logging()

    def debug(self, message: object) -> None:
        logging.debug(message)

    def info(self, message: object) -> None:
        logging.info(message)

    def warning(self, message: object) -> None:
        logging.warning(message)
    
    def error(self, message: object) -> None:
        logging.error(message)
    
    def critical(self, message: object) -> None:
        logging.critical(message)

    
logger = Logger()

def debug(message: object) -> None:
    logger.debug(message)

def info(message: object) -> None:
    logger.info(message)

def warning(message: object) -> None:
    logger.warning(message)

def error(message: object) -> None:
    logger.error(message)

def critical(message: object) -> None:
    logger.critical(message)
