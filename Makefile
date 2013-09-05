clean:
	sudo service nginx stop
	sudo service stour stop
	rm -rf /var/cache/nginx/*
	sudo service nginx start
	sudo service stour start

minify:
	sudo service nginx stop
	sudo service stour stop
	rm -rf /var/cache/nginx/*
	( cd code/prototype/site/ ; bash minify.sh )
	sudo service nginx start
	sudo service stour start

restart:
	sudo service nginx stop
	sudo service stour stop
	sudo service nginx start
	sudo service stour start

start:
	sudo service nginx start
	sudo service stour start

stop:
	sudo service nginx stop
	sudo service stour stop

all:
	echo "Usage:"
	echo "make restart/start/stop/clean/minify"
	
	
