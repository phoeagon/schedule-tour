TechNote
=====================
    phoeagon, July 3
    MinGKai, July 23

## Information & News
    Chrome 29 Beta added WebRTC & WebAudio support (including Android version)
    [link](http://pcedu.pconline.com.cn/338/3386916.html)
    conversta.io makes WebRTC much more easier
    [link](https://hacks.mozilla.org/2013/03/making-webrtc-simple-with-conversat-io/)

## Baidu Map API
[link](http://developer.baidu.com/map/)

## Store User Data on Server
Cache in Local Storage

## Generate HTML -- Server-side Script

## Database Design

See /code/prototype/site/models/types/

## Native App

+Alarm Clock
+Push Notification

## Distributing Responsibility

    Function                |    Component  
    Alarm Clock             |    Client Native
    Notification            |    Client Native
    Push Mesg               |     Server
    Path/Plan Programming   |     Client Web
    Map Display             |     Client Web

## Straw Algorithm
    1. link the events by dating time
    2. check the time spent between adjoining events
        2.1 remove the event by weight if time conflicts occur
            2.1.1 throw a warning if same weight
    3. calculate the time wasted
    4. for each two adjoining events:
        4.1 try to exchange them
        4.2 do as Step 2.
            4.2.1 `continue;` if failed
        4.3 recaculate the time wasted
        4.4 save the better plan

            
