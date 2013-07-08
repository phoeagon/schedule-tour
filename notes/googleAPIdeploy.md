How to deploy Google GCM API?
=========================================
phoeagon, July 8

## Getting your project id

Go to `https://code.google.com/apis/console/#project:[project_id]`,
which is `https://code.google.com/apis/console/#project:972473348547`
in this example.

        Name 	        API Project
        Project Number 	972473348547
        Project ID 	    schedule-tour
        Google+ Page 	Request connection
        Owners 	        phoeagon@gmail.com - you

## Configure your server key

Click on '**API Access**' on the page refered to in the last section.
Create a new server, configure your IP.

You will get something like:

        Key for server apps (with IP locking)
        API key:        AIzaSyAm-r776IEFAI2u2tc6Wd4KfnBjtJKHdXQ
        IPs: 	        59.78.3.0/24
        Activated on: 	Jul 6, 2013 5:46 AM
        Activated by: 	phoeagon@gmail.com – you 

## Configure Android Client Project

Go to `src/com.sqisland.android.gcm_client`. Change to following Lines:

      // Change this to the project id from your API project created at
      // code.google.com, as shown in the url of your project.
      public static final String SENDER_ID = "972473348547";
      // Change this to match your server.
      public static final String SERVER_URL = "http://192.168.1.5:4000";

Set sender id to your **project id** (numeric value), and
server url to the ip of server you are deploying on.

## Configure node.js Server Side

Go to `models/gcm.js` and find the following line:

    myGCM.sender = new gcm.Sender('AIzaSyAm-r776IEFAI2u2tc6Wd4KfnBjtJKHdXQ');

Change the server key to the value you got in step two.

Note that this key should correspond to the out-going IP of the server deployed on.

## Up running and test

Open your browser and visit `http://_deployed_server/gcmstatus`. There you can
get a list of devices registered.

By default, any client registered without a valid username is registered to test.

One can manually de-register a device via web page.

## To Do:

+ Bind multiple device to one account

+ Corresponding device-ID username binding 

