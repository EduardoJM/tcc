import numpy as np
from math import e
from sympy import symbols
from sympy.matrices import zeros
from sympy.solvers import linsolve
import matplotlib.pyplot as plt
from matplotlib.collections import EventCollection

#E, I, q = symbols('E I q')

#E = 200
#I = 50
#q = 100
#L = 1

n = 4
#space = 1/(n + 1)
#intervals = [0]
#for i in range(0, n):
#    intervals.append(space * (i + 1))
#intervals.append(1)

#print(intervals)

#def fi(i, x):
#    return x ** i
    #if x <= intervals[i - 1]:
    #    return 0
    #elif x <= intervals[i]:
    #    return ((x - intervals[i - 1]) / (intervals[i] - intervals[i - 1]))
    #elif x <= intervals[i + 1]:
    #    return ((intervals[i + 1] - x) / (intervals[i + 1] - intervals[i]))
    #else:
    #    return 0

#def fi_diff(i, x):
#    if i == 0:
#        return 0
#    return x ** (i - 1)
    #if x <= intervals[i - 1]:
    #    return 0
    #elif x <= intervals[i]:
    #    return (1 / (intervals[i] - intervals[i - 1]))
    #elif x <= intervals[i + 1]:
    #    return (1 / (intervals[i] - intervals[i + 1]))
    #else:
    #    return 0

#def fi_diff2(i, x):
#    if i <= 1:
#        return 0
#    return x ** (i - 2)

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
    #return (p(x) * fi_diff(i, x) * fi_diff(j, x) + q(x) * fi(i, x) * fi(j, x))
    p1 = 2 * p(x) * j * x ** (j - 1) * i * x ** i
    p2 = 2 * q(x) * (x ** j - 1) * (x ** i - 1)
    return p1 + p2

def a(i, j):
    return integrate(a_intern, 0, 1, i, j)

def b_intern(x, i):
    return 2 * f(x) * (x ** i - 1)

def b(i):
    return integrate(b_intern, 0, 1, i)

k = n - 2
A = zeros(k, k + 1)
for i in range(0, k):
    for j in range(0, k + 1):
        if j == k:
            A[i, j] = b(i + 2)
        else:
            A[i, j] = a(i + 2, j + 2)

print(A)

coeficients = symbols('a_0:{}'.format(k))
print(coeficients)

solution, = linsolve(A, coeficients)
print(solution)

def function_origin(x):
    return ((x - 1) * (e**(-x) - 1))

coef_isol = 0
for c in solution:
    coef_isol -= c

def function(solution, x):
    #y = symbols('y')
    #test = 0
    #i = 0
    #for c in solution:
    #    test += c * y ** i
    #    i = i + 1
    #print(test)
    value = 0
    i = 2
    value += coef_isol * x
    for c in solution:
        value += c * x ** i
        i = i + 1
    return value

#ydata1 = []
#for i in intervals:
#    ydata1.append(function(solution, i))
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1)
#ax.plot(intervals, ydata1, color='tab:blue')
t = np.arange(0.0, 1.0, 0.01)
s = function_origin(t)
n = function(solution, t)
ax.plot(t, n, color='tab:blue')
ax.plot(t, s, color='tab:orange')
#ax.plot(intervals, ydata2, color='tab:orange')

#ax.set_title('Rayleigh-Ritz Implementation With n=' + str(n))

# display the plot
plt.show()

#for i in intervals:
#    err = abs(function(solution, i) - function_origin(i))
#    print("E: " + str(err))