# Parallelism in Node.js

Node.js lends itself well to in fulfilling the role of a backend runtime environment because of its non-blocking, event driven architecture. Despite operating on a single-threaded event loop, it utilizes non-blocking (i.e. asynchronous) I/O operations to support potentially tens of thousands of concurrent connections. Because of its single-threaded nature, Node.js doesn't incur the cost of thread context switching but this does mean it can be somewhat limited when used to accomplish tasks that can be broken down into subtasks and completed in parallel.

Fortunately, there are several ways to accomplish parallel task execution in Node.js. In this repo, we will cover five different approaches to achieve the same goal.

`Simple Streams`

[`Node.js Child Processes API`](https://nodejs.org/docs/latest-v14.x/api/child_process.html)

[`Node.js Cluster API`](https://nodejs.org/docs/latest-v14.x/api/cluster.html)

[`Node.js Worker Threads API`](https://nodejs.org/docs/latest-v14.x/api/worker_threads.html)

[`Process Manager`](https://www.npmjs.com/package/pm2)

Before getting started, download this [large text file](https://drive.google.com/file/d/1nnzoInijnvSOJSBbSelF5yuNpMUfwZvO/view?usp=sharing) (approx. 550mb). This will be your sample input data for each challenge. Place the downloaded file into the `data` directory.

## Instructions

In this large text file that you have downloaded, it contains 1.8 million lines of lorem ipsum text! If you'd like to open it with your text editor of choice, be our guest but we highly advise you not to! Your challenge is to create 5 unique files that make the following substituions:

a_to_e.txt: `a` → `e`

e_to_i.txt: `e` → `i`

i_to_o.txt: `i` → `o`

o_to_u.txt: `o` → `u`

u_to_a.txt: `u` → `a`

Note that this file is too large to be read synchronously. 👀

## Testing your work

To check if your solution is correct, run the following command in your terminal:

`cat filename.txt | grep 'vowel_that_you_replaced'`

For example:

`cat a_to_e.txt | grep 'a'`

If your solution is correct, there should be no output in your terminal.

Additionally, we generally expect overall task completion to be faster if we are using parallelism. To check this, you can prepend the `time` command before running any of your scripts.

For example:

`time node cluster/main.js`
