from os import sys, path


#if __name__ == '__main__' and __package__ is None:
#    	from os import sys, path
#	sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from models import * 
from serializers import * 
from datetime  import timedelta, datetime


def my_scheduled_job():
	print ("Hello form job")
	try:
		serializer_class = CitaSucursalSerializer
		citaSucursals = CitaSucursal.objects.all()
		time_threshold = datetime.now() - timedelta(minutes=60)
		citaSucursals= citaSucursals.filter(estatus="CARRITO")
		citaSucursals= citaSucursals.filter(creacion__lt=time_threshold)
		citaSucursals.delete()
		serializer = serializer_class(citaSucursals, many=True)
		print(serializer.data)

	except:
		print ("Error al leer Api")
