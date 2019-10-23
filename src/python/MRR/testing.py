import numpy
from math import e
from sympy import symbols
from sympy.matrices import zeros
from sympy.solvers import linsolve
import matplotlib.pyplot as pyplot

n = 20
space = 1/(n + 1)
intervals = numpy.arange(0, 1.0001, space)

def fi(i, x):
    if x <= intervals[i - 1]:
        return 0
    elif x <= intervals[i]:
        return ((x - intervals[i - 1]) / (intervals[i] - intervals[i - 1]))
    elif x <= intervals[i + 1]:
        return ((intervals[i + 1] - x) / (intervals[i + 1] - intervals[i]))
    else:
        return 0

def fi_diff(i, x):
    if x <= intervals[i - 1]:
        return 0
    elif x <= intervals[i]:
        return (1 / (intervals[i] - intervals[i - 1]))
    elif x <= intervals[i + 1]:
        return (1 / (intervals[i] - intervals[i + 1]))
    else:
        return 0

def integrate(func, start, end, *args):
    steps = 10000
    h = ((end - start) / steps)
    half = h / 2
    value = 0
    for i in range(0, steps):
        dh = func(start + h * i + half, *args)
        if i == 0 or i == (steps - 1):
            value += dh
        else:
            value += (2 * dh)
    return (value * (h / 2))

def p(x):
    return e**x

def q(x):
    return e**x

def f(x):
    return (x+(2-x)*e**x)

def m_intern(x, i, j):
    return (p(x) * fi_diff(i, x) * fi_diff(j, x) + q(x) * fi(i, x) * fi(j, x))

def m(i, j):
    i = i + 1
    j = j + 1
    return integrate(m_intern, 0, 1, i, j)

def b_intern(x, i):
    return (f(x) * fi(i, x))

def b(i):
    i = i + 1
    return integrate(b_intern, 0, 1, i)

M = zeros(n, n+1)
for i in range(0, n):
    M[i, n] = b(i)
    M[i, i] = m(i, i)
    if (i - 1) >= 0:
        M[i, i - 1] = m(i, i - 1)
    if (i + 1) < n:
        M[i, i + 1] = m(i, i + 1)
coeficients = symbols('a_0:{}'.format(n))
solution, = linsolve(M, coeficients)

def function(solution, x):
    value = 0
    i = 0
    for c in solution:
        value += c * fi(i + 1, x)
        i = i + 1
    return value
def function_original(x):
    return ((x - 1) * (e**(-x) - 1))

plot_interval = numpy.arange(0.0, 1.0, 0.01)
plot_original = function_original(plot_interval)
plot_aprox = []
for i in plot_interval:
    plot_aprox.append(function(solution, i))
fig = pyplot.figure()
axes = fig.add_subplot(1, 1, 1)
axes.plot(plot_interval, plot_aprox, color='tab:blue')
axes.plot(plot_interval, plot_original, color='tab:orange')
axes.set_title('Rayleigh-Ritz With n=' + str(n))
pyplot.show()