import { arrayFindHighest, arrayFindIndexLowest, arrayFindLowest, groupArrayBy, percentChance, popArrayElementAt, popArrayElementFind, randomOf, randomizeArray, sum, times } from "./utils"
import { browser } from '$app/environment'

export const WEREWOLVES = 'werewolves'
export const TOWNSFOLK = 'townsfolk'
export const OTHER = 'other'

export const ALL_EVILS = 0
export const BEGINNER = 1
export const INTERMEDIATE = 2
export const CHAOS = 2.5
export const ADVANCED = 3
export const DRUNKEN_TAVERN = 3.5
export const MORE_CHAOS = 3.75
export const LOTS_OF_PLAYERS = 4
export const FOR_MODS = 5
export const ROLES_NO_ONE_UNDERSTANDS = 6
export const EXTRAS = 7
export const COMPLETE = 8
export const BROKEN = 99

export const difficultyNames = {
    [ALL_EVILS]: 'Evils',
    [BEGINNER]: 'Base Roles',
    [INTERMEDIATE]: 'Intermediate',
    [ADVANCED]: 'Advanced & Complex',
    [DRUNKEN_TAVERN]: 'Drunken Tavern',
    [FOR_MODS]: 'Mods & Points',
    [ROLES_NO_ONE_UNDERSTANDS]: 'Roles You Should Not Use',
    [EXTRAS]: 'Extra Roles',
    [COMPLETE]: 'Complete',
    [BROKEN]: 'Broken',
    [CHAOS]: 'Chaos',
    [MORE_CHAOS]: 'More Chaos',
}
export const difficultyDescriptions = {
    [ALL_EVILS]: 'These are all the Evils in the game. Not all may be used in the game you are playing. For example, Vampires are only used for 7 or 8 players.',
    [BEGINNER]: 'Use these roles for the base game. Every night, call out each nightly role, even if no player is that role. The game will automatically show you the roles you should remember.',
    [INTERMEDIATE]: 'Extra roles to add to make it more interesting. Every game, there should NOT be both a Town Guard and a Priest (unless there are more than 15 players). You don\'t have to play with all of them. Only choose which roles you like to play with.',
    [CHAOS]: 'Roles that add more randomnes and crazyness in the game. Everyone will go mad!',
    [ADVANCED]: 'Roles for advanced players who know the game and want more challenge. Beware: having these roles in the game will make it more difficult to narrate!',
    [DRUNKEN_TAVERN]: 'Roles to mess with people\'s minds! Be careful with these -- explain the roles properly if you want to play with them. Otherwise, players may not understand what is happening.',
    [FOR_MODS]: 'Roles that are only in the game if you play with Mods or with points.',
    [ROLES_NO_ONE_UNDERSTANDS]: "Nobody will understand what these roles do. Seriously, don't even bother. Only use these if you are an omniscient AI.",
    [EXTRAS]: "Want EVEN MORE roles? Here you go! These roles aren't particularly difficult or strange, but feel more like 'extras sauce'. All optional, maybe you will like them!",
    [COMPLETE]: 'Complete',
    [BROKEN]: 'These roles are literally broken and you should not use them. Their abilities make no sense.',
    [MORE_CHAOS]: 'More Chaos',
}


export const REGULAR = 'regular'
export const REGULAR_NEGATIVE = 'regular-negative'
export const SETUP = 'setup'
export const NIGHTLY = 'nightly'
export const SPECIAL_SETUP = 'special-setup'
export const EVIL_SETUP = 'evil-setup'
export const SPECIAL_NIGHTLY = 'special-nightly'
export const OTHER_CATEGORY = 'other-category'

export const NIGHTLY_WEREWOLVES = 'nightly-werewolves'

export const EVIL_COLOR = 'rgb(194, 5, 30)'
export const SETUP_COLOR = 'rgb(90, 138, 0)'
export const NIGHTLY_COLOR = 'rgb(88, 50, 255)'
export const MORNING_COLOR = 'rgb(200, 175, 50)'
export const SPECIAL_COLOR = '#444444'

const isWorthBalanceAcceptable = worthBalanceFloat => worthBalanceFloat >= 0 && worthBalanceFloat <= 0.75

export const STRIGOY = 'Strigoy'
export const EVIL = 'Any Evil'
export const NEGATIVE = 'Any Evil'
// Rule of thumb: 25% of players are Strigoy
export const evilsByPlayers = {
    0:  [[STRIGOY]],
    1:  [[STRIGOY]],
    2:  [[STRIGOY]],
    3:  [[STRIGOY]],
    4:  [[STRIGOY]],
    5:  [[STRIGOY]],
    6:  [[STRIGOY, NEGATIVE]],
    7:  [[STRIGOY, NEGATIVE]],

    8:  [[STRIGOY, STRIGOY]],
    9:  [[STRIGOY, STRIGOY]],
    10: [[STRIGOY, STRIGOY, NEGATIVE]],
    11: [[STRIGOY, STRIGOY, NEGATIVE]],

    12: [[STRIGOY, STRIGOY, STRIGOY]],
    13: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    14: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    15: [[STRIGOY, STRIGOY, STRIGOY, NEGATIVE, NEGATIVE]],

    16: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY]],
    17: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    18: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE]],
    19: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, NEGATIVE, NEGATIVE]],

    20: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY, STRIGOY]],
}

export const getRoles = () => {
    const roles = [
        {
            name: "Cultist",
            team: WEREWOLVES,
            worth: 0,
            category: REGULAR,
            difficulty: ALL_EVILS,
            effect: "On game start, you know 3 roles that are not in the game (<i>so you can pretend to be them</i>).",
            ribbonColor: SETUP_COLOR,
            ribbonText: 'SETUP'
        },
        {
            name: "Ghoul",
            isWerewolf: true,
            team: WEREWOLVES,
            worth: 0,
            category: NIGHTLY_WEREWOLVES,
            difficulty: ALL_EVILS,
            type: 'Nightly',
            effect: '<b>Hand Raise (once per game)</b>: No other Townsfolk can wake up right now.',
            notes: 'You raise your hand during the Townsfolk night phase.',
            ribbonColor: NIGHTLY_COLOR,
            ribbonText: 'HAND RAISE'
        },
        {
            name: "Strigoy",
            team: WEREWOLVES,
            isWerewolf: true,
            nPlayers: 0,                        // Minimum number of players in game to have this role
            worth: -1,                          // A heuristic for balancing
            category: NIGHTLY_WEREWOLVES,       // Categorization
            difficulty: ALL_EVILS,               // Role categories are split into difficulty categories
            isImportant: false,                 // The game must contain at least a number of important roles
            type: 'Nightly',
            effect: 'Once per game, during the Evil phase, raise your hand to kill a player. <i>(but not on first night</i>)',
            ribbonColor: SPECIAL_COLOR,
            ribbonText: 'EVIL PHASE'
        },
        {
            name: "Vampire",
            nPlayers: 0,
            team: WEREWOLVES,
            worth: 0,
            category: REGULAR,
            difficulty: ALL_EVILS,
            effect: "Once per game, during the Evil phase, you can make one more attack and Townsfolk can protect one more time.",
            notes: "The Storyteller must announce it. You can attack the same location, and the same location can be protected one more time.",
            ribbonColor: SPECIAL_COLOR,
            ribbonText: 'EVIL PHASE'
        },
        {
            name: "Nosferatu",
            isWerewolf: true,
            nPlayers: 10,
            team: WEREWOLVES,
            worth: -2,
            category: NIGHTLY_WEREWOLVES,
            difficulty: ALL_EVILS,
            type: 'Nightly',
            effect: 'Once per game, during the Evil phase, raise your hand and choose a player to instantly kill (<i>but not on first night</i>).',
            ribbonColor: SPECIAL_COLOR,
            ribbonText: 'EVIL PHASE'
        },
        {
            name: "Samca",
            isWerewolf: true,
            nPlayers: 10,
            team: WEREWOLVES,
            worth: -4.5,
            category: NIGHTLY_WEREWOLVES,
            difficulty: BROKEN,
            type: 'Nightly',
            effect: 'You are a Evil. On the first night, you know the color of the first card in each location',
        },
        {
            name: "Hazer",
            nPlayers: 11,
            team: WEREWOLVES,
            worth: -1.75,
            category: SPECIAL_NIGHTLY,
            difficulty: BROKEN,
            type: 'Special Nightly',
            effect: 'Every night and at game start, when Strigoys open eyes, point left or right! The closest alive Townsfolk in that direction gets wrong information, or their ability does nothing.',
            notes: 'You are part of the Strigoys team but not a Strigoy, and open your eyes on setup. Townsfolk win if all Strigoys are killed.',
            ribbonText: 'SE + NI'
        },
        {
            name: "Silencer",
            nPlayers: 12,
            team: WEREWOLVES,
            worth: -2,
            category: SPECIAL_NIGHTLY,
            difficulty: BROKEN,
            effect: 'Once per game, when Strigoys open eyes, raise your arm. ALL Townsfolk abilities have no effect until next night. Then you die.',
            notes: 'You never open your eyes. The narrator will show the Strigoys who you are.',
            narratorNotes: 'Pay attention to the Silencer\'s arm sign. When they raise their arm, announce that the Silencer silenced everyone, and nobody\'s role does anything until the start of next night.',
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Yaga (Priest)",
            nPlayers: 12,
            team: WEREWOLVES,
            worth: -3.5,
            category: NIGHTLY,
            difficulty: BROKEN,
            isSpecial: true,
            yagaRole: 'Priest',
            effect: 'You pretend to be a Priest. The narrator will say "Priest, wake up" as normal. There is no other Priest in this game.',
            notes: 'You don\'t actually have any powers. Just pretend you do.',
            narratorNotes: 'As the narrator, do say "Priest, wake up". Continue with the normal routine, but Yaga can\'t actually save anyone.',
            type: 'Nightly'
        },
        {
            name: "Yaga (Town Guard)",
            nPlayers: 12,
            team: WEREWOLVES,
            worth: -3.5,
            category: NIGHTLY,
            difficulty: BROKEN,
            isSpecial: true,
            yagaRole: 'Town Guard',
            effect: 'You pretend to be a Town Guard. The narrator will say "Town Guard, wake up" as normal. There is no other Town Guard in this game.',
            notes: 'You don\'t actually have any powers. Just pretend you do.',
            narratorNotes: 'As the narrator, do say "Town Guard, wake up". Continue with the normal routine, but Yaga can\'t actually protect anyone.',
            type: 'Nightly'
        },
        {
            name: "Little Villain",
            nPlayers: 0,
            team: WEREWOLVES,
            worth: -0.25,
            category: EVIL_SETUP,
            difficulty: ADVANCED,
            effect: "You are <b>Evil,</b> but you don't know who other Evils are.",
            notes: 'At game start, the narrator will point the Evils to you. You NEVER open your eyes.',
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Bitten",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 0,
            category: SPECIAL_NIGHTLY,
            difficulty: EXTRAS,
            effect: 'When the Strigoys open their eyes, make a ROCK sign with your hand. You become a Werewolf. You may open your eyes.',
            type: 'Nightly',
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Bell Ringer",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 1.25,
            category: REGULAR,
            difficulty: BROKEN,
            effect: 'Every morning, if you are alive, the people who just died at night can talk and vote today (their powers do not work).',
            notes: 'The narrator still announces who died this morning, but also announces Bell Ringer is in game. When night falls, they die immediately.',
            ribbonColor: MORNING_COLOR,
            ribbonText: 'MORNING'
        },
        {
            name: "Philosopher",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.25,
            category: SPECIAL_SETUP,
            difficulty: INTERMEDIATE,
            effect: 'When you get your role card, pick a different role from 3 unused options (could be a Strigoy)!',
            narratorNotes: 'Draw 3 role cards from the unused roles (randomly, or as you like) and let the Philosopher pick one. Make sure you change the Philosopher\'s role on the app.',
            ribbonText: '*SETUP',
            ribbonColor: SETUP_COLOR,
    
        },
        {
            name: "Fallen Angel",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: FOR_MODS,
            effect: "If you win (even if dead), secretly pick someone else to become the Fallen Angel next game. If you lose, you can pick your role next game.",
            notes: "You pick who becomes the Fallen Angel before roles are drawn."
        },
        {
            name: "Leper",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0.5,
            category: REGULAR,
            difficulty: BROKEN,
            effect: "If you are hanged or eaten, reveal your card. The next Night happens TWICE (in a row).",
        },
        {
            name: "Innkeeper",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0.75,
            category: SPECIAL_SETUP,
            difficulty: BROKEN,
            effect: "One Townsfolk is secretly drunk - they believe they are that role, but they're just a Peasant. Their ability has no effect or gets wrong information.",
            notes: "Only the narrator knows who the drunk is (unless you can figure it out...)",
            narratorNotes: "Do NOT announce if there is an Innkeeper in the game! Let players figure it out themselves."
        },
        {
            name: "Blind Inspector",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.5,
            category: SETUP,
            difficulty: ADVANCED,
            isImportant: true,
            effect: 'At game start, pick 2 players. For each, if its role contains letter "O", the narrator nods.',
            narratorNotes: 'The Blind Inspector opens their eyes. First, they point to one player, then you may nod. Then they point to another player, and you may nod again.',
            type: 'Setup',
            ribbonText: 'SETUP',
            ribbonColor: SETUP_COLOR,
        },
        {
            name: "Fortune Teller",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.75,
            category: NIGHTLY,
            difficulty: BEGINNER,
            isImportant: true,
            effect: '<b>Hand Raise:</b> Point at 2 players. The Storyteller nods if either of them is Evil.',
            type: 'Nightly',
            ribbonText: 'HAND RAISE',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Lover",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 0.5,
            category: SETUP,
            difficulty: BEGINNER,
            effect: 'At game start, grab a neighbor by hand. You become lovers. When one of you dies, the other dies too.',
            notes: 'The narrator will wake you up to grab someone by hand.',
            narratorNotes: 'If you have this role in game, make sure the players know that they may get grabbed by hand.',
            type: 'Special Setup'
        },
        {
            name: "Seer",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.5,
            category: SPECIAL_NIGHTLY,
            difficulty: BEGINNER,
            isImportant: true,
            effect: '<b>Hand Raise:</b> See color of the top card of a location.',
            notes: 'Wait for the narrator to tell you to open eyes.',
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Town Guard",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 2,
            category: NIGHTLY,
            difficulty: BEGINNER,
            isImportant: true,
            effect: 'Every night, wake up and pick a player (not yourself). They can\'t die this night. You can\'t pick the same player two nights in a row.',
            notes: 'If they would die, nothing happens.',
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Assassin",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.25,
            category: SPECIAL_NIGHTLY,
            difficulty: INTERMEDIATE,
            effect: 'Once per game, after Strigoys close eyes, raise your arm if you want to wake up.\nThen kill someone.',
            notes: 'Wait for the narrator to say "Assassin wake up."',
            narratorNotes: 'Watch out for the Assassin. If their arm is raised, say "Assassin, wake up".\nThey can only do this once per game.',
            type: 'Special Nightly'
        },
        {
            name: "Priest",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 2,
            category: NIGHTLY,
            difficulty: BROKEN,
            isImportant: true,
            effect: '<b>Hand Raise:</b> Resurrect a dead player.<br/><i>(Once per game)</i>',
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Schizophrenic",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0,
            category: SPECIAL_NIGHTLY,
            difficulty: DRUNKEN_TAVERN,
            effect: 'Every night, the narrator secretly rolls a die.\nIf they roll 6, you die.',
            notes: 'In the morning, you don\'t necessarily know how you died...',
            narratorNotes: 'Alternatively, instead of rolling a die, look at the time. If the minutes are divisible by 6, the Schizophrenic dies.',
            type: 'Special Nightly'
        },
        {
            name: "Butler",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0.75,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: 'You must always vote the same as the closest alive person to your right.',
            notes: 'If they don\'t vote, you don\'t vote'
        },
        {
            name: "Scout",
            team: TOWNSFOLK,
            difficulty: ROLES_NO_ONE_UNDERSTANDS,
            worth: 1.5,
            effect: "Every night, when Strigoys close eyes, point left or right (keep your eyes closed). If the closest alive player in that direction is Evil, you are eaten (instead of whoever the Strigoys chose).",
            category: SPECIAL_NIGHTLY,
            notes: "Make sure the narrator sees you pointing. Make it OBVIOUS. Make sure to stop once the narrator continues.",
            lineHeight: 28
        },
        {
            name: "Inquisitor",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 1.5,
            category: REGULAR,
            difficulty: ADVANCED,
            effect: 'Once per game, secretly ask the narrator a YES/NO question about one player. You secretly get a correct reply.',
            notes: 'You can go to the narrator and ask, message them on their phone, etc.'
        },
        {
            name: "Mayor",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.5,
            category: NIGHTLY,
            difficulty: INTERMEDIATE,
            effect: '<b>Hand Raise:</b> Learn which team the Storyteller believes is winning.',
        },
        {
            name: "Dove of Peace",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 0.5,
            category: REGULAR,
            difficulty: ADVANCED,
            effect: 'When you die, reveal your card. Nobody can be hanged the upcoming day.',
        },
        {
            name: "Witch Hunter",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.25,
            category: REGULAR,
            difficulty: BROKEN,
            effect: "Once per game, declare you're a Witch Hunter and publicly pick a player. If the letter 'S' is in their role name, they die immediately.",
            note: 'Note that other players can bluff as a Witch Hunter!'
        },
        {
            name: "Gangster",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.25,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: 'At any point in the game, reveal your card. From then on, you can veto any vote.',
            notes: "It won't matter what the vote is. Only your vote will matter."
        },
        {
            name: "Thief",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: INTERMEDIATE,
            effect: 'At any point in the game, reveal your card and pick another player. You each get a new random role.',
            notes: 'You could get a Strigoy! If an Evil player became a different role, they remain Evil.'
        },
        {
            name: "Crusader",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 0.75,
            category: REGULAR,
            difficulty: ADVANCED,
            effect: "If you are hanged, reveal your card.\nYou don't die.\nThe person who argued most to hang you dies instead.",
            notes: 'Up to the narrator who that person is.'
        },
        {
            name: "Scapegoat",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 2,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: "If at least 1 of your 2 neighbors is alive, you can't be eaten at night (nothing happens if you're eaten).",
            notes: "The night may pass with no one being eaten."
        },
        {
            name: "Sassy Neighbor",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: INTERMEDIATE,
            effect: "If you are hanged, reveal your card. The narrator publicly announces how many Evils are still in the game.",
            notes: "You do NOT reveal your card if you die elsehow!"
        },
        {
            name: "Wrestler",
            nPlayers: 8,
            team: TOWNSFOLK,
            worth: 2,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: "If there are 5 or more players in the game, you can't be eaten at night (nothing happens if you're eaten)",
            notes: "The night may pass with no one being eaten."
        },
        {
            name: "Cat",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.5,
            category: REGULAR,
            difficulty: BROKEN,
            effect: 'You have 2 lives (unless hanged). If you would die the first time, nothing happens.',
            notes: "You might not know you lost one life."
        },
        {
            name: "Bard",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.75,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: 'When you die, reveal your card. You come back to life with a new random role card.'
        },
        {
            name: "Archaeologist",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: FOR_MODS,
            effect: 'If you are alive, when one of your neighbors is hanged, gain 1 point.',
            notes: "Only immediate neighbors (max +2 points per game).",
            narratorNotes: 'Only add this role to the game if you play with Points.',
            ribbonColor: MORNING_COLOR,
            ribbonText: 'REMINDER'
        },
        {
            name: "Fool",
            nPlayers: 2,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: DRUNKEN_TAVERN,
            effect: "You are immune to other players' abilities and items. If they would get information about you, it might be wrong information.",
            notes: "You are immune to Evil abilities as well, but you may still be hanged or affected by cards.",
            ribbonColor: MORNING_COLOR,
            ribbonText: 'REMINDER'
        },
        {
            name: "Sad Poet",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1.5,
            category: REGULAR,
            difficulty: EXTRAS,
            effect: "In the morning, if someone died last night, you can reveal your card and die. That person comes back to life.",
            notes: "You choose who if multiple people died."
        },
        {
            name: "Saint",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 0.75,
            category: REGULAR_NEGATIVE,
            difficulty: DRUNKEN_TAVERN,
            effect: "If you are hanged, reveal your card. The Strigoys win immediately.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Star Child",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 2,
            category: REGULAR,
            difficulty: ROLES_NO_ONE_UNDERSTANDS,
            effect: 'If you are eaten at night, a random non-Strigoy Evil player also dies (if any was still alive).'
        },
        {
            name: "Hunter",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: BEGINNER,
            effect: "When you die, reveal your card and pick a player. That player also dies."
        },
        {
            name: "Exorcist",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0.75,
            category: REGULAR,
            difficulty: FOR_MODS,
            effect: "When you die, reveal your card. Choose 1 of 3 mods to add to the game.",
            notes: "The narrator picks 3 possible mods, and you choose one of them. You're still dead, sorry!"
        },
        {
            name: "Gravedigger",
            team: TOWNSFOLK,
            worth: 1.25,
            category: REGULAR,
            difficulty: BROKEN,
            effect: "When you die, reveal your card. You remain in the game as a ghost. After the next time you vote, you are out!",
            notes: "You are good. You can't be killed as a ghost. You still close your eyes at night."
        },
        {
            name: "Skinny Kid",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0.5,
            category: REGULAR_NEGATIVE,
            difficulty: BEGINNER,
            effect: "When you die, reveal your Role. Choose someone to <b>Reveal</b> a card from a location you choose.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Grandma",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: BEGINNER,
            effect: 'If you are eaten, you become a Strigoy. The narrator will announce that "Grandma was eaten and became a Strigoy".',
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        
        {
            name: "Alien",
            nPlayers: 0,
            team: OTHER,
            worth: 1,
            category: OTHER_CATEGORY,
            difficulty: DRUNKEN_TAVERN,
            effect: "You aren't on any team. You win if you die, but not by hanging. Then the game goes on."
        },
        {
            name: "Diva",
            nPlayers: 9,
            team: TOWNSFOLK,
            worth: 0.5,
            category: REGULAR_NEGATIVE,
            difficulty: CHAOS,
            effect: "If you would die at night, a random Townsfolk dies instead. If you are hanged, both you and another random Townsfolk die.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Hobo",
            nPlayers: 9,
            team: TOWNSFOLK,
            worth: 0.5,
            category: REGULAR_NEGATIVE,
            difficulty: ADVANCED,
            effect: "If you die, reveal your card. The next Night happens TWICE.",
            notes: "There will be 2 nights in a row, without everyone waking up in between."
        },
        {
            name: "Madman",
            nPlayers: 0,
            team: OTHER,
            worth: 1,
            category: OTHER_CATEGORY,
            difficulty: CHAOS,
            effect: "You aren't on any team. You win if you are hanged. Then the game goes on."
        },
    
        {
            name: "Peasant",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 1,
            difficulty: BEGINNER,
            category: REGULAR,
            effect: '',
            notes: 'There may be any number of Peasants in the game!'
        },
    
    ]
    return sortRolesNormal(roles)
}

export function getLocations() {
    const locations = [
        {
            name: 'Park',
            effect: ''
        },
        {
            name: 'Town Hall',
            effect: 'This game, a majority is not needed to hang someone - the person with most votes is hanged.'
        },
        {
            name: 'Church',
            effect: 'While intact, Peasants can\'t die.'
        },
        {
            name: 'Tower',
            effect: 'Cards here are face up.'
        },
        {
            name: 'Tavern',
            effect: 'Has only Yellow Cards, but at game start a random player becomes Drunk.'
        },
        {
            name: 'Fields',
            effect: 'Has only 2 cards and no Red card.'
        },
        {
            name: 'Marketplace',
            effect: 'Has twice as many cards. When attacked, 2 players must each Blow a card here.',
        },
        {
            name: 'Catacombs',
            effect: 'Cards here are ordered by color (Red is first).'
        },
        {
            name: 'Circus',
            effect: 'Cards Blown here go to a random player instead of who Blew it.'
        },
        {
            name: 'Library',
            effect: 'On game start, the Storyteller gives 2 pieces of information. One is false, one is true.'
        },
    ]
    return locations
}

export function getRolesByDifficulty(difficulty) {
    return getRoles().filter(role => role.difficulty <= difficulty)
}
export function getRolesForDifficulty(difficulty) {
    return getRoles().filter(role => role.difficulty == difficulty)
}
export function getTestRoles() {
    return getRoles().filter(role => randomOf(true, false)).map(role => ({
        ...role,
        isInGame: randomOf(true, false)
    }))
}
export function getAllRoleDifficulties() {
    const roles = getRoles()
    const foundDifficulties = []
    for (const role of roles) {
        if (foundDifficulties.includes(role.difficulty) == false) {
            foundDifficulties.push(role.difficulty)
        }
    }
    return foundDifficulties.sort()
}

export function printRolesByDifficulty() {
    const roles = getRoles()
    console.log({roles})
    console.log({rolesBEGINNER: roles.filter(role => role.difficulty == BEGINNER)})
    console.log({rolesINTERMEDIATE: roles.filter(role => role.difficulty == INTERMEDIATE)})
    console.log({rolesADVANCED: roles.filter(role => role.difficulty == ADVANCED)})
    console.log({rolesCOMPLETE: roles.filter(role => role.difficulty == COMPLETE)})
}
// printRolesByDifficulty()

export function sortRolesNormal(roles) {
    const rolePriorityByTypeOrName = [
        WEREWOLVES,
        REGULAR_NEGATIVE,
        EVIL_SETUP,
        SPECIAL_SETUP,
        SETUP,
        'Bell Ringer',
        'Archaeologist',
        NIGHTLY,
        SPECIAL_NIGHTLY,
        REGULAR,
        OTHER_CATEGORY
    ]
    const rolesByCategory = groupArrayBy(roles, role => role.category)
    function sortArrayByWorthDescending(arr) {
        const getWorth = elem => elem.worth != null? elem.worth: 1
        return arr.sort((a,b) => getWorth(a) - getWorth(b))
    }
    
    const rolesAlphabetically = [...roles].sort((a, b) => a.name.localeCompare(b.name))
    const rolesAndByWorth = sortArrayByWorthDescending([...rolesAlphabetically])
    const getRolePriority = role => 
    rolePriorityByTypeOrName.indexOf(role.name) != -1?
        rolePriorityByTypeOrName.indexOf(role.name):
    rolePriorityByTypeOrName.indexOf(role.team) != -1?
        rolePriorityByTypeOrName.indexOf(role.team):
    rolePriorityByTypeOrName.indexOf(role.category) != -1?
        rolePriorityByTypeOrName.indexOf(role.category):
        9999
    if (browser) {
        window.getRolePriority = getRolePriority
    }
    const rolesAndByCategory = [...rolesAndByWorth].sort((a, b) => getRolePriority(a) - getRolePriority(b))

    return rolesAndByCategory
}

export const NO_PRIORITY = 99
const setupOrder = [
    'Innkeeper',
    'Philosopher',
    'Exorcist',

    'Bell Ringer',

    'Lover',
    'Mora',
    'Strigoy',
    'Cultist',
    'Hazer',
    'Silencer',
    'Yaga (Priest)',
    'Yaga (Town Guard)',
    'Little Villain',

    'Blind Inspector'
]
export function getSetupRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    if (roleName == 'Rival A' || roleName == 'Rival B') {
        roleName = 'Rival'
    }
    const index = setupOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}
const normalOrder = [
    'Strigoy',
    'Mora',
    'Cultist',
    'Hazer',
    'Little Villain',
    'Silencer',
    'Yaga (Priest)',
    'Yaga (Town Guard)',
    'Grandma',
    'Skinny Kid',
    'Diva',

    'Alien',
    'Madman',

    'Blind Inspector',
    'Innkeeper',
    'Lover',
    'Philosopher',
    'Schizophrenic',

    'Fortune Teller',
    'Assassin',
    'Bitten',
    'Priest',
    'Scout',
    'Seer',
    'Town Guard',

    'Peasant'
]
export function getNormalRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    const index = normalOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

const nightlyOrder = [
    'Strigoy',
    'Secondary Strigoy',
    'Assassin',
    'Bitten',
    'Bell Ringer',
    'Archaeologist',
    'Town Guard',
    'Yaga (Town Guard)',
    'Seer',
    'Schizophrenic',
    'Priest',
    'Yaga (Priest)',
]
export function getNightlyRolePriority(roleOrRoleName) {
    if (roleOrRoleName == null) {
        return NO_PRIORITY
    }
    let roleName = roleOrRoleName.name != null? roleOrRoleName.name : roleOrRoleName
    if (roleName == 'Mora') {
        roleName = 'Strigoy'
    }
    if (roleName == 'Hazer' || roleName == 'Silencer') {
        roleName = 'Secondary Strigoy'
    }
    const index = nightlyOrder.indexOf(roleName)
    if (index == -1) {
        return NO_PRIORITY
    }
    return index
}

export function getSortRolesWithPriorityFunction(roles, getRolePriority) {
    console.log('SORTING')

    const rolesSortedByPrio = roles.sort((a, b) => getRolePriority(a) - getRolePriority(b))
    const rolesWithPrio = rolesSortedByPrio.filter(role => getRolePriority(role) != NO_PRIORITY)
    const rolesWithoutPrio = rolesSortedByPrio.filter(role => getRolePriority(role) == NO_PRIORITY)
    const rolesWithoutPrioSorted = rolesWithoutPrio.sort((a, b) => a.name.localeCompare(b.name))

    return [...rolesWithPrio, ...rolesWithoutPrioSorted]
}



export function getRole(name) {
    return getRoles().find(role => role.name == name)
}


export function setupRoles(nPlayers, difficulty) {
    const baseGoodRoles = getRoles().filter(role => role.difficulty <= difficulty && role.team != WEREWOLVES)
    while (baseGoodRoles.length < nPlayers) {   // Pad with Peasants
        baseGoodRoles.push(getRole('Peasant'))
    }
    times(10, () => {
        baseGoodRoles.push(getRole('Peasant'))       // Add 3 extra Peasants
    })

    const goodRoles = randomizeArray(baseGoodRoles) 
    const evilRoles = randomizeArray(getRoles().filter(role => role.difficulty <= difficulty && role.team == WEREWOLVES && role.isWerewolf != true))

    const rolesSoFar = []

    // First, correctly add enough werewolves and evil roles, judging by the evilsByPlayers table
    const evilsThisGame = randomOf(...evilsByPlayers[nPlayers])
    const nWerewolvesThisGame = evilsThisGame.filter(roleName => roleName == STRIGOY).length
    const nNonWerewolfEvilsThisGame = evilsThisGame.length - nWerewolvesThisGame
    while (evilRoles.length < nNonWerewolfEvilsThisGame) {
        evilRoles.push(getRole('Cultist'))
    }
    
    times(nWerewolvesThisGame, () => {
        rolesSoFar.push(getRole('Strigoy'))
    })
    times(nNonWerewolfEvilsThisGame, () => {
        rolesSoFar.push(evilRoles.pop())
    })
    
    // Fix yaga
    const getWorthBalanceSoFar = () => sum(rolesSoFar.map(role => role.worth))
    const yaga = rolesSoFar.find(role => role.name.includes('Yaga'))
    const isYagaInGame = yaga != null
    if (isYagaInGame) {
        popArrayElementFind(baseGoodRoles, role => role.name == yaga.yagaRole)
    }


    // Second, add townsfolk
    while (rolesSoFar.length < nPlayers) {
        rolesSoFar.push(goodRoles.pop())
    }

    // Third, balance it
    let nIterations = 0
    function popTownsfolkMatchingCondition(conditionRoleToBool) {
        const townsfolksMatching = rolesSoFar.filter(role => role.team != WEREWOLVES && conditionRoleToBool(role))
        if (townsfolksMatching.length == 0)
            return null
        const chosenTownsfolk = randomOf(...townsfolksMatching)
        return popArrayElementFind(rolesSoFar, role => role.name == chosenTownsfolk.name)
    }
    function moveGoodTownsfolkMatchingConditionToRolesSoFar(conditionRoleToBool) {
        const unusedTownsfolks = goodRoles.filter(conditionRoleToBool)
        if (unusedTownsfolks.length == 0)
            return null
        const chosenNewTownsfolk = randomOf(...unusedTownsfolks)
        const roleFound = popArrayElementFind(goodRoles, role => role.name == chosenNewTownsfolk.name)
        rolesSoFar.push(chosenNewTownsfolk)
        return roleFound
    }
    function replaceWeakTownsfolkWithStronger() {
        let removedTownsfolk = popTownsfolkMatchingCondition(role => role.name == 'Peasant')
        if (removedTownsfolk == null) {
            removedTownsfolk = popTownsfolkMatchingCondition(role => role.worth <= 1)
        }
        if (removedTownsfolk == null)
            removedTownsfolk = popTownsfolkMatchingCondition(role => true)  // Pop any townsfolk
        const pushedTownsfolk = moveGoodTownsfolkMatchingConditionToRolesSoFar(role => role.worth >= removedTownsfolk.worth)
        if (pushedTownsfolk == null) {
            rolesSoFar.push(removedTownsfolk)   // Put it back
        } else {
        }
    }
    function replaceStrongTownsfolkWithWeaker() {
        let removedTownsfolk = popTownsfolkMatchingCondition(role => role.worth >= 1)
        if (removedTownsfolk == null)
            removedTownsfolk = popTownsfolkMatchingCondition(role => true)  // Pop any townsfolk
        const pushedTownsfolk = moveGoodTownsfolkMatchingConditionToRolesSoFar(role => role.worth <= removedTownsfolk.worth)
        if (pushedTownsfolk == null) {
            rolesSoFar.push(removedTownsfolk)   // Put it back
        } else {

        }
    }
    
    const maxIterations = 20
    while (!isWorthBalanceAcceptable(getWorthBalanceSoFar()) && nIterations < maxIterations) {
        const areTownsfolkTooWeak = getWorthBalanceSoFar() < 0
        if (areTownsfolkTooWeak) {
            replaceWeakTownsfolkWithStronger()
        } else {
            replaceStrongTownsfolkWithWeaker()
        }
        randomizeArray(rolesSoFar)
        nIterations++
    }
    
    console.log(`For ${nPlayers} people, difficulty ${difficulty}, worth balance is: ${getWorthBalanceSoFar()} (did ${nIterations} iterations)`)
    console.log(rolesSoFar)

    // Fourth, rectifications
    const minimumAcceptableImportantRoles = Math.floor(nPlayers / 7)
    const importantRolesSoFar = rolesSoFar.filter(role => role.isImportant)
    if (importantRolesSoFar.length < minimumAcceptableImportantRoles) {
        return setupRoles(nPlayers, difficulty)
    }

    return rolesSoFar
}


/*
    ---- UPDATED ROLES ------ 
- Skinny Kid
- Bell Ringer
- Thief
- Archaeologist
- Saint ("if you are hanged" instead of "if you die at day")
- Silencer ("Then you die...")
- Cultist (has notes)
- Mora (has notes)
- Lover (simplified)
- (NEW) Exorcist
- (NEW) Gravedigger

- (NEW) Gun 

*/