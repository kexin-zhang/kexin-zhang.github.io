---
title: A Simple Markov Chain Monte Carlo Example Visualized with D3
author: Kexin Zhang
layout: d3post
math: include
scripts:
    - /static/js/jstat.min.js
    - /static/js/d3.v5.min.js
    - /static/js/mcmc.js
css: /static/css/mcmc.css
---

Markov Chain Monte Carlo (MCMC) is a method for simulating a target distribution. The idea is that this distribution might be hard to sample directly from, so we can use MCMC to simulate draws from the distribution! In this example, I'll touch on some basics of Markov chains and using the Metropolis Hastings algorithm with a random walk. This achieves a simulation of the standard normal distribution.

<div id="chart"></div>
<div id="hist"></div>

#### Markov Chains
A brief refresher on Markov chains -- skip this if you already have an understanding of Markov chains! If you're new to Markov chains, [this](http://setosa.io/ev/markov-chains/) is a cool visual introduction to them.

I first learned about Markov chains in my stochastics class, where we used them to model queues and other stochastic processes. Markov chains generally serve as models for systems that have some randomness involved, and they consist of two main components: **states** (a possible condition or value for your system) and **transitions** (the probability of moving from one state to another). For example, for a Markov chain representing the weather, the states might be "Sunny" and "Rainy". The transitions could then be:
* Transitioning from "Sunny" to "Sunny" has a probability of 90%.
* Transitioning from "Sunny" to "Rainy" has a probability of 10%.
* Transitioning from "Rainy" to "Sunny" has a probability of 50%.
* Transitioning from "Rainy to "Rainy" has a probability of 50%. 

We can also represent this through a **transition matrix**:

$$
P = \begin{bmatrix}
0.9 & 0.1 \\
0.5 & 0.5 
\end{bmatrix}
$$

Note how in this example, the probabilities of the next state only depends on the current state. Basically, tomorrow's weather only depends on today's state. Yesterday's weather or the weather of any of the days before do not matter. This is the **first order Markov property**. Formally, we can define this as:

$$
P(X_t | X_{t-1}, X_{t-2}, X_{t-3}, ... ) = P(X_t | X_{t - 1})
$$

where $$X_t$$ is the state at time $$t$$. Because of this, we can use the transition matrix to determine probabilities of the chain being in certain states at certain time periods. For example, if the today's state is "Sunny", then the probabiliy distribution for tomorrow's weather is:

$$
v = \begin{bmatrix}
1 & 0
\end{bmatrix} \\ 
vP = \begin{bmatrix}
0.9 & 1
\end{bmatrix}
$$

where $$v$$ is the initial distribution (sunny with a probability of 100% and rainy with a probabiliy of 0% since we already know that today is sunny). Then, for the day after tomorrow, the probability distribution would be:
$$
vP^2 = \begin{bmatrix}
0.86 & 0.14
\end{bmatrix}
$$, and in general, the distribution for state $$X_n$$ is $$vP^n$$.

We can also use the transition matrix to find the **stationary distribution**, $$\pi$$, of the Markov chain. This is found through the equation $$\pi = \pi P$$.

A couple of other important attributes of Markov chains include:
* **Irreducibility**: A Markov chain is considered irreducible if all states communicate, which means from each state, it is possible to reach any other state. 
* **Period**:  The period of the state is the GCD of the number of steps it takes to return to the state, for all possible paths starting from the state. An **aperiodic** Markov chain is one that has only aperiodic states (states with a period of 1). 

**Ergodic** (irreducible and aperiodic) Markov chains have a unique stationary distribution, and as $$n$$, the number of realizations, increases, the distribution of $$X_n$$ reaches the stationary distribution. This is important for MCMC.

#### MCMC and Metropolis Hastings
The strategy behind MCMC is to use a Markov chain which has a stationary distribution that matches the target distribution we want to simulate. For this demo, we're using the [Metropolis Hastings algorithm](https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm). This example also uses a random walk for the Markov chain, which is a special case for the Metropolis Hastings algorithm. 

Under the Metropolis Hastings algorithn, we use a **proposal distribution** to generate proposed new values for the Markov chain. In this case, our proposed new states are:

$$
x_t = x_{t - 1} + e_t
$$,

where $$e_t$$ are i.i.d. with a $$Uniform(-1, 1)$$ distribution. An important note here is that this distribution is symmetric. Our goal is for these proposed states to simulate our target distribution, the standard normal distribution. We'll denote the PDF of this target distribution as $$g(t)$$.

Then, the steps for the algorithm are:
1. Set some initial state $$X_0$$. Here, I'm setting this to be 0. 
2. For some number of iterations (in this case, 3000):
  * Generate a proposed new value for the next state. Here, that's $$ x_{cand} = x_{t - 1} + e_t $$, where $$e_t$$ is a value sampled from the $$Uniform(-1, 1)$$ distribution.
  * Calculate the Metropolis Hastings ratio, also known as the **acceptance probability**. For symmetric proposal distributions like this one, that's
  $$ R(x_{cand}, x_{t - 1}) = min(1, \frac{g(x_{cand})}{g(x_{t - 1})}) $$
  * Sample a value from the uniform distribution, $$u \sim Uniform(0, 1)$$
  * If $$u$$ is less than the acceptance probability, then we accept the proposed new state. 
  $$x_t = x_{cand}$$
  * Otherwise, we reject this new value.
  $$x_t = x_{t - 1}$$

Note that using a random walk with a symmetric proposal distribution is a special case of the Metropolis Hastings algorithm that makes calculating the acceptance probability a little easier. The full Metropolis Hastings algorithm has a different formula for the acceptance probability involving conditional probabilities. 

Intuitively, here, we're using a proposal distribution ($$Uniform(-1, 1)$$) to generate candidate states. After generating a candidate, we either accept it or reject it based on the acceptance probability and a sampled uniform value. Note that we use the PDF of the target to calculate the acceptance ratio, which means that a candidate state with a high target density compared to the previous state has a high acceptance probability. Ideally, the chain should sufficiently explore the state space of the target distribution, and the acceptance ratio should encourage values that are likely to occur.

#### About this demo
This demo does MCMC in your browser with the help of [JStat](https://github.com/jstat/jstat)! The graphs were created with [D3 v5](https://d3js.org/). You can also see a standalone demo [here](https://www.kexinzhang.com/mcmc/).

