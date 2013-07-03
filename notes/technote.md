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
