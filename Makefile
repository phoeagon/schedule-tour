clean:
	sudo service nginx stop
	sudo service stour stop
	sudo rm -rf /var/cache/nginx/*
	sudo service nginx start
	sudo service stour start

minify:
	sudo service nginx stop
	sudo service stour stop
	sudo rm -rf /var/cache/nginx/*
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
	
install:
	sudo cp etc_init_stour.conf.example /etc/init/stour.conf
	sudo chmod 755 /etc/init.stour.conf
	sudo sed -e -i 's}\$THIS_IS_REPLACED_WITH_CURRENT_DIR\$}'`pwd`'}' /etc/init/stour.conf
	sudo service stour start
