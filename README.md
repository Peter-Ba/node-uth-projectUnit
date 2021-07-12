# Parallelism in Node.js

## Part 1

Node.js lends itself well to in fulfilling the role of a backend runtime environment because of its non-blocking, event driven architecture. Despite operating on a single-threaded event loop, it utilizes non-blocking (i.e. asynchronous) I/O operations to support potentially tens of thousands of concurrent connections. Because of its single-threaded nature, Node.js doesn't incur the cost of thread context switching but this does mean it can be somewhat limited when used to accomplish tasks that can be broken down into subtasks and completed in parallel.

Fortunately, there are several ways to accomplish parallel task execution in Node.js. In this repo, we will cover four different approaches to achieve the same goal.

1. `Simple Streams`

2. [`Node.js Child Processes API`](https://nodejs.org/docs/latest-v14.x/api/child_process.html)

3. [`Node.js Cluster API`](https://nodejs.org/docs/latest-v14.x/api/cluster.html)

4. [`Node.js Worker Threads API`](https://nodejs.org/docs/latest-v14.x/api/worker_threads.html)

Before getting started, download this [large text file](https://drive.google.com/file/d/1nnzoInijnvSOJSBbSelF5yuNpMUfwZvO/view?usp=sharing) (approx. 550mb). This will be your sample input data for each challenge. Place the downloaded file into the `data` directory.

### Instructions

In this large text file that you have downloaded, it contains 1.8 million lines of lorem ipsum text! If you'd like to open it with your text editor of choice, be our guest but we highly advise you not to! Your challenge is to create 5 unique files that make the following substituions:

a_to_e.txt: `a` → `e`

e_to_i.txt: `e` → `i`

i_to_o.txt: `i` → `o`

o_to_u.txt: `o` → `u`

u_to_a.txt: `u` → `a`

First accomplish this with just the Node.js Streams API then accomplish it with the Child Process API, Cluster API, and Worker Threads API.

Note that the `large.txt` is too large to be read synchronously. 👀

### Testing your work

To check if your solution is correct, run the following command in your terminal:

`cat filename.txt | grep 'vowel_that_you_replaced'`

For example:

`cat a_to_e.txt | grep 'a'`

If your solution is correct, there should be no output in your terminal.

Additionally, we generally expect overall task completion to be faster if we are using parallelism. To check this, you can prepend the `time` command before running any of your scripts.

For example:

`time node cluster/main.js`

## Part 2: Clustering in Node.js with PM2

[`Process Manager`](https://www.npmjs.com/package/pm2)

Node.js runs in a single thread, which means that on a multi-core system not all cores will be utilized at once. In the case that your server needs to run CPU-intensive tasks, clustering can be used to take advantage of additional CPU cores to create multiple Node.js processes. Each spawned process has its own memory, V8 instance and event loop, and uses IPC (Inter-process communication) to communicate with the parent process.

The advantage of being able to run multiple processes is that if you have one long running/blocking operation occurring on one worker, other workers may be spawned to continue handling other requests that come through in the meantime (i.e. other requests will not be left waiting in the meantime while an intensive task is completing).

To understand how this works, let’s first take a look at the server file inside the processManager directory. You should see a very basic server setup. For demonstration purposes to mimic a long-running process, we have some code inside our request to ‘/api/:n/’ that runs a basic for loop based on the number we pass to our request url.

Run the server using node processManager/server.js and go to http://localhost:3000/ in your browser. Play around with making different requests to http://localhost:3000/api/:n with various numbers passed in for n and see how long it takes to get a response from the server. Make a request using 5000000 for n and then open another window in the browser to make an additional request to the server. What happens?

You should be able to see that it takes a few seconds to receive a response from the server when we start passing in numbers large enough to make our for loop take a while to finish executing before sending a response. Although it’s not totally realistic, it mimics what happens in a single-threaded process when we have a long-running task that blocks additional requests in the meantime-- the process has to complete before the server can handle another request.

This is what clustering helps to solve!

Although there are a few ways to execute multiple processes at once in a Nodej.s server. One of the ways you can run your server in a cluster is by using PM2.

### What is pm2?

PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks. Check out the PM2 documentation here: https://pm2.keymetrics.io/docs/usage/quick-start/

To install PM2, use the following command:

`npm install pm2`

### PM2 Cluster Mode:

The cluster mode in PM2 allows networked Node.js applications (http(s)/tcp/udp server) to be scaled across all CPUs available, without any code modifications. This greatly increases the performance and reliability of your applications, depending on the number of CPUs available. Under the hood, PM2 uses the [Node.js cluster module](https://nodejs.org/api/cluster.html) such that the scaled application’s child processes can automatically share server ports.

Once we have PM2 installed, we can now run our server file again in cluster mode using the following command:

`pm2 start processManager/server.js -i 0`

`-i <processes>` specifically tells PM2 to launch the server in cluster mode (as opposed to fork mode). Setting `<processes>` to 0 tells PM2 to spawn as many workers as there are CPU cores on your machine.

In the terminal you should see details of the spawned processes. As mentioned, behind the scenes PM2 is using the Node.js cluster module to manage these processes. To stop them, use the following command:

`pm2 stop processManager/server.js`

Once you stop pm2, the terminal output should show all spawned processes with a stopped status.

Although you can customize how PM2 runs your server using the start command, an easier method is to set the configuration using an Ecosystem File and run that file each time you start your application.

To create the file, run the command:

`pm2 ecosystem`

This will generate a file named ecosystem.config.js. Set the script command to the filepath/name of your server file and make sure to set `exec_mode` to “cluster” so that PM2 will run in cluster mode. Set `instances` to the number of processes you want PM2 to run (use 0 to spawn as many workers as there are CPU cores on your machine).

Your config should look similar to this:

```
module.exports = {
  apps: [
    {
      script: './processManager/server.js',
      watch: '.',
      exec_mode: 'cluster',
      instances: 0,
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
```

Now to start your application, use the command:

`pm2 start ecosystem.config.js`

The application should run in cluster mode as before. Try playing around with some commands to see how PM2 gives you insight into what’s happening inside your cluster:

Display logs in real time:

`pm2 logs`

Display a real time dashboard within the terminal:
`pm2 monit`

Now that we have an understanding of the basics of running a PM2 cluster, let’s see how it clusters/load balances by simulating a high number of client requests. We can use the loadtest package for this (https://www.npmjs.com/package/loadtest).

Loadtest allows users to simulate a large number of concurrent requests to your server so you can measure its performance.

First, we need to install loadtest globally:

`npm install -g loadtest`

Let’s try out loadtest without clustering first. Make sure all instances of PM2 are stopped, and then run your server using:

`node processManager/server.js`

Once the server is running, opening another terminal and run the following load test, which will send 1000 requests to the given url of which 100 are concurrent:

`loadtest http://localhost:3000/api/500000 -n 1000 -c 100`

Examine the output in your terminal. How many requests per second can the server handle? What is the mean latency of each request (i.e. how long does it take for the server to respond)?

Now let’s compare these results to what happens when we perform the same test while PM2 is clustering the server. Stop the server in your node terminal and re-start using PM2. In another terminal, run the loadtest command again and watch the output. With the server running in cluster mode, how many requests is it now able to handle? How has the latency of each request changed?

Play around with changing the parameters of the loadtest and watch the output in your PM2 logs.

Have fun!!!
