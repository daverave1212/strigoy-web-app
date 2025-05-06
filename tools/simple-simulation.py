import random

def random_int(x, y):
    return random.randint(x, y)

def percent_chance(percentage):
    return random.uniform(0, 100) < percentage

def shuffled(arr):
    new_arr = arr[:]
    random.shuffle(new_arr)
    return new_arr

def random_of(arr):
    return random.choice(arr)


N_WHITE = 10
N_RED = 2
SKIPS_ONE = True

only_white = 0
equal_count = 0


for _ in range(100000):
    white = N_WHITE
    red = N_RED
    bag = ['W'] * white + ['R'] * red
    will_skip_one = SKIPS_ONE

    while True:

        if will_skip_one and percent_chance(50):
            will_skip_one = False
            picked_extra_ball = random.choice(bag)
            while picked_extra_ball == 'R':
                picked_extra_ball = random.choice(bag)
            bag.remove(picked_extra_ball)

        ball = random.choice(bag)
        bag.remove(ball)
        random.shuffle(bag)

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