import random
from enum import Enum
from dataclasses import dataclass
import os

Townsfolk = 'Townsfolk'
TownGuard = 'Town Guard'
Cat = 'Cat'

Negative = 'Negative'

Ghoul = 'Ghoul'
Vampire = 'Vampire'
HorribleVampire = 'Horrible Vampire'
Strigoy = 'Strigoy'
Nosferatu = 'Nosferatu'
Mora = 'Mora'
Dhampir = 'Dhampir'

# Enums for distribution
Kill = 'Kill Card'
DoubleKill = 'Double Kill'
DelayedKill = 'Delayed Kill Card'
MaybeKill = 'Maybe Kill'
Reveal = 'Reveal Card'
DelayedReveal = 'Delayed Reveal Card'
MaybeReveal = 'Maybe Reveal'
MaybeKillAndReveal = 'Maybe Kill and Reveal'
KillAndMaybeReveal = 'Kill and Maybe Reveal'
ExtraAttack = 'Extra Attack'
RandomOrangeEffect = 'RandomOrangeEffect'

Other = 'Other Card'
DontDieOnce = 'Dont Die Once'
MaybeProtect = 'Maybe Protect'
AddRedCard = 'Add Red Card'
ExtraMaybeHang = 'Maybe Hang Twice'

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

GreenCard = Card('Green', [MaybeProtect, AddRedCard, DontDieOnce, ExtraMaybeHang, Other, Other, Other, Other, Other, Other, Other])
YellowCard = Card('Yellow', [DelayedReveal, Kill, DelayedKill, DelayedKill, Other, Other, Reveal, MaybeReveal, DelayedReveal, MaybeReveal, DelayedKill, MaybeKillAndReveal, Other])
OrangeCard = Card('Orange', [Reveal, MaybeReveal, DelayedReveal, MaybeReveal, DelayedKill, MaybeKillAndReveal, Other])
RedCard = Card('Red', [Reveal, Kill, Kill])

@dataclass
class Location:
    i: int
    cards: list

    def get_attack_priority_score(self):
        return sum([card.get_attack_priority_score() for card in self.cards])



# Config [Config]
N_SIMULATIONS = 35000
IS_DEBUG = False

GET_BOARD_SETUP = lambda: [
    [GreenCard, YellowCard, RedCard],
    [GreenCard, YellowCard, RedCard],
    [GreenCard, YellowCard, RedCard]
]

EVILS = [Strigoy, Vampire]  
TOWNSFOLK = [
    Townsfolk, Townsfolk, Townsfolk, Townsfolk,
    Townsfolk, Townsfolk, Townsfolk, Townsfolk,
    Townsfolk, Townsfolk, Townsfolk
]

# Final Settings
# 7   [+3] [🟡] GV - 34.2%     kill: 68%       kill speed: 4.14        location speed: 4.55
# 8   [+2] [🟡] GV - 34.2%     kill: 51%       kill speed: 5.14        location speed: 4.94
# 9   [+1] [🟡] GG - 35.2%     kill: 52%       kill speed: 6.17        location speed: 6.21
# 10       [🟡] GG - 34.5%     kill: 54%       kill speed: 6.16        location speed: 6.18
# 11       [🟡] SG - 37%       kill: 60%       kill speed: 5.88        location speed: 5.75
# 12       [🟡] SS - 36.0%     kill: 44%       kill speed: 6.62        location speed: 6.12
# 13       [🟡] SS - 35%       kill: 61%       kill speed: 5.94        location speed: 6
# 14  [-1] [🟡] SS - 36%       kill: 44%       kill speed: 6.5         location speed: 6
# 15  [-2] [🟡] SS - 35%       kill: 45%       kill speed: 6.6         location speed: 6.25
# 16  [-3] [🟡] SS - 35%       kill: 45%       kill speed: 6.6         location speed: 6.25


# 17       NNN - 35.5%     kill: 58%       kill speed: 6.04        location speed: 6.04





# 16  [-3]  MN - 39%       kill: 46%       kill speed: 6.6         location speed: 6.25
# 16        MN - 29%       kill: 11%       kill speed: 9           location speed: 7.12
# 16        MM - 33%       kill: 11%       kill speed: 9           location speed: 7
# 16  [-3]  MM - 44%       kill: 49%       kill speed: 6.6         location speed: 6.25
# 16  [-1]  MM - 39%       kill: 19%       kill speed: 6.6         location speed: 6.25


# 17  [-3]  MM - 37%       kill: 32%       kill speed: 6.6         location speed: 6.25


'''
    When evils win by kills, it leaves less room for winning by location.
    Therefore winning by location will automatically be faster because of survivorship bias.
    Therefore having more kills also speeds up the game for winning by locations.
    The aim is to have 50% kill win and 50% location win

    At 10 players with 1 Strigoy, player win rate = 36%, with 50% kill win and 50% location win
    There are 3 possibilities:
    - Players hang all evils
    - Evils kill all players
    - Evils blow all cards
'''

N_PLAYERS = len(EVILS) + len(TOWNSFOLK)
N_EVILS = len(EVILS)
N_TOWNSFOLK = N_PLAYERS - len(EVILS)

CHANCE_TO_HANG_EVERY_NIGHT = 75





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
def round_to_nearest_quarter(x):
    return round(x * 4) / 4

# Simulation functions
TownsfolkWin = 'Townsfolk Win'
EvilWin = 'Evil Win'

def is_bad_role(role):
    return role == Ghoul or role == Vampire or role == Strigoy or role == Nosferatu

def is_game_over(roles_in_game, board):
    for location in board:
        if len(location.cards) == 0:
            return (True, EvilWin, 'location')

    bad_roles = [role for role in roles_in_game if is_bad_role(role)]
    good_roles = [role for role in roles_in_game if role == Townsfolk]
    if len(good_roles) == len(roles_in_game):
        return (True, TownsfolkWin, None)
    if len(bad_roles) == len(good_roles):
        return (True, EvilWin, 'kills')
    if len(good_roles) == 0:
        return (True, EvilWin, 'kills')
    return (False, None, None)

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
    if len(location.cards) == 0:
        print(f'WARNING: location {location.i} has no cards to blow!')
        return None
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

def get_win_reason(board_state):
    locations_with_0_cards = [n_cards for n_cards in board_state['board'] if n_cards == 0]
    if board_state['evils'] == 0:
        # print(f'--- No evils, returning None')
        return None
    if len(locations_with_0_cards) > 0:
        # print(f'--- There is a location with 0 cards. len(...) is {len(locations_with_0_cards)}')
        return 'location'
    # print(f'--- Win by kills')
    return 'kills'

def add_red_card_to_good_location(board):
    locations_n_cards = [len(location.cards) for location in board]
    locations_with_1_card = [i for i in range(len(locations_n_cards)) if i == 1]
    if len(locations_with_1_card) > 0:
        i = random_of(locations_with_1_card)
        board[i].cards.append(RedCard)
        return
    locations_with_2_cards = [i for i in range(len(locations_n_cards)) if i == 2]
    if len(locations_with_2_cards) > 0:
        i = random_of(locations_with_2_cards)
        board[i].cards.append(RedCard)
        return
    random_of(board).cards.append(RedCard)

evil_effect_mapping = {
    'Ghoul': None,
    'Vampire': ExtraAttack,
    'Horrible Vampire': Reveal,
    'Strigoy': Kill,
    'Nosferatu': KillAndMaybeReveal,
    'Mora': DoubleKill,
    'Dhampir': RandomOrangeEffect
}
townsfolk_effect_mapping = {
    'Townsfolk': None,
    'Negative': Kill,
    'Cat': DontDieOnce,
    'Town Guard': DontDieOnce
}

@dataclass
class Int:
    value: int

# Simulation
def simulate_one_game(is_debug=False):
    board = make_board()
    players_in_game = [Townsfolk for i in range(N_TOWNSFOLK)] + EVILS
    winner = None
    round_number = 0

    remaining_evil_powers = [evil_effect_mapping[evil] for evil in EVILS if evil_effect_mapping[evil] is not None]
    remaining_good_powers = [townsfolk_effect_mapping[tf] for tf in TOWNSFOLK if townsfolk_effect_mapping[tf]]

    delayed_kills = Int(0)
    delayed_reveals = []
    maybe_protects = []
    maybe_extra_hangs = []
    dont_dies = Int(0)

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

    def players_with_done_card_effect(card_effect, players_in_game):
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished:
            return players_in_game

        if players_in_game is None:
            raise Error('players_in_game is None')
        if card_effect == Kill:
            if dont_dies.value > 0:
                dont_dies.value -= 1
                return players_in_game
            new_players_in_game = with_random_killed_townsfolk(players_in_game)
            maybe_print(f'    🔻 A random townsfolk was killed')
            return new_players_in_game
        if card_effect == DelayedKill:
            maybe_print(f'    🟥 There will be a delayed kill')
            delayed_kills.value += 1
        if card_effect == Reveal:
            blown_card = blow_card_by_townsfolk(board)
            maybe_print(f'    🔶 A chosen location card was blown!')
            (is_finished, winner, reason) = is_game_over(players_in_game, board)
            if is_finished:
                return players_in_game
            return players_with_done_card_effect(blown_card.get_random_effect(), players_in_game)
        if card_effect == DelayedReveal:
            maybe_print(f'    🟧 There will be a delayed blown card!')
            delayed_reveals.append(True)
        if card_effect == MaybeKillAndReveal:
            result = random_of([Kill, Reveal, Other])
            return players_with_done_card_effect(result, players_in_game)
        if card_effect == MaybeReveal and percent_chance(50):
            return players_with_done_card_effect(Reveal, players_in_game)
        if card_effect == KillAndMaybeReveal:
            new_players_in_game = players_with_attack_and_protect(players_in_game)
            return players_with_done_card_effect(Kill, players_in_game)
        if card_effect == ExtraAttack:
            maybe_print(f'    🟥 There will be an extra attack.')
            return players_with_attack_and_protect(players_in_game)

        if card_effect == AddRedCard:
            add_red_card_to_good_location(board)
        if card_effect == DontDieOnce:
            dont_dies.value += 1
        if card_effect == ExtraMaybeHang:
            maybe_extra_hangs.append(True)

        return players_in_game

    def blow_and_trigger_card_at_i(location_i):
        card_drawn = blow_card_from_location(board[location_i])
        card_effect = card_drawn.get_random_effect()
        new_players_in_game = players_with_done_card_effect(card_effect, players_in_game)
        return (new_players_in_game, card_drawn, card_effect)

    def players_with_attack_and_protect(players_in_game):
        if len(maybe_protects) > 0 and percent_chance(50):
            maybe_protects.pop()
            return players_in_game
        location_attack_i = pick_attack_location(board)
        location_protect_i = pick_protect_location_i(board)
        maybe_print(f'  Nosferatus attacked {location_attack_i}, players predicted {location_protect_i}')
        if location_attack_i != location_protect_i:
            (new_players_in_game, card_drawn, card_effect) = blow_and_trigger_card_at_i(location_attack_i)
            maybe_print(f'  Predict failed! {card_drawn.get_emoji()}Card {card_drawn.name} was blown from location {location_attack_i}. Card effect: {card_effect}')
            return new_players_in_game
        return players_in_game

    while True:
        round_number += 1
        maybe_print(f'\nRound {round_number} starting with {len(players_in_game)} players.')
        if is_debug:
            print_board_state()

        # If any delayed kills and reveals
        if delayed_kills.value > 0 and percent_chance(50):
            players_in_game = players_with_done_card_effect(Kill, players_in_game)
            delayed_kills.value -= 1

        if len(delayed_reveals) > 0 and percent_chance(50):
            players_in_game = players_with_done_card_effect(Reveal, players_in_game)
            delayed_reveals.pop()

        # Check win
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished:
            break

        # Good powers
        if len(remaining_good_powers) > 0:
            good_effect = remaining_good_powers.pop()
            maybe_print(f'    Using a townsfolk power with effect: {good_effect}')
            if good_effect == None:
                pass
            else:
                players_in_game = players_with_done_card_effect(good_effect, players_in_game)
        
        # Check win
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished:
            break

        # Evil powers
        if len(remaining_evil_powers) > 0 and round_number > 1:
            evil_effect = remaining_evil_powers.pop()
            maybe_print(f'    Using an evil power with effect: {evil_effect}')
            if evil_effect == DoubleKill:
                remaining_evil_powers.append(Kill)
                random.shuffle(remaining_evil_powers)
                players_in_game = players_with_done_card_effect(Kill, players_in_game)
            elif evil_effect == RandomOrangeEffect:
                players_in_game = players_with_done_card_effect(YellowCard.get_random_effect(), players_in_game)
            elif evil_effect != None:
                players_in_game = players_with_done_card_effect(evil_effect, players_in_game)

        # Check win
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished and reason != 'location':
            break

        # Attack and protect
        if reason != 'location':
            players_in_game = players_with_attack_and_protect(players_in_game)
        
        # Check win
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished and reason != 'location':
            break

        # Hang
        chance_to_hang = get_chance_to_hang(players_in_game)
        maybe_print(f'  Chance to hang: {chance_to_hang}%')
        if percent_chance(chance_to_hang):
            maybe_print(f'  Hanging!')
            players_in_game = with_random_hanged_player(players_in_game)
        else:
            maybe_print(f'  Not hanging anyone.')
        
        # Extra hangs (e.g. crossbow)
        if len(maybe_extra_hangs) > 0 and percent_chance(50):
            maybe_extra_hangs.pop()
            players_in_game = with_random_hanged_player(players_in_game)
        
        # Check win
        (is_finished, winner, reason) = is_game_over(players_in_game, board)
        if is_finished:
            break

    maybe_print(f'Game ended with winner: {winner}')
    board_state = get_board_state()
    if is_debug:
        print_board_state()

    reason = get_win_reason(board_state)
    return {
        'winner': winner,
        'rounds': board_state['rounds'],
        'reason': reason,
        'players_in_game': players_in_game,
        'evils': len([None for player in players_in_game if is_bad_role(player)]),
        'townsfolk': len([None for player in players_in_game if is_bad_role(player) == False]),
    }

townsfolk_wins = 0
evil_wins = 0
evil_kill_wins = 0
evil_kill_wins_kill_distribution = {}
evil_kill_wins_length_distribution = {}
evil_location_wins = 0
evil_location_wins_length_distribution = {}

total_townsfolk_win_duration = 0
total_kill_wins_duration = 0
total_location_wins_duration = 0

for i in range(N_SIMULATIONS):
    game_status = simulate_one_game(IS_DEBUG)
    if i % 1500 == 0 and IS_DEBUG is False:
        os.system('cls')
        print(f'{int(i / N_SIMULATIONS * 100)}%...')
    
    if game_status['winner'] == TownsfolkWin:
        townsfolk_wins += 1
        total_townsfolk_win_duration += game_status['rounds']
        continue
    
    evil_wins += 1
    if game_status['reason'] == 'kills':
        evil_kill_wins += 1
        total_kill_wins_duration += game_status['rounds']
        n_kills = N_TOWNSFOLK - game_status['townsfolk']
        if n_kills not in evil_kill_wins_kill_distribution:
            evil_kill_wins_kill_distribution[n_kills] = 0
        evil_kill_wins_kill_distribution[n_kills] += 1
        rounds = game_status['rounds']
        if rounds not in evil_kill_wins_length_distribution:
            evil_kill_wins_length_distribution[rounds] = 0
        evil_kill_wins_length_distribution[rounds] += 1
    else:
        evil_location_wins += 1
        total_location_wins_duration += game_status['rounds']
        rounds = game_status['rounds']
        if rounds not in evil_location_wins_length_distribution:
            evil_location_wins_length_distribution[rounds] = 0
        evil_location_wins_length_distribution[rounds] += 1


townsfolk_win_percentage = townsfolk_wins / N_SIMULATIONS * 100
evil_win_percentage = evil_wins / N_SIMULATIONS * 100
evil_kill_win_percentage = evil_kill_wins / max(evil_wins, 1) * 100
evil_location_win_percentage = 100 - evil_kill_win_percentage

average_townsfolk_win_duration = total_townsfolk_win_duration / max(townsfolk_wins, 1)
average_location_win_duration = total_location_wins_duration / max(evil_location_wins, 1)
average_kill_win_duration = total_kill_wins_duration / max(evil_kill_wins, 1)


os.system('cls')
print(f'Results for {N_PLAYERS} and evils {EVILS}:')
print(f'Townsfolk wins: {round(townsfolk_win_percentage, 2)}%')
print(f'Evil wins: {round(evil_win_percentage, 2)}% of which kill wins: {round(evil_kill_win_percentage, 2)}%, location wins: {round(evil_location_win_percentage, 2)}%')
print(f'Tonsfolk win duration: {round(average_townsfolk_win_duration, 2)}, Evil kill win duration: {round(average_kill_win_duration, 2)}, Evil location win duration: {round(average_location_win_duration, 2)}')

if False:
    times = sorted([int(key) for key in evil_location_wins_length_distribution.keys()])
    n_games_per_time = [evil_location_wins_length_distribution[time] for time in times]
    print(f'\nLocation win times distribution:')
    print(times)
    print(n_games_per_time)

    times = sorted([int(key) for key in evil_kill_wins_length_distribution.keys()])
    n_games_per_time = [evil_kill_wins_length_distribution[time] for time in times]
    print(f'\nKill win times distribution:')
    print(times)
    print(n_games_per_time)

    killses = sorted([int(key) for key in evil_kill_wins_kill_distribution.keys()])
    n_kills_per_game = [evil_kill_wins_kill_distribution[kills] for kills in killses]
    print(f'\nKills distribution:')
    print(killses)
    print(n_kills_per_game)