from datetime import date


def to_age(data):
    if not data:
        return -1
    today = date.today()
    return today.year - data.year - ((today.month, today.day) < (data.month, data.day))