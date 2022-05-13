from datetime import datetime
from .models import Hike, HikeDay
from dateutil.relativedelta import relativedelta
import logging


def get_default_date(hike) -> datetime:
    '''
        Возвращает дату следующего дня похода
    '''
    days = HikeDay.objects.filter(hike=hike).order_by('date')

    if len(days) > 0:
        return days[len(days)-1].date + relativedelta(days=1)

    return datetime.now()
