#
#  Swap two vars in Python
#
import numpy as np

# Swaps
data = np.random.random(2)

print(data)

data[0], data[1] = data[1], data[0]

print(data)

# Does not swap.
data = np.random.random((2, 2))

print(data)

data[0], data[1] = data[1], data[0]

print(data)
