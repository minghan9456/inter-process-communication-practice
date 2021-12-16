const shm = require('shm-typed-array');

process.on('message', (data) => {
  if (data == 'hello') {
    console.log('Client3 is ready.');
  } else {
    shmBuf = shm.get(data.key);

    const buf = Buffer.alloc(data.len);
    for (let i = 0; i <= data.len; i++) {
      buf[i] = shmBuf[i]
    }
    const str = buf.toString();

    const counts = {};

    const numStrings = str.split(' ');
    numStrings.forEach((numStr) => {
      const reg = new RegExp('^[0-9]+$');
      if (reg.test(numStr)) {
        const num = parseInt(numStr, 10)
        counts[num] = (counts[num] || 0) + 1;
      }
    })

    let max = 0;
    let values = [];
    for (var key in counts) {
      if (counts.hasOwnProperty(key)) {
        if (counts[key] > max) {
          max = counts[key];
          values = [key];
        } else if (counts[key] === max) {
          max = counts[key];
          values.push(key);
        }
      }
    }

    console.log(`Mode is ${values.join(", ")}`);
  }
});
