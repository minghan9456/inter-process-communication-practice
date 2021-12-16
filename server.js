require('dotenv').config()
const shm = require('shm-typed-array');
const fs = require('fs');
const net = require('net');
const readline = require("readline");
const fork = require('child_process').fork;
const client3 = fork(__dirname + '/client3.js');
const shmSize = parseInt(process.env.SHARED_MEMORT_BYTE_SIZE, 10);
const shmBuf = shm.create(shmSize);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("close", () => {
  shutdown();
});

const sockets = []; // array of socket

const socketServer = net.createServer((socket) => {
  sockets.push(socket);

  socket.on('end', () => {
    // remove the client for list
    let index = sockets.indexOf(socket);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
  });

  socket.on('error', (err) => {
    if (err.errno == 'ECONNRESET') {
      console.log('Client had closed.')
    } else {
      console.log(err)
    }
  })
});

const fifoWs = fs.createWriteStream(process.env.PIPE_FILE_NAME);

function socketBroadcast(msg) {
  sockets.forEach((client) => {
    client.write(msg);
  });
};

function setShm(str) {
  const buf = Buffer.from(str, 'utf8');
  for (let i = 0; i <= str.length; i++) {
    shmBuf[i] = buf[i]
  }

  client3.send({key: shmBuf.key, len: str.length});
};

function shutdown() {
  console.log('Server Closing.');

  socketBroadcast('close');
  fifoWs.write('close');

  socketServer.close();
  fifoWs.close();
  fs.unlinkSync(process.env.PIPE_FILE_NAME)
  shm.detachAll();

  process.exit(0);
}

process.on('SIGINT', () => {
  shutdown();
  rl.close();
  process.exit();
});

async function main() {
  // socket
  socketServer.listen(process.env.SOCKET_SERVER_PORT, '127.0.0.1');
  // shm
  client3.send('hello');

  console.log('Server is ready. ');
  console.log('You can type intergers and then click [ENTER]. Clients will show the mean, median, and mode of the input values. ');
  console.log('If type `close`, will stop all server & client proccess. ');

  for await (const line of rl) {
    if (line == 'close') {
      shutdown();
      rl.close();
    } else {
      numStr = line.trim();

      socketBroadcast(numStr);
      fifoWs.write(numStr);
      setShm(numStr)
    }
  }
}

main();
