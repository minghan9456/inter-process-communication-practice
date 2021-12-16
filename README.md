# inter-process-communication-practice

* Server will write data to each clients via a socket, pipe, or the shared memory, respectively.
* Client1 will read intergers from the socket and calculate the Mean value of the integers.
* Client2 will read intergers from the pipe and calculate the Median value of the integers.
* client3 will read intergers from the shared memory, and calculate the Mode value of the integers.
* Only test on mac OS Big Sur 11.2.3

### Pre Work
```bash
# Install the dependencies to the local node_modules folder.
$ npm install
# Set up .env file then modify if you need.
$ cp ./.env.example ./env
```

### Launch
```bash
# Launch server process & 3 client processes
$ npm run start
```

### Launch on Docker
```bash
# Build image and attach container.
$ sh ./run.sh
```

### Example
> Types integers and separate them by using [Space]. After clicking [Enter].
```bash
[0] Client2 is ready.
[1] Server is ready.
[1] You can type intergers and then click [ENTER]. Clients will show the mean, median, and mode of the input values.
[1] If type `close`, will stop all server & client proccess.
[1] Client3 is ready.
[2] Client1 is ready.
1 5 5 10 15 2 3
[2] Mean is 5.857142857142857
[1] Mode is 5
[0] Median is 5
close
[1] Server Closing.
[0] Client2 Connection Closed.
[2] Client1 Connection Closed.
[0] node client2.js exited with code 0
[2] sleep 2; node client1.js exited with code 0
[1] sleep 1; node server.js exited with code 0
```

### TODO
* if has too many I/O, shared memory process has the problem about `too many open files` on mac OS. (But not happen on docker image node:16)
