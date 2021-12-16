require('dotenv').config()
const net = require('net');

const client = new net.Socket();
client.connect(process.env.SOCKET_SERVER_PORT, '127.0.0.1', () => {
	console.log('Client1 is ready.');
});

client.on('data', (buf) => {
  const str = buf.toString();

  if (str == 'close') {
    client.destroy();
  } else {
    let count = 0;
    let amount = 0;

    const numStrings = str.split(' ');
    numStrings.forEach((numStr) => {
      const reg = new RegExp('^[0-9]+$');
      if (reg.test(numStr)) {
        const num = parseInt(numStr, 10)
        amount += num;
        count += 1;
      }
    })

    const mean = amount / count;
    console.log(`Mean is ${mean}`);
  }
});

client.on('close', () => {
	console.log('Client1 Connection Closed.');
});
