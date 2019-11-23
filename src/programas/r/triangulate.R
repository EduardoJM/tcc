n <- 5
space <- 1/(n+1)
numbers <- 0:(n+1)
intervals <- numbers * space

fi <- function(i, x){
	if(x <= intervals[i - 1]){
		result <- 0
	}
	else if(x <= intervals[i]){
		h <- intervals[i] - intervals[i - 1]
		result <- ((x - intervals[i - 1]) / h)
	}
	else if(x <= intervals[i + 1]){
		h <- intervals[i + 1] - intervals[i]
		result <- ((intervals[i + 1] - x) / h)
	}
	else {
		result <- 0
	}
	return (result)
}

fi_diff <- function(i, x){
	if(x <= intervals[i - 1]){
		result <- 0
	}
	else if(x <= intervals[i]){
		h <- intervals[i] - intervals[i - 1]
		result <- (1 / h)
	}
	else if(x <= intervals[i + 1]){
		h <- intervals[i + 1] - intervals[i]
		result <- (-(1 / h))
	}
	else {
		result <- 0
	}
	return (result)
}

p <- function(x){
	return(exp(x))
}

q <- function(x){
	return(exp(x))
}

f <- function(x){
	return(x+(2-x)*exp(x))
}

integrate <- function(vector, dx){
	value <- 0
	iterations <- 0
	len <- length(vector) - 1
	for(y in vector){
		if(iterations == 0){
			value <- value + y
		}else if(iterations == len){
			value <- value + y
		}
		else{
			value <- value + 2 * y
		}
		iterations <- iterations + 1
	}
	value <- value * (dx/2)
	return (value)
}

m_intern <- function(x, i, j){
	value <- p(x) * fi_diff(i, x) * fi_diff(j, x)
	value <- value + q(x) * fi(i, x) * fi(j, x)
	return (value)
}

b_intern <- function(x, i){
	value <- (f(x) * fi(i, x))
	return (value)
}

m <- function(i, j){
	i <- i + 1
	j <- j + 1
	i_precision <- 10000
	i_space <- 1/(i_precision + 1)
	i_numbers <- 0:(i_precision + 1)
	i_intervals <- i_numbers * i_space
	result = c()
	for(k in 1:length(i_intervals)){
		result[k] <- m_intern(i_intervals[k], i, j)
	}
	return(integrate(result, i_space))
}

b <- function(i){
	i <- i + 1
	i_precision <- 10000
	i_space <- 1/(i_precision + 1)
	i_numbers <- 0:(i_precision + 1)
	i_intervals <- i_numbers * i_space
	result = c()
	for(k in 1:length(i_intervals)){
		result[k] <- b_intern(i_intervals[k], i)
	}
	return(integrate(result, i_space))
}

M <- matrix(0, nrow=n, ncol=n)
B <- matrix(0, nrow=n, ncol=1)
for(i in 1:n){
	B[i, 1] = b(i)
    	M[i, i] = m(i, i)
	if ((i - 1) >= 1){
		M[i, i - 1] = m(i, i - 1)
	}
	if ((i + 1) <= n){
		M[i, i + 1] = m(i, i + 1)
	}
}

solution <- solve(M, B)

approx <- function(sol, x){
	value <- 0
	ind <- 1
	for(s in sol){
		value <- value + s * fi(ind + 1, x)
		ind <- ind + 1
	}
	return (value)
}

original <- function(x){
	value <- (x-1) * (exp(-x)-1)
	return (value)
}

plot_precision <- 1000
plot_space <- 1/(plot_precision + 1)
plot_numbers <- 0:(plot_precision + 1)
plot_intervals <- plot_numbers * plot_space
plot_func_approx <- c()
for(i in 1:length(plot_intervals)){
	plot_func_approx[i] <- approx(solution, plot_intervals[i])
}

plot(plot_intervals, plot_func_approx,
	main="Rayleigh-Ritz with triangular functions",
	ylab="v(x)",
	xlab="x",
	type="l",
	col="blue")
lines(plot_intervals, original(plot_intervals), col="orange")
legend("topleft",
	c("aproximada","original"),
	fill=c("blue","orange")
)