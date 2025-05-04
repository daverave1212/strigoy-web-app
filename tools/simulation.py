import random
from enum import Enum
from dataclasses import dataclass

Townsfolk = 'Townsfolk'
Ghoul = 'Ghoul'
Vampire = 'Vampire'
Nosferatu = 'Nosferatu'
Strigoy = 'Strigoy'

# Enums for distribution
Kill = 'Kill Card'
Reveal = 'Reveal Card'
Other = 'Other Card'

@dataclass
class Card:
    name: str
    distribution: list

    def get_attack_priority_score(self):
        n_bad_possibilities = len([_ for effect in self.distribution if effect != Other])
        n_good_possibilities = len([_ for effect in self.distribution if effect == Other])
        return n_bad_possibilities - n_good_possibilities
    
    def get_random_effect(self):
        return random_of(self.distribution)

    def get_emoji(self):
        if self.name == 'Green':
            return '🟢'
        if self.name == 'Yellow':
            return '🟡'
        if self.name == 'Orange':
            return '🟠'
        if self.name == 'Red':
            return '🔴'

GreenCard = Card('Green', [Other])
YellowCard = Card('Yellow', [Kill, Reveal, Other])
OrangeCard = Card('Orange', [Kill, Kill, Kill, Reveal, Reveal, Reveal, Other, Other])
RedCard = Card('Red', [Reveal, Kill, Kill])

@dataclass
class Location:
    i: int
    cards: list

    def get_attack_priority_score(self):
        return sum([card.get_attack_priority_score() for card in self.cards])



# Config
N_PLAYERS = 10
EVILS = [Ghoul, Ghoul]

N_TOWNSFOLK = N_PLAYERS - len(EVILS)

GET_BOARD_SETUP = lambda: [
    [GreenCard, YellowCard, RedCard],
    [GreenCard, YellowCard, RedCard],
    [GreenCard, YellowCard, RedCard]
]

CHANCE_TO_HANG_EVERY_NIGHT = 66





# Utility functions
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


# Simulation functions
TownsfolkWin = 'Townsfolk Win'
EvilWin = 'Evil Win'

def is_bad_role(role):
    return role == Ghoul or role == Vampire or role == Nosferatu or role == Strigoy

def is_game_over(roles_in_game, board):
    for location in board:
        if len(location.cards) == 0:
            return (True, EvilWin)

    bad_roles = [role for role in roles_in_game if is_bad_role(role)]
    good_roles = [role for role in roles_in_game if role == Townsfolk]
    if len(good_roles) == len(roles_in_game):
        return (True, TownsfolkWin)
    if len(bad_roles) == len(good_roles):
        return (True, EvilWin)
    if len(good_roles) == 0:
        return (True, EvilWin)
    return (False, None)

def townsfolk_predict_location(board_setup):
    location_with_one_card = [location for location in board_setup if len(location) == 1]

def pick_attack_location(locations):
    locations_n_cards = [len(location.cards) for location in locations]
    locations_with_1_card = [i for i in range(len(locations_n_cards)) if i == 1]
    locations_with_more_cards = [i for i in range(len(locations_n_cards)) if i > 1]
    
    # If choice is too obvious, just pick randomly
    if (len(locations_with_1_card) == 1):
        return random_of(range(len(locations)))
    
    # If multiple possibilities, try to win
    if (len(locations_with_1_card) > 1):
        return random_of(locations_with_one_card)
    
    return random_of(range(len(locations)))

def get_locations_with_condition(locations, lambda_condition):
    locations_n_cards = [len(location.cards) for location in locations]
    return [location for location in locations if lambda_condition(location)]

def pick_protect_location_i(locations):
    locations_n_cards = [len(location.cards) for location in locations]
    locations_with_1_card = get_locations_with_condition(locations, lambda x: len(x.cards) == 1)
    locations_with_more_cards = get_locations_with_condition(locations, lambda x: len(x.cards) > 1)
    
    # If loss is imminent, you have to try to protect that
    if (len(locations_with_1_card) > 0):
        picked_i = random_of(locations_with_1_card).i
        return picked_i
    
    return random_of(locations).i

def blow_card_from_location(location):
    card_drawn = location.cards.pop()
    return card_drawn

def get_chance_to_hang(players):    # Increases the fewer players there are
    return CHANCE_TO_HANG_EVERY_NIGHT * (1 + 1 - len(players) / N_PLAYERS)




def make_board():
    board_setup = GET_BOARD_SETUP()
    board = []
    for i in range(len(board_setup)):
        card_types = board_setup[i]
        location = Location(i, shuffled(card_types))
        board = board + [location]
    return board

def with_random_killed_townsfolk(players_in_game):
    while (True):
        new_players_in_game = shuffled(players_in_game)
        player_removed = new_players_in_game.pop()
        if player_removed != Townsfolk:
            continue
        # print(f'    with_random_killed_townsfolk: {len(new_players_in_game)}')
        return new_players_in_game

def with_random_hanged_player(players_in_game):
    random.shuffle(players_in_game)
    players_in_game.pop()
    return players_in_game

def blow_card_by_townsfolk(locations):
    locations_by_priority = sorted(locations, key=lambda x: len(x.cards))
    location_i = locations_by_priority[-1].i
    blown_card = locations[location_i].cards.pop()
    return blown_card



# Simulation
def simulate_one_game(is_debug=False):
    board = make_board()
    players_in_game = [Townsfolk for i in range(N_TOWNSFOLK)] + EVILS
    winner = None
    round_number = 0

    def maybe_print(msg):
        if is_debug == False:
            return
        print(msg)

    def get_board_state():
        evils_remaining = [p for p in players_in_game if p != Townsfolk]
        townsfolk_remaining = [p for p in players_in_game if p == Townsfolk]
        locations_n_cards = [len(location.cards) for location in board]
        return {
            "townsfolk": len(townsfolk_remaining),
            "evils": len(evils_remaining),
            "board": locations_n_cards,
            "rounds": round_number
        }
    def print_board_state():
        board_state = get_board_state()
        print(board_state)

    def players_with_done_card_effect(card_effect):
        if card_effect == Kill:
            new_players_in_game = with_random_killed_townsfolk(players_in_game)
            maybe_print(f'    🔻 A random townsfolk was killed')
            return new_players_in_game
        if card_effect == Reveal:
            blown_card = blow_card_by_townsfolk(board)
            maybe_print(f'    🔶 A chosen location card was blown!')
            
            (is_finished, winner) = is_game_over(players_in_game, board)
            if is_finished:
                return players_in_game
            
            return players_with_done_card_effect(blown_card.get_random_effect())
        return players_in_game

    while True:
        round_number += 1
        maybe_print(f'\nRound {round_number} starting with {len(players_in_game)} players.')
        if is_debug:
            print_board_state()

        location_attack_i = pick_attack_location(board)
        location_protect_i = pick_protect_location_i(board)

        maybe_print(f'  Strigoys attacked {location_attack_i}, players predicted {location_protect_i}')

        # If failed to protect a location
        if location_attack_i != location_protect_i:
            card_drawn = blow_card_from_location(board[location_attack_i])
            card_effect = card_drawn.get_random_effect()
            maybe_print(f'  Predict failed! {card_drawn.get_emoji()}Card {card_drawn.name} was blown from location {location_attack_i}. Card effect: {card_effect}')
            players_in_game = players_with_done_card_effect(card_effect)
        
        # Check win
        (is_finished, winner) = is_game_over(players_in_game, board)
        if is_finished:
            break

        # Hang
        chance_to_hang = get_chance_to_hang(players_in_game)
        maybe_print(f'  Chance to hang: {chance_to_hang}%')
        if percent_chance(chance_to_hang):
            maybe_print(f'  Hanging!')
            players_in_game = with_random_hanged_player(players_in_game)
        else:
            maybe_print(f'  Not hanging anyone.')
        
        # Check win
        (is_finished, winner) = is_game_over(players_in_game, board)
        if is_finished:
            break

    maybe_print(f'Game ended with winner: {winner}')
    board_state = get_board_state()
    if is_debug:
        print_board_state()
    return {
        'winner': winner,
        'rounds': board_state['rounds'],
        'reason':
            None if board_state['evils'] == 0 else
            'kills' if board_state['townsfolk'] == 0 else
            'location'
    }


n_simulations = 10000
is_debug = False

townsfolk_wins = 0
evil_wins = 0
evil_kill_wins = 0
evil_location_wins = 0

total_townsfolk_win_duration = 0
total_kill_wins_duration = 0
total_location_wins_duration = 0

for i in range(n_simulations):
    game_status = simulate_one_game(is_debug)
    
    if game_status['winner'] == TownsfolkWin:
        townsfolk_wins += 1
        total_townsfolk_win_duration += game_status['rounds']
        continue
    
    evil_wins += 1
    if game_status['reason'] == 'kills':
        evil_kill_wins += 1
        total_kill_wins_duration += game_status['rounds']
    else:
        evil_location_wins += 1
        total_location_wins_duration += game_status['rounds']


townsfolk_win_percentage = townsfolk_wins / n_simulations * 100
evil_win_percentage = evil_wins / n_simulations * 100
evil_kill_win_percentage = evil_kill_wins / evil_wins * 100
evil_location_win_percentage = 100 - evil_kill_win_percentage

average_townsfolk_win_duration = total_townsfolk_win_duration / max(townsfolk_wins, 1)
average_location_win_duration = total_location_wins_duration / max(evil_location_wins, 1)
average_kill_win_duration = total_kill_wins_duration / max(evil_kill_wins, 1)

print('Results:')
print(f'Townsfolk wins: {townsfolk_win_percentage}%    Evil wins: {evil_win_percentage}% of which kill wins: {evil_kill_win_percentage}%, location wins: {evil_location_win_percentage}%')
print(f'Tonsfolk win duration: {average_townsfolk_win_duration}, Evil kill win duration: {average_kill_win_duration}, Evil location win duration: {average_location_win_duration}')
