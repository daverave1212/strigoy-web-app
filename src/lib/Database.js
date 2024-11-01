import { arrayFindHighest, arrayFindIndexLowest, arrayFindLowest, percentChance, popArrayElementAt, popArrayElementFind, randomOf, randomizeArray, sum, times } from "./utils"

export const WEREWOLVES = 'werewolves'
export const TOWNSFOLK = 'townsfolk'
export const OTHER = 'other'

export const BEGINNER = 1
export const INTERMEDIATE = 2
export const ADVANCED = 3
export const COMPLETE = 4
export const BROKEN = 1337

export const REGULAR = 'regular'
export const SETUP = 'setup'
export const NIGHTLY = 'nightly'
export const SPECIAL_SETUP = 'special-setup'
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
const evilsByPlayersOLD = {
    2:  [[STRIGOY]],
    3:  [[STRIGOY]],
    4:  [[STRIGOY]],
    5:  [[STRIGOY]],
    6:  [[STRIGOY, EVIL]],
    7:  [[STRIGOY, EVIL]],
    8:  [[STRIGOY, EVIL]],
    9:  [[STRIGOY, EVIL, EVIL]],                               // Too negative
    10: [[STRIGOY, STRIGOY],  [STRIGOY, EVIL, EVIL]],        // Fine
    11: [[STRIGOY, STRIGOY, EVIL], [STRIGOY, EVIL, EVIL]],   // Way too negative?
    12: [[STRIGOY, STRIGOY, EVIL], [STRIGOY, EVIL, EVIL]],
    13: [[STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, EVIL, EVIL, EVIL]],
    14: [[STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, STRIGOY, STRIGOY]],
    15: [[STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, STRIGOY, STRIGOY]],
    16: [[STRIGOY, STRIGOY, STRIGOY, EVIL], [STRIGOY, STRIGOY, EVIL, EVIL]],
    17: [[STRIGOY, STRIGOY, STRIGOY, EVIL]],
    18: [[STRIGOY, STRIGOY, STRIGOY, EVIL, EVIL], [STRIGOY, STRIGOY, EVIL, EVIL, EVIL], [STRIGOY, EVIL, EVIL, EVIL, EVIL]],
    19: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY], [STRIGOY, STRIGOY, STRIGOY, EVIL, EVIL, EVIL]],
    20: [[STRIGOY, STRIGOY, STRIGOY, STRIGOY], [STRIGOY, STRIGOY, STRIGOY, EVIL, EVIL, EVIL]],
}
// Rule of thumb: 25% of players are Strigoy
const evilsByPlayers = {
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

export const getRoles = () => [
    {
        name: "Mora",
        isWerewolf: true,
        nPlayers: 10,
        team: WEREWOLVES,
        worth: -5,
        category: NIGHTLY_WEREWOLVES,
        difficulty: COMPLETE,
        type: 'Nightly',
        effect: 'You are a Strigoy. When you die, reveal your card.'
    },
    {
        name: "Strigoy",
        team: WEREWOLVES,
        isWerewolf: true,
        nPlayers: 0,                        // Minimum number of players in game to have this role
        worth: -4.5,                        // A heuristic for balancing
        category: NIGHTLY_WEREWOLVES,       // Categorization
        difficulty: BEGINNER,               // Role categories are split into difficulty categories
        isImportant: false,                 // The game must contain at least a number of important roles
        type: 'Nightly',
        effect: 'Every night, wake up. All Strigoy, together, choose someone to kill.',
        notes: 'On game start, all Strigoys wake up, and the narrator points to other Evils.',
        narratorNotes: 'At game start, all Strigoys open their eyes. The narrator points to the other Evil players (if any).\nNobody is killed at game start. Strigoys will begin killing on first night.'
    },
    {
        name: "Cultist",
        nPlayers: 0,
        team: WEREWOLVES,
        worth: -1.5,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "You are Evil, without any special power. You do not open eyes every night (except at game start).",
    },
    {
        name: "Hazer",
        nPlayers: 11,
        team: WEREWOLVES,
        worth: -1.75,
        category: SPECIAL_NIGHTLY,
        difficulty: COMPLETE,
        type: 'Special Nightly',
        effect: 'Every night and at game start, when Strigoys open eyes, point left or right! The closest alive Townsfolk in that direction gets wrong information, or their ability does nothing.',
        // lineHeight: 29,
        ribbonText: 'SE + NI'
    },
    {
        name: "Silencer",
        nPlayers: 12,
        team: WEREWOLVES,
        worth: -2,
        category: SPECIAL_NIGHTLY,
        difficulty: COMPLETE,
        effect: 'Once per game, when Strigoys open eyes, raise your arm. ALL Townsfolk abilities have no effect until next night. Narrator announces that "everyone is silenced".',
        narratorNotes: 'Pay attention to the Silencer\'s arm sign. When they raise their arm, announce that the Silencer silenced everyone, and nobody\'s role does anything until the start of next night.',
    },
    {
        name: "Yaga (Priest)",
        nPlayers: 12,
        team: WEREWOLVES,
        worth: -3.5,
        category: NIGHTLY,
        difficulty: ADVANCED,
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
        difficulty: ADVANCED,
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
        category: REGULAR,
        difficulty: INTERMEDIATE,
        effect: "You are Evil, but you don't know who other Evils are.",
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
        difficulty: COMPLETE,
        effect: 'When the Strigoys open their eyes, make a ROCK sign with your hand. You become a Werewolf. You may open your eyes.',
        type: 'Nightly'
    },
    {
        name: "Bell Ringer",
        nPlayers: 12,
        team: TOWNSFOLK,
        worth: 1.25,
        category: REGULAR,
        difficulty: ADVANCED,
        effect: 'Every morning, if you are alive, the people who just died at night can talk and vote today (their powers do not work).',
        notes: 'The narrator announces this every morning. When night falls, they die immediately.',
        ribbonColor: MORNING_COLOR,
        ribbonText: 'MORNING'
    },
    {
        name: "Philosopher",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1,
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
        difficulty: COMPLETE,
        effect: "When you die, reveal your card and flip a coin. On HEADS, a random Townsfolk is revived. On TAILS, a random Townsfolk dies.",
    },
    {
        name: "Leper",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 0.5,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "If you are hanged or eaten, reveal your card. The next Night happens TWICE (in a row).",
    },
    {
        name: "Innkeeper",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 0.75,
        category: SPECIAL_SETUP,
        difficulty: ADVANCED,
        effect: "One Townsfolk is secretly drunk - they believe they are that role, but they're just a Peasant. Their ability has no effect or gets wrong information.",
        notes: "Only the narrator knows who the drunk is (unless you can figure it out...)"
    },
    {
        name: "Blind Inspector",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.5,
        category: SETUP,
        difficulty: COMPLETE,
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
        category: SETUP,
        difficulty: COMPLETE,
        isImportant: true,
        effect: 'At game start, the narrator points at 3 players. At least one of them is Evil.',
        narratorNotes: 'The Fortune Teller opens their eyes.',
        type: 'Setup',
        ribbonText: 'SETUP',
        ribbonColor: SETUP_COLOR,
    },
    {
        name: "Lover",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 0.5,
        category: SPECIAL_SETUP,
        difficulty: ADVANCED,
        effect: 'At game start (when everyone closes eyes), grab somone by hand. You become lovers. When one of you dies, the other dies too.',
        notes: 'Make sure you let go of their hand when Strigoys open eyes!',
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
        effect: 'Every night, if nobody was hung last day, wake up.\nChoose a player. The narrator nods if they are a Strigoy.',
        notes: 'Wait for the narrator to tell you to open eyes.',
        type: 'Nightly',
        ribbonText: 'NIGHT',
        ribbonColor: NIGHTLY_COLOR,
    },
    {
        name: "Town Guard",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.5,
        category: NIGHTLY,
        difficulty: ADVANCED,
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
        difficulty: BEGINNER,
        effect: 'Once per game, after Strigoys close eyes, raise your arm if you want to wake up.\nThen kill someone.',
        notes: 'Wait for the narrator to say "Assassin wake up."',
        narratorNotes: 'Watch out for the Assassin. If their arm is raised, say "Assassin, wake up".\nThey can only do this once per game.',
        type: 'Special Nightly'
    },
    {
        name: "Priest",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.75,
        category: NIGHTLY,
        difficulty: BEGINNER,
        isImportant: true,
        effect: 'Every night, wake up. You know who died. Once per game, you can revive one player who just died (except yourself).',
        type: 'Nightly',
        ribbonText: 'NIGHT',
        ribbonColor: NIGHTLY_COLOR,
    },
    {
        name: "Schizophrenic",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 0.75,
        category: SPECIAL_NIGHTLY,
        difficulty: COMPLETE,
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
        difficulty: COMPLETE,
        effect: 'You must always vote the same as the closest alive person to your right.',
        notes: 'If they don\'t vote, you don\'t vote'
    },
    {
        name: "Scout",
        team: TOWNSFOLK,
        difficulty: BROKEN,
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
        difficulty: COMPLETE,
        effect: 'Once per game, secretly ask the narrator a YES/NO question about one player. You secretly get a correct reply.',
        notes: 'You can go to the narrator and ask, message them on their phone, etc.'
    },
    {
        name: "Mayor",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 1.5,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: 'At any point, reveal your card. From then on, your vote counts as 3 votes.',
    },
    {
        name: "Dove of Peace",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 0.5,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: 'When you die, reveal your card. Nobody can be hanged the upcoming day.',
    },
    {
        name: "Witch Hunter",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 1,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "Once per game, declare you're a Witch Hunter and publicly pick a player. If the letter 'S' is in their role name, they die immediately.",
        note: 'Note that other players can bluff as a Witch Hunter!'
    },
    {
        name: "Gangster",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.25,
        category: REGULAR,
        difficulty: COMPLETE,
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
        notes: 'The narrator gives you the role. It could be a Strigoy!'
    },
    {
        name: "Crusader",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 0.75,
        category: REGULAR,
        difficulty: INTERMEDIATE,
        effect: "If you are hanged, reveal your card.\nYou don't die.\nThe person who argued most to hang you dies instead.",
        notes: 'Up to the narrator who that person is.'
    },
    {
        name: "Scapegoat",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 2,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "If at least 1 of your 2 neighbors is alive, you can't be eaten at night (nothing happens if you're eaten).",
        notes: "The night may pass with no one being eaten."
    },
    {
        name: "Sassy Neighbor",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 1,
        category: REGULAR,
        difficulty: ADVANCED,
        effect: "If you are hanged, reveal your card. The narrator publicly announces how many Evils are still in the game.",
        notes: "You do NOT reveal your card if you die elsehow!"
    },
    {
        name: "Wrestler",
        nPlayers: 8,
        team: TOWNSFOLK,
        worth: 2,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "If there are 5 or more players in the game, you can't be eaten at night (nothing happens if you're eaten)",
        notes: "The night may pass with no one being eaten."
    },
    {
        name: "Cat",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 1.75,
        category: REGULAR,
        difficulty: BEGINNER,
        effect: 'You have 2 lives. If you die, you come back to life in the morning. You might not know it happened.',
        notes: "The narrator might announce 'nobody died' or 'you are back in the game'."
    },
    {
        name: "Bard",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 1.75,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: 'When you die, reveal your card. You come back to life with a new random role card.'
    },
    {
        name: "Archaeologist",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: 'If you win and you are alive, all alive Townsfolk get 50% more points (if playing with points).',
        notes: 'Rounded down. If not playing with points, you\'re just a peasant.'
    },
    {
        name: "Fool",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 0.75,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "You are immune to other Townsfolks' abilities. If they would get information about you, it might be wrong information.",
        notes: "You can still be hanged or eaten."
    },
    {
        name: "Sad Poet",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "In the morning, if someone died last night, you can reveal your card and die. That person comes back to life.",
        notes: "You choose who if multiple people died."
    },
    {
        name: "Saint",
        nPlayers: 10,
        team: TOWNSFOLK,
        worth: 0.75,
        category: REGULAR,
        difficulty: ADVANCED,
        effect: "If you are killed at DAY, reveal your card. The Strigoys win immediately."
    },
    {
        name: "Star Child",
        nPlayers: 12,
        team: TOWNSFOLK,
        worth: 2,
        category: REGULAR,
        difficulty: ADVANCED,
        effect: 'If you are eaten at night, a random non-Strigoy Evil player also dies (if any was still alive).',
        ribbonColor: EVIL_COLOR,
        ribbonText: 'NEGATIVE'
    },
    {
        name: "Hunter",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.25,
        category: REGULAR,
        difficulty: BEGINNER,
        effect: "When you die, reveal your card and pick a player. That player also dies."
    },
    {
        name: "Graveyard Keeper",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 1.35,
        category: REGULAR,
        difficulty: BROKEN,
        effect: "When you die, publicly choose another player. If they are not a Strigoy, they are revived.",
        notes: 'You do NOT reveal your card.'
    },
    {
        name: "Skinny Kid",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: 0.5,
        category: REGULAR,
        difficulty: BEGINNER,
        effect: "If you are killed at night, reveal your card. Next night, the Strigoys kill 2 players.",
        ribbonColor: EVIL_COLOR,
        ribbonText: 'NEGATIVE'
    },
    {
        name: "Grandma",
        nPlayers: 0,
        team: TOWNSFOLK,
        worth: -1,
        category: REGULAR,
        difficulty: BEGINNER,
        effect: 'If you are eaten, you become a Strigoy. The narrator will announce that "Grandma was eaten and became a Strigoy".',
        ribbonColor: EVIL_COLOR,
        ribbonText: 'NEGATIVE'
    },
    
    {
        name: "Alien",
        nPlayers: 0,
        team: OTHER,
        worth: 0.5,
        category: OTHER_CATEGORY,
        difficulty: COMPLETE,
        effect: "You aren't on any team. You win if you are eaten. Then the game goes on."
    },
    {
        name: "Diva",
        nPlayers: 9,
        team: TOWNSFOLK,
        worth: 0.75,
        category: REGULAR,
        difficulty: COMPLETE,
        effect: "If you would die at night, a random Townsfolk dies instead. If you are hanged, both you and another random Townsfolk die.",
        ribbonColor: EVIL_COLOR,
        ribbonText: 'NEGATIVE'
    },
    {
        name: "Hobo",
        nPlayers: 9,
        team: TOWNSFOLK,
        worth: 0.5,
        category: REGULAR,
        difficulty: INTERMEDIATE,
        effect: "If you die, reveal your card. The next Night happens TWICE.",
        notes: "There will be 2 nights in a row, without everyone waking up in between."
    },
    {
        name: "Madman",
        nPlayers: 0,
        team: OTHER,
        worth: 0.5,
        category: OTHER_CATEGORY,
        difficulty: INTERMEDIATE,
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

export function printRolesByDifficulty() {
    const roles = getRoles()
    console.log({roles})
    console.log({rolesBEGINNER: roles.filter(role => role.difficulty == BEGINNER)})
    console.log({rolesINTERMEDIATE: roles.filter(role => role.difficulty == INTERMEDIATE)})
    console.log({rolesADVANCED: roles.filter(role => role.difficulty == ADVANCED)})
    console.log({rolesCOMPLETE: roles.filter(role => role.difficulty == COMPLETE)})
}
// printRolesByDifficulty()

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

    'Blind Inspector',
    'Fortune Teller'
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
    'Fortune Teller',
    'Innkeeper',
    'Lover',
    'Philosopher',
    'Schizophrenic',

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
    'Town Guard',
    'Yaga (Town Guard)',
    'Seer',
    'Schizophrenic',
    'Priest',
    'Yaga (Priest)',
    'Bell Ringer'
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


*/