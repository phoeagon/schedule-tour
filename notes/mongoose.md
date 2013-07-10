Notes on `mongoose`, an ORM framework for MongoDB
=====================================================
phoeagon , 2013 July 10

## Introduction

`mongoose` is a ORM framwork for mongoDB on node.js.

## Brief Examples

        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost/test');

        var Cat = mongoose.model('Cat', { name: String });

        var kitty = new Cat({ name: 'Zildjian' });
        kitty.save(function (err) {
          if (err) // ...
          console.log('meow');
        });

## Available Types

The permitted SchemaTypes are

+String

+Number

+Date

+Buffer

+Boolean

+Mixed

+ObjectId

+Array

## Index :

     animalSchema.index({ name: 1, type: -1 });

> When your application starts up, Mongoose automatically calls ensureIndex for each defined index in your schema. While nice for development, it is recommended this behavior be disabled in production since index creation can cause a significant performance impact. Disable the behavior by setting the autoIndex option of your schema to false.

     animalSchema.set('autoIndex', false);
     // or
     new Schema({..}, { autoIndex: false });

## Options
###option: id

Mongoose assigns each of your schemas an id virtual getter by default which returns the documents _id field cast to a string, or in the case of ObjectIds, its hexString. If you don't want an id getter added to your schema, you may disable it passing this option at schema construction time.

        // default behavior
        var schema = new Schema({ name: String });
        var Page = mongoose.model('Page', schema);
        var p = new Page({ name: 'mongodb.org' });
        console.log(p.id); // '50341373e894ad16347efe01'

        // disabled id
        var schema = new Schema({ name: String }, { id: false });
        var Page = mongoose.model('Page', schema);
        var p = new Page({ name: 'mongodb.org' });
        console.log(p.id); // undefined

## Query, Save, Update, etc

        Tank.create({ size: 'small' }, function (err, small) {
          if (err) return handleError(err);
        })
        Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
        Tank.remove({ size: 'large' }, function (err) {
          if (err) return handleError(err);
          // removed!
        });

If you want to update a single document in the db and return it to your application, use `findOneAndUpdate` instead.

## Further reading

For a more complete guide, go to `http://mongoosejs.com/docs/guide.html`.
