require('dotenv').config()
const fs = require('fs');
const { spawn, fork } = require('child_process');

let fifo = spawn('mkfifo', [process.env.PIPE_FILE_NAME]);

fifo.on('exit', function(status) {
  console.log('Client2 is ready.');

  const fd = fs.openSync(process.env.PIPE_FILE_NAME, 'r+');
  let fifoRs = fs.createReadStream(null, { fd });

  fifoRs.on('data', buf => {
    const str = buf.toString();

    if (str == 'close') {
      console.log('Client2 Connection Closed.');
      fifoRs.close();
    } else {
      const nums = [];
      let amount = 0;

      const numStrings = str.split(' ');
      numStrings.forEach((numStr) => {
        const reg = new RegExp('^[0-9]+$');
        if (reg.test(numStr)) {
          const num = parseInt(numStr, 10)
          nums.push(num);
        }
      })

      nums.sort((a,b) => {
        return a - b;
      });

      let median = 0;
      const half = Math.floor(nums.length / 2);

      if (nums.length % 2) {
        median = nums[half];
      } else {
        median = (nums[half - 1] + nums[half]) / 2.0;
      }

      console.log(`Median is ${median}`);
    }
  });
});
