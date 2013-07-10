TechNote
=====================
    phoeagon, July 3

## Baidu Map API
[link](http://developer.baidu.com/map/)

## Store User Data on Server
Cache in Local Storage

## Generate HTML -- Server-side Script

## Database Design

    MongoDB
        User
            email
            passwd
        Event
            user
            title
            position
            from
            until
            description
            alarms
            privacy
            weight
            finish

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

            
