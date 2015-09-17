#!/usr/bin/env node

var amqp = require('amqplib/callback_api')

amqp.connect('amqp://10.0.0.5', function (err, conn) {
  conn.createChannel(function (err, ch) {
    var q = 'task_queue'
    var numOfTask = process.argv[2] || 1

    ch.assertQueue(q, {durable: true})
    for (var i = 0; i < numOfTask; i++) {
      var ranExecTime = Math.floor((Math.random() * 10) + 1)
      var dots = new Array(ranExecTime + 1).join('.')
      var msg = 'new task for ' + ranExecTime + ' seconds ' + dots
      ch.sendToQueue(q, new Buffer(msg), {persistent: true})
      console.log(" [x] Sent '%s'", msg)
    }
  })
  setTimeout(function () {
    conn.close()
    process.exit(0)
  }, 500)
})
