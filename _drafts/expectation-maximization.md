---
title: Some Insight into Expectation Maximization
layout: d3post
author: Kexin Zhang
math: include
---

This semester, I took computational statistics (ISYE 6416) and machine learning (CS 4641). I've been studying for the finals, both of which cover expectation maximization (EM), and initially struggled with connecting the concepts learned in both classes. This post is more for me to conceptualize EM from both a more theoretical/algorithmic standpoint and as an applied strategy. 

#### Foundation
EM builds off of [Maximization Likelihood Estimation (MLE)](https://en.wikipedia.org/wiki/Maximum_likelihood_estimation){:target="blank"}, which is a method for approximating distribution parameters given some observations. The maximum likelihood estimator is the parameter that maximizes the likelihood of having such data observations.

Let's say we have some data $$x_1, x_2, ... x_n$$, and we hypothesize that the data has been drawn independentally from some distribution, $$f$$ with parameter $$\theta$$. Then, the likelihood of drawing those observations is:

$$
\begin{align*}
    L(\theta, x) = \prod\limits^{n}_{i=1} f(x_i \vert \theta)
\end{align*}
$$

Generally, you'll have some distribution in mind (e.g. exponential distribution), and $$f(x_i \vert \theta)$$ is the probability distribution function for that distribution. In practice, it is useful to use the natural logarithm of the likelihood function for a few reasons:
1. The maximizer/argmax of the log likelihood function is the same as that for the likelihood function.
2. Log has useful properties that can be applied to simplify the function. Notably, $$log(ab) = log(a) + log(b)$$, $$log(a/b) = log(a) - log(b)$$, and $$log(a^b) = a * log(b)$$ 

Thus, the log likelihood function usually looks something like this:

$$
\begin{gather*}
    l(\theta, x) = log(L(\theta, x)) = log(\prod\limits^{n}_{i=1} f(x_i \vert \theta)) \\
    l(\theta, x) = \sum\limits^{n}_{i=1} log(f(x_i \vert \theta))
\end{gather*}
$$

Generally, to find the maximum, we can take the derivative of $$l(\theta, x)$$ with respect to $$\theta$$, set this equal to 0, and solve for $$\theta$$.

#### Expectation Maximization Algorithm
EM is an iterative strategy for estimating maximum likelihood parameters when there are missing data or latent variables. The [Computational Statistics textbook by Givens and Hoeting](http://www.stat.colostate.edu/computationalstatistics/){:target="blank"} uses the following notation:
* $$X$$: observed variables
* $$Z$$: missing or latent variables
* $$Y$$: complete data, $$Y = (X, Z)$$

Then, the algorithm is outlined below:
1. **E step**: We compute $$Q(\theta \vert \theta^{(t)})$$, which is the expected log likelihood for the complete data, conditioned on the observed data. 

$$
\begin{align*}
    Q(\theta \vert \theta^{(t)}) &= E_{Y \vert X, \theta^{(t)}}[ log\; L(\theta \vert Y)] \\
    &=  E_{Y \vert X, \theta^{(t)}}[ log\; p_Y(Y \vert \theta)] \\
    &=  E_{Z \vert X, \theta^{(t)}}[ log\; p_Y(X, Z \vert \theta)]
\end{align*}
$$

Since we have observed X, Z is the only random portion of Y.

{:start="2"}
2. **M step**: Maximize $$Q(\theta \vert \theta^{(t)})$$ with respect to $$\theta$$. Set $$\theta^{(t+1)}$$ to this maximizer, and go back to the E step unless some stopping or convergence criteria has been met. 

##### Toy Example
The Givens and Hoeting textbook contains a toy example that illustrates the idea pretty well. In the example, there are two variables, $$Y_1$$ and $$Y_2$$, which are independantly and identically distributed -- $$Y_1,\; Y_2 \sim Exp(\theta)$$. $$y_1$$ is 5, but $$y_2$$ is missing. 

**E Step**

First, let's find the log likelihood function of the complete data. Note that the probability distribution function of the exponential distribution is $$f(x) = \theta e^{-\theta x}$$

$$
\begin{align*}
    L(\theta \vert y) &= \theta e^{-\theta y_1}\theta e^{-\theta y_2} \\
    l(\theta \vert y) &= log(L(\theta \vert y)) = log(\theta e^{-\theta y_1}\theta e^{-\theta y_2}) \\
    &= log(\theta e^{-\theta y_1}) + log(\theta e^{-\theta y_2}) \\
    &= log(\theta) - \theta y_1 + log(\theta) - \theta y_2 \\
    &= 2log(\theta) - \theta y_1 - \theta y_2
\end{align*}
$$

How do we use this log likelihood to find $$Q(\theta \vert \theta^{(t)})$$? Our current log likelihood is for the complete data, but we have observed $$y_1 = 5$$. We can find the conditional expectation of $$y_2$$ based on the observed value for $$y_1$$. Let's note here that $$y_1$$ and $$y_2$$ are independent of each other and the mean of the exponential distribution is always $$\frac{1}{\theta}$$. Thus, 

$$
\begin{gather*}
    E[Y_2 \vert y_1, \; \theta^{(t)}] = E[Y_2 \vert \theta^{(t)}] = \frac{1}{\theta^{(t)}}
\end{gather*}
$$

We can use the observed data and the conditional expectation to write the E step as:

$$
\begin{gather*}
    Q(\theta \vert \theta^{(t)}) = 2log(\theta) - 5\theta - \frac{\theta}{\theta^{(t)}}
\end{gather*}
$$

**M Step**

To find the argmax of the $$Q(\theta \vert \theta^{(t)})$$, we can derive with respect to $$\theta$$ and solve. 

$$
\begin{gather*}
    \frac{\partial Q(\theta \vert \theta^{(t)})}{\partial \theta} = \frac{2}{\theta} - 5 - \frac{1}{\theta^{(t)}} = 0 \\
    \theta = \frac{2\theta^{(t)}}{5\theta^{(t)} + 1}
\end{gather*}
$$

Thus, $$\theta^{(t+1)} = \frac{2\theta^{(t)}}{5\theta^{(t)} + 1}$$.

#### Clustering with EM
A common machine learning problem involves assigning data to clusters. EM is generally used in this context when we assume that our data comes from a Gaussian mixture model. Here, each Gaussian component represents a cluster, and each point gets assigned some probability of belonging to each cluster. This is also called soft clustering, as opposed to hard clustering, in which each point is explicitly assigned some cluster.

##### Gaussian Mixture Models
A mixture model consists of $$n$$ distributions, each with a weight. All weights sum to 1. In a Gaussian mixture model, each of the component distributions is a normal distribution. You may see mixture models written like this: 

$$
    0.7N(7, 0.5^2) + 0.3N(10, 0.5^2)
$$

This would imply that roughly 70 percent of observations are from the first distribution and 30 percent of observations are from the second one.

For clustering purposes, the parameters to estimate are the mean and standard deviations of each Gaussian component, and the hidden variables are which Gaussian component each point corresponds to. 

##### Toy Example 2
Honestly, I just really wanted to write some D3. 