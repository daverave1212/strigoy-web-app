import random

N_WHITE = 7
N_RED = 2

only_white = 0
equal_count = 0

for _ in range(100000):
    white = N_WHITE
    red = N_RED
    bag = ['W'] * white + ['R'] * red

    while True:
        ball = random.choice(bag)
        bag.remove(ball)

        white = bag.count('W')
        red = bag.count('R')

        if red == 0:
            only_white += 1
            break
        elif red >= white:
            equal_count += 1
            break

print("P(only white):", only_white / 100000)
print("P(equal):", equal_count / 100000)