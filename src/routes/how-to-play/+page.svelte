
<style>
    h1, h2 {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
    h3, h4 {
        margin-top: 2.5rem;
        margin-bottom: 0.75rem;
    }
    p {
        margin-top: 1rem;
    }
    ul {
        margin-top: 1rem;
    }
    li {
        list-style-type: none;
        padding-left: 1rem;
        margin-top: 0.5rem;
    }
    .icon {
        margin-right: 0.25rem;
    }
</style>

<script>
    import RoundCardPortrait from "../../components/RoundCardPortrait.svelte";


</script>

<div class="page">
    <div class="center-content portrait-wrapper margin-top-4" in:fly={{y: -100, delay: 50 }}>
        <RoundCardPortrait name="Strigoy" isBig={true} isValid={true}/>
    </div>

    <h2>What Is Strigoy?</h2>
    <p>Strigoy is a free print & play social deduction game for 9 to 20 players. It's an homage to games like Mafia, Werewolf, Salem, Blood on the Clock Tower, etc. One or more players are evil Strigoys, and the rest are townsfolk who try to figure out who the Strigoys are. To play, you will need to print the cards by going to the Print page.</p>

    <h2>Why Strigoy?</h2>
    <p>As a game designer, I've changes standard game rules and roles to make the game easy to run, have tons of content and make each game different. Here are the pros of Strigoy over other similar games:</p>
    <ul>
        <li><img src="/images/status/Used Ability.png" class="icon"/>Faster and easy to narrate - few nightly roles, not much narrator tracking, etc.</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>40+ roles (categorized by difficulty)</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>App for narrator with everything built-in</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>15+ Mod cards that make every game different</li>
        <li><img src="/images/status/Used Ability.png" class="icon"/>Free print & play</li>
    </ul>

    <h2>How To Play</h2>
    <h3>0. Prerequisites</h3>
    <p>To play, you will need to print and cut the cards. Go to <a href="/card">the Print page</a> to print all the cards.</p>
    <p>Find a minimum of 9 players. One of them will be the <b>narrator</b>.</p>

    <h3>1. Open the app</h3>
    <p>
        Assuming you're the narrator, go to the <a href="/">main page of this app</a> and hit play.<br>
        Add each player to the app (except the narrator) and hit next.
        Choose the difficulty and whether you want mods (see <a href="/how-to-play#mods">Mods</a>).
    </p>
    <p>
        Then, the app will automatically choose a <i>balanced roles distribution</i> so that neither side is favored.
    </p>

    <h3>2. Shuffle and give cards</h3>
    <p>
        After you have the roles in the app, take those cards, shuffle them, and give each player one.
        Look at them, and input each player's role into the app.
    </p>
    <p>There are now 2 teams (<i>probably</i>): Townsfolk vs Evils.</p>

    <h3>3. Setup ('First Night')</h3>
    <p>As the narrator, say "Everyone, close your eyes".</p>
    <p>For each <i>Setup</i> role, tell that role to open their eyes. Start with the Strigoys and say "Strigoys, wake up". Let them recognize eachother.</p>
    <p><b>Note</b>: If there are other non-Strigoy <i>Evil</i> roles in the game, point to them so Strigoys know who the <i>Evil</i> roles are (those <i>Evil</i> roles do NOT wake up).</p>
    <p>When done, tell them "Close your eyes".</p>
    <p>Do this for each of the Setup roles. Follow the order as sorted with the <b>Sort for Setup</b> button, or on <a href="all-roles">All Roles page</a>.</p>
    <p><b>Unless it specifically says so, nobody is killed or can use their power at this setup! Most people don't know who others are.</b></p>

    <h3>3.1. Clue</h3>
    <p>Once the setup is done, give the players one clue about the Strigoys. Here are some clue ideas:</p>
    <ul>
        <li>dasdasd</li>
    </ul>

    <h3>4. Day</h3>
    <p>Once the Setup is done, say "Everyone, wake up". Players can now talk, speculate and plan.</p>
    <p>At the end of every <i>day</i>, players can vote to hang one person. If they want to hang someone, players can vote on who to hang (see <a href="#voting">Voting and Hanging</a>). Only one person can be hanged every day.</p>
    <p><b>Note</b>: When a player dies, they do NOT show their card. Also, <b>that player remains in the game</b>, but can't vote or use their ability (they might be revived)!</p>
    <p>After a player dies, "Everyone, close your eyes". Move on to the Night phase.</p>

    <h3>5. Night ('Nightly')</h3>
    <p>Say "Everyone, close your eyes".</p>
    <p>One by one, tell each <b>Nightly</b> role to wake up, as sorted with the <b>Sort for Night</b> button, or on <a href="all-roles">All Roles page</a>. Follow the app.</p>
    <p>For example, all Strigoys, together, wake up and always kill one person per night. You can ask "Who do you want to kill?" and they will have to decide together on one person.</p>
    <p>After that, tell them to close their eyes.</p>
    <p>Do the same for all other <b>Nightly</b> roles.</p>
    <p><b>Note:</b> Some roles have special or secret <b>Nightly</b> abilities, and you don't wake them up!<br>They may simply raise their hand, with eyes closed (e.g. Silencer, Lover, etc). Pay close attention if you have one of those in game, and read the roles carefully.</p>

    <h3>Rinse and Repeat</h3>
    <p>The game goes from Daytime to Night to Day to Night, until the game ends.</p>

    <h3>Game End</h3>
    <p>The game ends when either <b>all the Strigoys are dead</b>, or Strigoys comprise half of all alive players.</p>

    <h2>Voting and Hanging</h2>
    <p>At the end of each Day, players can nominate people to hang.</p>
    <p>For each nominee, say "If you want to hang this person, raise your hand". Count the number of hands raised.</p>
    <p>The player with most votes dies, but only if they have a number of votes greater than half the number of players (e.g. at 5 votes with 9 players, the person is hanged; at 6 votes with 12 players, the person is not hanged).</p>

    <h2>Death</h2>
    <p>When a player dies, they remain in the game but their power no longer works, and they can't vote. They do NOT reveal their card.</p>
    <p><b>However</b></p>

    <h2>Mods</h2>

    <h2>Points</h2>

</div>