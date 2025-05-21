import { arrayFindHighest, arrayFindIndexLowest, arrayFindLowest, groupArrayBy, percentChance, popArrayElementAt, popArrayElementFind, randomOf, randomizeArray, sum, times } from "./utils"
import { browser } from '$app/environment'

export const WEREWOLVES = 'werewolves'
export const TOWNSFOLK = 'townsfolk'
export const OTHER = 'other'

export const ALL_EVILS = 0
export const BEGINNER = 1
export const SPICE = 1.5
export const TOWN_CENTER = 1.75
export const INTERMEDIATE = 2
export const TRADESFOLK = 2.15
export const CHURCH = 2.25
export const ZEALOTS = 2.30
export const CHAOS = 2.45
export const NIGHT_AGENTS = 2.75
export const DRUNKEN_TAVERN = 3.5
export const MORE_CHAOS = 3.75
export const LOTS_OF_PLAYERS = 4
export const FOR_MODS = 5
export const ROLES_NO_ONE_UNDERSTANDS = 6
export const EXTRAS = 7
export const COMPLETE = 8
export const ADVANCED = 9
export const BROKEN = 99

export const difficultyNames = {
    [ALL_EVILS]: 'Evils',
    [BEGINNER]: 'Base Roles',
    [SPICE]: 'Extra Spice',
    [INTERMEDIATE]: 'Intermediate',
    [CHURCH]: 'Churchmen & Law',
    [ZEALOTS]: 'WITCH BURNERS',
    [TOWN_CENTER]: 'Town\'s Personalities',
    [TRADESFOLK]: 'Short Tradespeople', // TODO: Probably add Bombmaer and Builder to the base game, make the Red Riding Hood a different category lol
    [ADVANCED]: 'Advanced & Complex',
    [DRUNKEN_TAVERN]: 'Drunken Tavern',
    [FOR_MODS]: 'Mods & Points',
    [ROLES_NO_ONE_UNDERSTANDS]: 'Roles You Should Not Use',
    [EXTRAS]: 'Extra Roles',
    [COMPLETE]: 'Complete',
    [BROKEN]: 'Broken',
    [CHAOS]: 'Chaos',
    [NIGHT_AGENTS]: 'Dark Nights',
    [MORE_CHAOS]: 'More Chaos',
}
export const difficultyDescriptions = {
    [ALL_EVILS]: 'These are all the Evils in the game. Not all may be used in the game you are playing. For example, Vampires are only used for 7 or 8 players.',
    [BEGINNER]: 'Use these roles for the base game. The app will help you keep the game running with tips!',
    [SPICE]: 'Add these simple roles to the game for extra spice!',
    [CHURCH]: 'Balanced, easy to understand roles to make the game more intriguing! Who will be who?',
    [ZEALOTS]: 'More balanced, easy to understand roles that are ready to make the Evils BURN!',
    [TOWN_CENTER]: "Important roles! Highly recommended to play with.",
    [TRADESFOLK]: "Roles that affect Locations, and more.",
    [INTERMEDIATE]: 'Extra roles to add to make it more interesting. Every game, there should NOT be both a Town Guard and a Priest (unless there are more than 15 players). You don\'t have to play with all of them. Only choose which roles you like to play with.',
    [CHAOS]: 'Roles that add more randomnes and crazyness in the game. Everyone will go mad!',
    [NIGHT_AGENTS]: 'Agents of the night that speed the game up considerably!',
    [ADVANCED]: 'Roles for advanced players who know the game and want more challenge. Beware: having these roles in the game will make it more difficult to narrate!',
    [DRUNKEN_TAVERN]: 'Roles to mess with people\'s minds! Be careful with these -- explain the roles properly if you want to play with them. Otherwise, players may not understand what is happening.',
    [FOR_MODS]: 'Roles that are only in the game if you play with Mods or with points.',
    [ROLES_NO_ONE_UNDERSTANDS]: "Nobody will understand what these roles do. Seriously, don't even bother. Only use these if you are an omniscient AI.",
    [EXTRAS]: "Want EVEN MORE roles? Here you go! These roles aren't particularly difficult or strange, but feel more like 'extras sauce'. All optional, maybe you will like them!",
    [COMPLETE]: 'Complete',
    [BROKEN]: 'These roles are literally broken and you should not use them. Their abilities make no sense.',
    [MORE_CHAOS]: 'If you like the Chaos roles and want more, this is exactly what you are looking for!',
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
export const PINK_COLOR = '#CC55AA'
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
            name: "Little Villain",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: -2,
            category: EVIL_SETUP,
            difficulty: NIGHT_AGENTS,
            effect: "You win if the Evils win. You don't know who the Evils are. Evils know who you are.",
            notes: 'At game start, the narrator will point the Evils to you. You NEVER open your eyes.',
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Werewolf",
            team: TOWNSFOLK,
            worth: 1,
            category: SPECIAL_NIGHTLY,
            difficulty: NIGHT_AGENTS,
            effect: "You can't die at night.<br/>If suspected of being a Werewolf, you die immediately.",
            notes: "If players check everyone of being a Werewolf or try to cheat suspicion, it doesn't work! Apply common sense.",
            deathReminder: "Remember the Werewolf can't be killed at night.",
            ribbonColor: MORNING_COLOR,
            ribbonText: 'REMINDER'
        },
        {
            name: "Cat",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: BEGINNER,
            effect: 'You have 2 lives. If you would die the first time, nothing happens.',
            notes: "You might not know you lost one life.",
            deathReminder: "Was it the cat's last life?"
        },
        {
            name: "Blacksmith",
            team: TOWNSFOLK,
            worth: 2,
            category: REGULAR,
            difficulty: TOWN_CENTER,
            effect: "While you're holding an <b>Item</b>, your neighbors can't die at night.",
            notes: "You might not know you lost one life.",
            ribbonText: "REMINDER",
            ribbonColor: MORNING_COLOR
        },
        {
            name: "Town Guard",
            team: TOWNSFOLK,
            worth: 1,
            category: NIGHTLY,
            difficulty: BEGINNER,
            effect: "<b>Hand Raise:</b> Choose another player to protect. While you're alive, they can't die at night.",
            notes: "Using this ability again changes your protectee.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Priest",
            team: TOWNSFOLK,
            worth: 1,
            category: NIGHTLY,
            difficulty: CHURCH,
            effect: "<b>Hand Raise:</b> Choose a dead player to resurrect. Then you die.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Assassin",
            team: TOWNSFOLK,
            worth: 0,
            category: NIGHTLY,
            difficulty: NIGHT_AGENTS,
            effect: "<b>Hand Raise:</b> Choose a player to instantly kill.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Seer",
            team: TOWNSFOLK,
            worth: 0,
            category: NIGHTLY,
            difficulty: BEGINNER,
            effect: "<b>Hand Raise:</b> Choose a Location. The Storyteller tells you the color of its top card.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Fortune Teller",
            team: TOWNSFOLK,
            worth: 1,
            category: NIGHTLY,
            difficulty: BEGINNER,
            effect: "<b>Hand Raise:</b> Choose 2 players. The Storyteller shows YES if exactly one of them is Evil.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Politician",
            team: TOWNSFOLK,
            worth: 0,
            category: NIGHTLY,
            difficulty: ZEALOTS,
            effect: "<b>Hand Raise:</b> Choose a player. The Storyteller shows YES if they are a Peasant.",
            notes: "They could be alive or dead.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Inspector",
            team: TOWNSFOLK,
            worth: 1,
            category: NIGHTLY,
            difficulty: SPICE,
            effect: "<b>Hand Raise:</b> Learn how many people away from you is the closest Evil.<br/><i>This has a margin of error of 1.</i>",
            notes: "E.g. your neighbors are 1 person away, but with a margin of error of 1, the Storyteller may say 2. Dead players count.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Scout",
            team: TOWNSFOLK,
            worth: 1,
            category: NIGHTLY,
            difficulty: BEGINNER,
            effect: "<b>Hand Raise:</b> Learn one Location the Evils did NOT just attack.",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Mime",
            team: TOWNSFOLK,
            worth: 0,
            category: NIGHTLY,
            difficulty: MORE_CHAOS,
            effect: "<b>Hand Raise:</b> Choose a player. Copy their ability right now (or until next night).",
            notes: "If you don't know their ability, tough luck! Guess!",
            type: 'Nightly',
            ribbonText: 'NIGHT',
            ribbonColor: NIGHTLY_COLOR,
        },
        {
            name: "Skinny Kid",
            team: TOWNSFOLK,
            worth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: BEGINNER,
            effect: "When you die, reveal your Role card.<br/>The Evils will kill an extra player next night.",
            deathReminder: "Next night, Evils will kill an extra player.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Great Grandfather",
            team: TOWNSFOLK,
            worth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: BEGINNER,
            effect: "When you die, reveal your Role card.<br/>Choose someone to get a new Yellow card",
            deathReminder: "Great Grandfather gives someone a new Yellow Card.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Grandma",
            team: TOWNSFOLK,
            worth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: TOWN_CENTER,
            effect: "When you die, an Evil's ability is secretly refreshed (do NOT reveal your Role card).",
            notes: "The Storyteller will let the Evil know their ability was refreshed.",
            deathReminder: "Refresh an Evil's ability.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Bartender",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR_NEGATIVE,
            difficulty: DRUNKEN_TAVERN,
            effect: "When you die, someone (secretly) becomes <b>Drunk</b> (do NOT reveal your Role card).",
            deathReminder: "You will secretly choose someone will become Drunk.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Bombmaker",
            team: TOWNSFOLK,
            worth: 0,
            locationWorth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: BEGINNER,
            effect: "When you die, reveal your Role card.<br/>Someone you choose must <b>Blow</b> a card from any Location they want.",
            deathReminder: "Bombmaker will choose someone to Blow a card.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Builder",
            locationWorth: 1,
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: BEGINNER,
            effect: "When you die (except by hanging), reveal your Role card. Choose a Location to add a new Yellow Card to. Then shuffle that Location.",
            deathReminder: "Reveal the Builder. They choose a Location. Add a random unused Yellow card to that Location."
        },
        {
            name: "Santa Claus",
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR_NEGATIVE,
            difficulty: MORE_CHAOS,
            effect: "When you die (except by hanging), reveal your Role card.<b/>EVERYONE alive has 50% chance to get a new Green Card.",
            deathReminder: "Reveal the Santa. All alive players have 50% chance to get a Green card."
        },
        {
            name: "Mayor",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: TOWN_CENTER,
            effect: "Your vote secretly counts as 3 votes.",
            ribbonText: 'REMINDER',
            ribbonColor: MORNING_COLOR,
        },
        {
            name: "Goblins",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: ADVANCED,
            effect: "You are a copy of someone else's role. If someone suspects you're the Goblins, you die immediately.",
            notes: "If players check everyone of being Goblins or try to cheat suspicion, it doesn't work! Apply common sense.",
            ribbonText: 'SETUP',
            ribbonColor: SETUP_COLOR,
        },
        {
            name: "Joe",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: SPICE,
            effect: "You believe you are (and get) a different Role card (not this card).<br/>You are actually a Peasant. Your Ability acts as if you're <b>Drunk.</b>",
            notes: "If players check everyone of being Goblins or try to cheat suspicion, it doesn't work! Apply common sense.",
            narratorNotes: 'Give that player a different non-Evil role. Mark their role on the app as that role, and give it the Drunk status.',
            ribbonText: 'SETUP',
            ribbonColor: SETUP_COLOR,
        },
        {
            name: "Gravedigger",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: CHAOS,
            effect: "When you die, reveal your Role card. Choose one player to get a new Green card, and another to get a new Yellow card.",
            deathReminder: "Gravedigger chooses a player to get a random unused Green card, and another for a random unused Yellow card."
        },
        {
            name: "Thief",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: CHAOS,
            effect: 'At any point in the game, reveal your card and pick another player. You each get a new random role.',
            notes: 'You could get an Evil! If an Evil player became a different role, they remain Evil.'
        },
        {
            name: "Philosopher",
            team: TOWNSFOLK,
            worth: 0,
            category: SPECIAL_SETUP,
            difficulty: TOWN_CENTER,
            effect: 'When you get your role card, pick a different role from 3 unused options (could be an Evil)!',
            narratorNotes: 'Publicly draw 3 role cards from the unused roles (randomly, or as you like) and let the Philosopher pick one. Make sure you change the Philosopher\'s role on the app.',
            ribbonText: 'SETUP',
            ribbonColor: SETUP_COLOR,
        },
        {
            name: "Fallen Angel",
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: FOR_MODS,
            effect: "  If you win and are still alive, you start next match with a new Green Card and you can secretly pick someone else to become the Fallen Angel next game. Otherwise, you can pick your role next game.",
            notes: "You pick who becomes the Fallen Angel before roles are drawn."
        },
        {
            name: "Lover",
            team: TOWNSFOLK,
            worth: -1,
            category: SETUP,
            difficulty: SPICE,
            effect: 'At game start, grab a neighbor by hand. You become lovers. When one of you dies, the other dies too.',
            notes: 'The Storyteller will wake you up to grab someone by hand.',
            narratorNotes: 'If you have this role in game, make sure the players know that they may get grabbed by hand.',
            deathReminder: "The Lover's lover will also be killed.",
            type: 'Special Setup',
            ribbonText: "NEGATIVE",
            ribbonColor: EVIL_COLOR
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
            name: "Schizophrenic",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: DRUNKEN_TAVERN,
            effect: 'Every night, the narrator secretly rolls a die.\nIf they roll 6, you die.',
            notes: 'In the morning, you don\'t necessarily know how you died...',
            narratorNotes: 'Alternatively, instead of rolling a die, look at the time. If the minutes are divisible by 6, the Schizophrenic dies.',
            ribbonText: "REMINDER",
            ribbonColor: MORNING_COLOR
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
            name: "Inquisitor",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: ZEALOTS,
            effect: 'Once per game, secretly ask the narrator a YES/NO question about one player. You secretly get a correct reply.',
            notes: 'You can go to the narrator and ask, message them on their phone, etc.'
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
            worth: 0,
            category: REGULAR,
            difficulty: ZEALOTS,
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
            name: "Crusader",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: CHURCH,
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
            worth: 0,
            category: REGULAR,
            difficulty: ADVANCED,
            effect: "If you are hanged, reveal your card. The narrator publicly announces how many Evils are still in the game.",
            notes: "You do NOT reveal your card if you die elsehow!"
        },
        {
            name: "Bard",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1,
            category: REGULAR,
            difficulty: CHAOS,
            effect: 'When you die, reveal your card. You come back to life with a new random Role card.'
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
            worth: -1,
            category: REGULAR_NEGATIVE,
            difficulty: CHURCH,
            effect: "If you are hanged, reveal your card. The Evils win immediately.",
            ribbonColor: EVIL_COLOR,
            ribbonText: 'NEGATIVE'
        },
        {
            name: "Hunter",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0,
            category: REGULAR,
            difficulty: BEGINNER,
            effect: "When you die, reveal your Role card and pick a player. That player immediately dies."
        },
        {
            name: "Alien",
            nPlayers: 0,
            team: OTHER,
            worth: 1,
            category: OTHER_CATEGORY,
            difficulty: BROKEN,
            effect: "Hand Raise: Get a new Role card."
        },
        {
            name: "Diva",
            nPlayers: 9,
            team: TOWNSFOLK,
            worth: -1,
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
            difficulty: MORE_CHAOS,
            effect: "If you die, reveal your card. The next Night happens TWICE.",
            notes: "There will be 2 nights in a row, without everyone waking up in between."
        },
        {
            name: "Madman",
            nPlayers: 0,
            team: OTHER,
            worth: 0,
            category: OTHER_CATEGORY,
            difficulty: CHAOS,
            effect: "You aren't on any team. You win if you are hanged. Then the game goes on."
        },
        {
            name: "Peasant",
            nPlayers: 0,
            team: TOWNSFOLK,
            worth: 0,
            difficulty: BEGINNER,
            category: REGULAR,
            effect: '',
            notes: 'There may be any number of Peasants in the game!'
        },

    ]
    return roles
}

export const getRoles_OLD = () => {
    const roles = [
        
        {
            name: "Bitten",
            nPlayers: 12,
            team: TOWNSFOLK,
            worth: 0,
            category: SPECIAL_NIGHTLY,
            difficulty: EXTRAS,
            effect: 'When the Evils open their eyes, make a ROCK sign with your hand. You become a Werewolf. You may open your eyes.',
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
            name: "Mayor",
            nPlayers: 10,
            team: TOWNSFOLK,
            worth: 1.5,
            category: NIGHTLY,
            difficulty: INTERMEDIATE,
            effect: '<b>Hand Raise:</b> Learn which team the Storyteller believes is winning.',
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

export function getLocationCards() {
    const cards = [
        {
            color: "Purple",
            name: "Witching Hour",
            effect: "Choose a Location. <b>Blow</b> a card from it. Evils will choose someone to instantly kill tonight.",
            isLocationCard: true
        },
        {
            color: "Purple",
            name: "Plague Infection",
            effect: "When you draw this, you die. Then a random player gets a Spreading Infection.",
            notes: "If the Spreading Infection is already in the game, use a new Yellow card instead.",
            isLocationCard: true
            
        },
        {
            color: "Purple",
            name: "Sucked Blood",
            effect: "Next time after an Evil dies, a random Townsfolk becomes a Ghoul.",
            notes: "During that Evil phase, the Storyteller will touch someone to wake up to know they became a Ghoul.",
            isLocationCard: true
        },
        
        
        {
            color: "Red",
            name: "Stakes and Crosses",
            effect: "Choose a Location. Blow a card from it.",
            isLocationCard: true
        },
        {
            color: "Red",
            name: "Omen",
            effect: "Next Evil phase, the Evils will choose one more player to instantly kill.",
            isLocationCard: true
        },
        {
            color: "Red",
            name: "Ambush",
            effect: "You die.",
            isLocationCard: true
        },


        {
            color: "Yellow",
            name: "Famine",
            effect: "Choose a Location with at least 2 Cards. <b>Blow</b> a card from it. <i>If there isn't one, get a new Yellow card instead.</i>",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Pentagram",
            effect: "Refresh the Abilities of all Evils. A random player who is not a Peasant gets a new Green card.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Attack Plans",
            effect: "Next Evil phase, the Evils will attack 2 Locations. You don't get to protect 2 locations.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Swamp Gas",
            effect: "A random player becomes <b>Drunk</b>. A Location publicly chosen by the Storyteller can't be protected tomorrow.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Broken Mirror",
            effect: "<b>Item.</b> The next time Townsfolk successfully protect a Location, you die.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Mass Hysteria",
            effect: "The next <b>Blown</b> card is replaced by an unused card that is <i>one color worse</i>.",
            notes: "For example, a Green card becomes Yellow, Yellow becomes Red, Red becomes Purple.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Damned Excavation",
            effect: "Your 2 alive neighbors get a new Green and Yellow card (one each). You choose who gets which.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Dead Man's Map",
            effect: "<b>Item.</b> When the Townsfolk successfully protect a Location, <b>Blow</b> a card from a chosen Location and get a new Green card.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Winter Is Coming",
            effect: "Next day lasts 5 minutes. If overtime, a talkative or silent player must <b>Blow</b> a card from a Location they choose.",
            notes: "Day counts as all the time from when players wake up to when they go to sleep. Includes protecting and hanging.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Rabies",
            effect: "Item. After the next Night, you die.",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Secrets",
            effect: "The next time 2 players want to wake up (legally), one of them dies (prioritizes Townsfolk death).",
            notes: "A Townsfolk from them dies if there is any. Ghouls, don't screw up!",
            isLocationCard: true
        },
        {
            color: "Yellow",
            name: "Cursed Amulet",
            effect: "<b>Item.</b> While you're alive, your closest alive neighbors can't vote and their Role Abilities don't work.",
            isLocationCard: true
        },


        {
            color: "Green",
            name: "Garlic",
            effect: "<b>Item. Use once:</b> Today, protect one more Location. If you do, a random player becomes <b>Drunk</b>.",
            notes: "Alternatively, you can use Garlic to cure Rabies or Infections!",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Elden Tools",
            effect: "<b>Item. Use once:</b> Add a new Red Card on top of any Location.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Crucifix",
            effect: "<b>Item. Use once:</b> Choose a player. The next time they would die, lose this <b>Item</b> instead.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Holy Book",
            effect: "<b>Item. Use once: Blow</b> a card from a Location. If you don't die, resurrect a dead player.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Grampa's Shield",
            effect: "<b>Item.</b> The next time you would die, you don't. Then lose this <b>Item.</b>",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Crossbow",
            effect: "<b>Item. Use once:</b> Kill a player that is not your closest alive neighbor.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Sacrificial Dagger",
            effect: "<b>Item. Kept through death.</b> When someone else would die, you die instead. You can vote while dead.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Magnifying Glass",
            effect: "<b>Item. Use once:</b> The Storyteller secretly tells you the role of another random player.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Wooden Stake",
            effect: "<b>Item. Use once:</b> Choose a player. If their Role name contains letter 'O', they die.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Revelation",
            effect: "Get an extra random Role card.",
            notes: "If it's Evil, you become Evil. You do NOT have 2 lives. You're not a cat, get over it.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Ouija Board",
            effect: "<b>Item. Use once:</b> Choose a dead player. Reveal their role.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Medicine",
            effect: "<b>Item. Use once:</b> Remove an item from a different player (if any). They then get a new Green Card.",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Torch",
            effect: "<b>Item.</b> When a player dies, reveal their Role card. Then lose this <b>Item.</b>",
            isLocationCard: true
        },
        {
            color: "Green",
            name: "Illumination",
            effect: "Choose a Location. Take its first card, look at it privately, then put it back on any Location.",
            isLocationCard: true
        },

    ]
    return cards
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