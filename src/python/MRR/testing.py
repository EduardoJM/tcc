import numpy as np
from math import e
from sympy import symbols
from sympy.matrices import zeros
from sympy.solvers import linsolve
import matplotlib.pyplot as plt
from matplotlib.collections import EventCollection

n = 20
space = 1/(n + 1)
intervals = [0]
for i in range(0, n):
    intervals.append(space * (i + 1))
intervals.append(1)

#print(intervals)

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
        if i == 0 or i == steps:
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

def a_intern(x, i, j):
    return (p(x) * fi_diff(i, x) * fi_diff(j, x) + q(x) * fi(i, x) * fi(j, x))

def a(i, j):
    return integrate(a_intern, 0, 1, i, j)

def b_intern(x, i):
    return (f(x) * fi(i, x))

def b(i):
    return integrate(b_intern, 0, 1, i)


A = zeros(n, n+1)
for i in range(0, n):
    for j in range(0, n + 1):
        if j == n:
            A[i, j] = b(i + 1)
        elif j == i or j == i - 1 or j == i + 1:
            A[i, j] = a(i + 1, j + 1)

#print(A)

coeficients = symbols('c_0:{}'.format(n))
#print(coeficients)

solution, = linsolve(A, coeficients)
#print(solution)

def function_origin(x):
    return ((x - 1) * (e**(-x) - 1))

def function(solution, x):
    value = 0
    i = 0
    for c in solution:
        value += c * fi(i + 1, x)
        i = i + 1
    return value

ydata1 = []
for i in intervals:
    ydata1.append(function(solution, i))
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1)
ax.plot(intervals, ydata1, color='tab:blue')
t = np.arange(0.0, 1.0, 0.01)
s = function_origin(t)
ax.plot(t, s, color='tab:orange')
#ax.plot(intervals, ydata2, color='tab:orange')

ax.set_title('Rayleigh-Ritz Implementation With n=' + str(n))

# display the plot
plt.show()

#for i in intervals:
#    err = abs(function(solution, i) - function_origin(i))
#    print("E: " + str(err))