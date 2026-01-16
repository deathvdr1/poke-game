// --- FIREBASE IMPORTS ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp,
    arrayUnion,
    setLogLevel,
    collection,
    increment,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyBu05x09GesEm9zSwrnzQbN2SV03q3xF-0",
  authDomain: "re-fight.firebaseapp.com",
  projectId: "re-fight",
  storageBucket: "re-fight.firebasestorage.app",
  messagingSenderId: "192047188516",
  appId: "1:192047188516:web:1d10ba434ebc33359c66b1",
  measurementId: "G-RC3WBTFK5J"
};

// ... (UI_TEXT, MISS_MESSAGES, POKEMON_DATA objects remain unchanged) ...
const UI_TEXT = {
    'en': {
        'title_battle': '(re)Pokémon Battle',
        'title_choose': 'Choose Your Pokémon!',
        'play_ai': 'Play With AI',
        'play_friend': 'Play With Friend',
        'maintenance': 'Under Maintenance',
        'your_turn': 'Your Turn!',
        'opponents_turn': "Opponent's Turn",
        'battle_log': 'Battle Log',
        'turn_counter': (current, max) => `Turn: ${current} / ${max}`,
        'log_welcome': 'Welcome! Choose your Pokémon to begin.',
        'log_player_chose': (name) => `You chose ${name}!`,
        'log_ai_chose': (name) => `The AI chose ${name}!`,
        'log_opponent_chose': (name) => `Opponent chose ${name}!`,
        'log_battle_begin': 'Let the battle begin!',
        'log_player_command': (pokemon, attack) => `You commanded ${pokemon} to use ${attack}!`,
        'log_opponent_command': (pokemon, attack) => `Opponent's ${pokemon} uses ${attack}!`,
        'log_miss': (reason) => `...but ${reason}`,
        'log_hit': (attack, damage) => `${attack} hit! It dealt ${damage} damage.`,
        'log_ai_attack': (pokemon, attack) => `The AI's ${pokemon} uses ${attack}!`,
        'log_heavy_fail': (attack) => `You can't use ${attack} with more than 50 HP!`,
        'log_ai_focus': (pokemon) => `The AI's ${pokemon} is focusing its power!`,
        'log_ai_fainted': (pokemon) => `The AI's ${pokemon} fainted!`,
        'log_player_fainted': (pokemon) => `Your ${pokemon} fainted!`,
        'log_opponent_fainted': (pokemon) => `Opponent's ${pokemon} fainted!`,
        'log_times_up': "The battle is over! Time's up!",
        'log_player_hp_win': 'You have more HP! You win!',
        'log_ai_hp_win': 'The AI has more HP! You lose.',
        'log_opponent_hp_win': 'Opponent has more HP! You lose.',
        'log_draw': "It's a draw!",
        'log_forfeit': 'You forfeited the match!',
        'log_opponent_forfeit': 'Opponent forfeited the match!',
        'hp_text': (current, max) => `HP: ${current}/${max}`,
        'victory': (name) => `${name} WINS!`,
        'defeat': (name) => `${name} WINS...`,
        'draw': "IT'S A DRAW!",
        'play_again': 'Play Again',
        'end_game': 'End Game',
        'help': 'Help',
        'help_title': 'How to Play',
        'help_rule_1': 'Attacks have different power levels (Basic ~20, Medium ~30-40, Heavy ~50-60).',
        'help_rule_2': 'Basic/Heavy attacks have 40% miss chance. Medium attacks have 70% miss chance.',
        'help_rule_3': 'Heavy Attacks (e.g., Volt Tackle) can ONLY be used when your HP is less than 50 (49 or less)!',
        'help_back': 'Back',
        'view_log': 'View Final Log',
        'log_review_title': 'Final Battle Log',
        'lobby_title': 'Multiplayer Lobby',
        'your_user_id': 'Your User ID:',
        'create_game': 'Create Game',
        'lobby_or': '--- OR ---',
        'join_game': 'Join Game',
        'game_id_placeholder': 'Enter Game ID...',
        'lobby_error_joining': 'Error: Could not find game or game is full.',
        'lobby_error_creating': 'Error: Could not create game.',
        'waiting_for_player': 'Waiting for opponent to join...',
        'game_id_label': 'Share Game ID:',
        'lobby_back': 'Back to Menu',
        'selection_title': 'Choose Your Pokémon!',
        'waiting_for_opponent_selection': 'Waiting for opponent to choose...',
        'player1_name': 'Player 1',
        'player2_name': 'Player 2',
        'welcome_user': (name) => `Welcome, ${name}!`,
        'leaderboard': 'Leaderboard',
    },
    'ja': {
        // ... (Keep Japanese translations) ...
        'title_battle': 'ポケモンバトル',
        'title_choose': 'ポケモンをえらんでね！',
        'play_ai': 'AIとたいせん',
        'play_friend': 'ともだちとたいせん',
        'maintenance': 'メンテナンスちゅう',
        'your_turn': 'あなたのターン！',
        'opponents_turn': "あいてのターン",
        'battle_log': 'バトルログ',
        'turn_counter': (current, max) => `ターン: ${current} / ${max}`,
        'log_welcome': 'ようこそ！ポケモンをえらんでね。',
        'log_player_chose': (name) => `あなたは ${name} をえらんだ！`,
        'log_ai_chose': (name) => `AIは ${name} をえらんだ！`,
        'log_opponent_chose': (name) => `あいては ${name} をえらんだ！`,
        'log_battle_begin': 'バトルかいし！',
        'log_player_command': (pokemon, attack) => `いけっ ${pokemon}！ ${attack}！`,
        'log_opponent_command': (pokemon, attack) => `あいての ${pokemon} は ${attack} をつかった！`,
        'log_miss': (reason) => `...しかし ${reason}`,
        'log_hit': (attack, damage) => `${attack} があたった！ ${damage} のダメージ。`,
        'log_ai_attack': (pokemon, attack) => `AIの ${pokemon} は ${attack} をつかった！`,
        'log_heavy_fail': (attack) => `HPが50いじょうのときは ${attack} はつかえない！`,
        'log_ai_focus': (pokemon) => `AIの ${pokemon} はちからをためている！`,
        'log_ai_fainted': (pokemon) => `AIの ${pokemon} はたおれた！`,
        'log_player_fainted': (pokemon) => `あなたの ${pokemon} はたおれた！`,
        'log_opponent_fainted': (pokemon) => `あいての ${pokemon} はたおれた！`,
        'log_times_up': 'バトルしゅうりょう！ じかんぎれ！',
        'log_player_hp_win': 'あなたのHPがおおい！ あなたの勝ち！',
        'log_ai_hp_win': 'AIのHPがおおい！ あなたのまけ。',
        'log_opponent_hp_win': 'あいてのHPがおおい！ あなたのまけ。',
        'log_draw': 'ひきわけ！',
        'log_forfeit': 'しょうぶをあきらめた！',
        'log_opponent_forfeit': 'あいてが しょうぶを あきらめた！',
        'hp_text': (current, max) => `HP: ${current}/${max}`,
        'victory': (name) => `${name} の しょうり！`,
        'defeat': (name) => `${name} の しょうり...`,
        'draw': 'ひきわけ',
        'play_again': 'もういっかい',
        'end_game': 'おわる',
        'help': 'ヘルプ',
        'help_title': 'あそびかた',
        'help_rule_1': 'こうげきには いろいろな いりょくが あるよ (じゃく: ~20, ちゅう: ~30-40, きょう: ~50-60)。',
        'help_rule_2': '「じゃく」/「きょう」こうげきは 40%はずれる。「ちゅう」こうげきは 70%はずれる。',
        'help_rule_3': '「きょう」こうげき (ボルテッカーなど) は、じぶんのHPが 50みまん (49いか) のときだけ つかえる！',
        'help_back': 'もどる',
        'view_log': 'さいしゅうログ',
        'log_review_title': 'さいしゅうバトルログ',
        'lobby_title': 'マルチプレイ ロビー',
        'your_user_id': 'あなたのID:',
        'create_game': 'ゲームを つくる',
        'lobby_or': '--- または ---',
        'join_game': 'ゲームに はいる',
        'game_id_placeholder': 'ゲームIDを にゅうりょく...',
        'lobby_error_joining': 'エラー: ゲームが みつからないか、まんいんです。',
        'lobby_error_creating': 'エラー: ゲームを つくれませんでした。',
        'waiting_for_player': 'あいてを まっています...',
        'game_id_label': 'ゲームIDを おしえてね:',
        'lobby_back': 'メニューへ もどる',
        'selection_title': 'ポケモンをえらんでね！',
        'waiting_for_opponent_selection': 'あいてが えらぶのを まっています...',
        'player1_name': 'プレイヤー1',
        'player2_name': 'プレイヤー2',
        'welcome_user': (name) => `ようこそ、${name}さん！`,
        'leaderboard': 'リーダーボード',
    }
};

const MISS_MESSAGES = {
    'en': [
        "its brain momentarily believed it was JMike the Pirate and went searching for buried treasure.",
        "it got an alert from Discord about an urgent hype squad post. Priorities, people.",
        "it was about to finish, but Chaz sent it a video of a cat singing opera.",
        "it got an alert from Discord about an urgent hype squad post. Priorities, people.",
        "A tiny voice whispered, What would JMike the Pirate steal next? and it had to ponder.",
        "it suddenly realized it hadn't checked newbie-chat in a whole five minutes—a serious oversight.",
        "it was in a focus flow, then Chaz dared it to poke the cat.",
        "It fell into a trance RE made it forget everything that came before and after it.",
        "Its monitor briefly turned into a treasure map, thanks, JMike the Pirate's influence.",
        "it got a text from Chaz that was just a picture of a suspiciously smug cat.",
        "it got a text from Chaz that Movie night was About to start.",
        "It couldn't attack as it was mentally preparing a lecture from Joey the Professor on being a reinsurer.",
        "It got a spontaneous flash of inspiration regarding a new hat design for Chely.",
        "The gentle rhythm of its work was interrupted when it heard Croket doing stand-up comedy in its head.",
        "It got distracted by a sudden, urgent need to know what Chely's favorite type of cloud is.",
        "It had to stop and mentally high-five Croket for being so impeccably blue.",
        "It briefly forgot the task because it was trying to imitate the deep, thoughtful gaze of Croket the Frog.",
        "It blames Chaz. The thought of him riding a tiny unicycle was too powerful to ignore."
    ],
    'ja': [
        "のうみそが いっしゅん じぶんを かいぞくJマイクだと おもいこみ、うまった たからを さがしにいった。",
        "Discordから キンキュウの ハイプスクワッドの とうこうアラートが きた。ゆうせんじこうだ、みんな。",
        "おわらせるところだったが、チャズから オペラをうたうネコの どうがが おくられてきた。",
        "『かいぞくJマイクは つぎに なにを ぬすむだろう？』と ちいさなこえが ささやき、かんがえこんでしまった。",
        "まるごふんかんも しんじんチャットを チェックしていないことに きづいてしまった。これは いちだいじだ。",
        "しゅうちゅうモードだったのに、チャズに『ネコをつついてみろ』と そそのかされた。",
        "REの トランスじょうたいに おちいり、すべての きおくを うしなった。",
        "かいぞくJマイクの えいきょうで、モニターが いちじてきに たからのちずに なった。",
        "チャズから、いぶかしげな ドヤがおのネコの しゃしんだけが おくられてきた。",
        "チャズから『もうすぐ えいがのじかんだ』と メールが きた。",
        "ジョーイきょうじゅから さいほけんについて レクチャーを うけるための こころのじゅんびを していて こうげきできなかった。",
        "チェリーの あたらしい ぼうしのデザインにかんする とつぜんの ひらめきが...！",
        "あたまのなかで クロケット・ザ・フロッグが スタンドアップコメディを はじめ、おだやかな しごとのリズムが みだされた。",
        "チェリーの すきな くもの しゅるいを しらなければという、とつぜんの きんきゅうの しょうどうに かられた。",
        "クロケット・ザ・フロッグの あまりにも かんぺきな みどりいろに、こころのなかで ハイタッチするしか なかった。",
        "クロケット・ザ・フロッグの ふかく ものおもいに ふける まなざしを マネしようとして、タスクを わすれた。",
        "チャズのせいだ。かれが ちいさな いちりんしゃに のっている すがたを そうぞうしたら、むしできなかった。"
    ]
};

const POKEMON_DATA = {
    'en': [
        { id: 1, name: 'Pika(re)', type: 'electric', image: './pika.png', attacks: [
            { name: 'Quick Attack', damage: 20 },
            { name: 'Thunder Shock', damage: 20 },
            { name: 'Thunder Bolt', damage: 30, type: 'medium' },
            { name: 'Volt Tackle', damage: 50, type: 'heavy' }
        ]},
        { id: 2, name: '(re)mander', type: 'fire', image: './char.png', attacks: [
            { name: 'Scratch', damage: 20 },
            { name: 'Ember', damage: 20 },
            { name: 'Flamethrower', damage: 30, type: 'medium' },
            { name: 'Flare Blitz', damage: 50, type: 'heavy' }
        ]},
        { id: 3, name: 'Squi(re)tle', type: 'water', image: './squirtle.png', attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Bubble', damage: 20 },
            { name: 'Water Gun', damage: 40, type: 'medium' },
            { name: 'Hydro Pump', damage: 60, type: 'heavy' }
        ]},
        { id: 4, name: 'Bulbasau(re)', type: 'grass', image: './bulba.png', attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Vine Whip', damage: 20 },
            { name: 'Razor Leaf', damage: 30, type: 'medium' },
            { name: 'Solar Beam', damage: 50, type: 'heavy' }
        ]},
        { id: 5, name: '(re)evee', type: 'normal', image: './eevie.png', attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Quick Attack', damage: 20 },
            { name: 'Swift', damage: 40, type: 'medium' },
            { name: 'Last Resort', damage: 60, type: 'heavy' }
        ]}
    ],
    'ja': [
        { id: 1, name: 'ピカリ', type: 'electric', image: './pika.png', attacks: [
            { name: 'でんこうせっか', damage: 20 },
            { name: 'でんきショック', damage: 20 },
            { name: '10まんボルト', damage: 30, type: 'medium' },
            { name: 'ボルテッカー', damage: 50, type: 'heavy' }
        ]},
        { id: 2, name: 'リトカゲ', type: 'fire', image: './char.png', attacks: [
            { name: 'ひっかく', damage: 20 },
            { name: 'ひのこ', damage: 20 },
            { name: 'かえんほうしゃ', damage: 30, type: 'medium' },
            { name: 'フレアドライブ', damage: 50, type: 'heavy' }
        ]},
        { id: 3, name: 'リガメ', type: 'water', image: './squirtle.png', attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'あわ', damage: 20 },
            { name: 'みずでっぽう', damage: 30, type: 'medium' },
            { name: 'ハイドロポンプ', damage: 50, type: 'heavy' }
        ]},
        { id: 4, name: 'リダネ', type: 'grass', image: './bulba.png', attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'つるのムチ', damage: 20 },
            { name: 'はっぱカッター', damage: 30, type: 'medium' },
            { name: 'ソーラービーム', damage: 50, type: 'heavy' }
        ]},
        { id: 5, name: 'リイーブイ', type: 'normal', image: './eevie.png', attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'でんこうせっか', damage: 20 },
            { name: 'スピードスター', damage: 40, type: 'medium' },
            { name: 'とっておき', damage: 60, type: 'heavy' }
        ]}
    ]
};

// --- STATE ---
let app, auth, db;
let appId = 'default-app-id';
let userId = null;
let gameUnsubscribe = null;
let gameDocRef = null;

let playerPokemon = null;
let opponentPokemon = null;
let playerHP = 100;
let opponentHP = 100;
let currentTurn = 1;
let isPlayerTurn = true;
let gameInProgress = false;
let currentSelectionIndex = 0;
let currentLanguage = 'en';
let gameMode = 'ai'; 
let gameId = null;
let localPlayerRole = null;
let localPlayerName = null;
let opponentPlayerName = null;
let musicStarted = false;
let isEventGame = false;
const MAX_TURNS = 20; 

// --- DOM ELEMENTS ---
let startScreen, selectionScreen, battleScreen, victoryScreen, helpScreen, lobbyScreen, eventBattleScreen, usernameScreen;
let playAiButton, playFriendButton, helpButton, helpButtonText, helpTitle, helpRule1, helpRule2, helpRule3, helpBackButton;
let lobbyTitle, playerUserId, yourUserIdLabel, createGameButton, lobbyOrDivider, gameIdInput, joinGameButton, lobbyErrorMsg, waitingForPlayerMsg, gameIdDisplay, gameIdLabel, gameIdText, lobbyBackButton;
let leaderboardBtn, leaderboardScreen, leaderboardList, leaderboardBackBtn;
let pokemonCardDisplay, prevPokemonButton, nextPokemonButton, selectionTitle, waitingForOpponentSelection;
let playerBox, opponentBox, opponentPokemonName, opponentHpText, opponentHpBar, opponentPokemonImg, playerUsernameEl, opponentUsernameEl;
let playerPokemonName, playerHpText, playerHpBar, playerPokemonImg;
let battleLog, battleLogStart, turnCounter, playerControls, yourTurnTitle, battleLogTitle;
let endGameButton, winnerImg, victoryText, restartButton, mainTitle, languageToggleButton;
let logReviewOverlay, logReviewTitle, logReviewContent, showLogButton, closeLogButton;
let bgMusic;
let usernameInput, saveUsernameBtn, usernameError, welcomeUserMsg;

// EVENT VARS
let eventBattleBtn, eventBackBtn;
let eventLockedMsg, eventSignInUI, eventConfirmSignInBtn, eventSignInStatus;
let eventBracketUI, eventRoundLabel, eventMatchesList;
let eventStatusUnsubscribe = null;
let eventRoundUnsubscribe = null;

// --- FUNCTIONS ---

function initDomElements() {
    usernameScreen = document.getElementById('username-screen');
    startScreen = document.getElementById('start-screen');
    selectionScreen = document.getElementById('selection-screen');
    battleScreen = document.getElementById('battle-screen');
    victoryScreen = document.getElementById('victory-screen');
    helpScreen = document.getElementById('help-screen');
    lobbyScreen = document.getElementById('lobby-screen');
    eventBattleScreen = document.getElementById('event-battle-screen');
    leaderboardScreen = document.getElementById('leaderboard-screen');

    playAiButton = document.getElementById('play-ai-btn');
    playFriendButton = document.getElementById('play-friend-btn');
    leaderboardBtn = document.getElementById('leaderboard-btn');
    helpButton = document.getElementById('help-btn');
    helpButtonText = document.getElementById('help-btn-text');
    helpTitle = document.getElementById('help-title');
    helpRule1 = document.getElementById('help-rule-1');
    helpRule2 = document.getElementById('help-rule-2');
    helpRule3 = document.getElementById('help-rule-3');
    helpBackButton = document.getElementById('help-back-btn');

    // EVENT BATTLE ELEMENTS
    eventBattleBtn = document.getElementById('event-battle-btn');
    eventBackBtn = document.getElementById('event-back-btn');
    eventLockedMsg = document.getElementById('event-locked-msg');
    eventSignInUI = document.getElementById('event-signin-ui');
    eventConfirmSignInBtn = document.getElementById('event-confirm-signin-btn');
    eventSignInStatus = document.getElementById('event-signin-status');
    eventBracketUI = document.getElementById('event-bracket-ui');
    eventRoundLabel = document.getElementById('event-round-label');
    eventMatchesList = document.getElementById('event-matches-list');

    // LEADERBOARD ELEMENTS
    leaderboardList = document.getElementById('leaderboard-list');
    leaderboardBackBtn = document.getElementById('leaderboard-back-btn');

    lobbyTitle = document.getElementById('lobby-title');
    playerUserId = document.getElementById('player-user-id');
    yourUserIdLabel = document.getElementById('your-user-id-label');
    createGameButton = document.getElementById('create-game-btn');
    lobbyOrDivider = document.getElementById('lobby-or-divider');
    gameIdInput = document.getElementById('game-id-input');
    joinGameButton = document.getElementById('join-game-btn');
    lobbyErrorMsg = document.getElementById('lobby-error-msg');
    waitingForPlayerMsg = document.getElementById('waiting-for-player-msg');
    gameIdDisplay = document.getElementById('game-id-display');
    gameIdLabel = document.getElementById('game-id-label');
    gameIdText = document.getElementById('game-id-text');
    lobbyBackButton = document.getElementById('lobby-back-btn');

    pokemonCardDisplay = document.getElementById('pokemon-card-display');
    prevPokemonButton = document.getElementById('prev-pokemon');
    nextPokemonButton = document.getElementById('next-pokemon');
    selectionTitle = document.getElementById('selection-title');
    waitingForOpponentSelection = document.getElementById('waiting-for-opponent-selection');

    playerBox = document.getElementById('player-box');
    opponentBox = document.getElementById('opponent-box');
    opponentPokemonName = document.getElementById('opponent-pokemon-name');
    opponentHpText = document.getElementById('opponent-hp-text');
    opponentHpBar = document.getElementById('opponent-hp-bar');
    opponentPokemonImg = document.getElementById('opponent-pokemon-img');
    playerUsernameEl = document.getElementById('player-username');
    opponentUsernameEl = document.getElementById('opponent-username');

    playerPokemonName = document.getElementById('player-pokemon-name');
    playerHpText = document.getElementById('player-hp-text');
    playerHpBar = document.getElementById('player-hp-bar');
    playerPokemonImg = document.getElementById('player-pokemon-img');

    battleLog = document.getElementById('battle-log');
    battleLogStart = document.getElementById('battle-log-start');
    turnCounter = document.getElementById('turn-counter');
    playerControls = document.getElementById('player-controls');
    yourTurnTitle = document.getElementById('your-turn-title');
    battleLogTitle = document.getElementById('battle-log-title');

    endGameButton = document.getElementById('end-game-btn');
    winnerImg = document.getElementById('winner-img');
    victoryText = document.getElementById('victory-text');
    restartButton = document.getElementById('restart-button');
    mainTitle = document.getElementById('main-title');
    languageToggleButton = document.getElementById('language-toggle');

    logReviewOverlay = document.getElementById('log-review-overlay');
    logReviewTitle = document.getElementById('log-review-title');
    logReviewContent = document.getElementById('log-review-content');
    showLogButton = document.getElementById('show-log-button');
    closeLogButton = document.getElementById('close-log-button');

    bgMusic = document.getElementById('bg-music');
    
    // Username Elements
    usernameInput = document.getElementById('username-input');
    saveUsernameBtn = document.getElementById('save-username-btn');
    usernameError = document.getElementById('username-error');
    welcomeUserMsg = document.getElementById('welcome-user-msg');
}

// ... (getText, updateAllText, toggleLanguage, playBgMusic, initGame match previous logic) ...
function getText(key, ...args) {
    const textOrFn = UI_TEXT[currentLanguage][key];
    if (typeof textOrFn === 'function') {
        return textOrFn(...args);
    }
    return textOrFn || key;
}

function updateAllText() {
    document.body.lang = currentLanguage;

    if (!startScreen.classList.contains('hidden')) {
        mainTitle.textContent = getText('title_battle');
        mainTitle.style.color = '#6d47fb';
        playAiButton.textContent = getText('play_ai');
        playFriendButton.textContent = getText('play_friend');
        leaderboardBtn.textContent = getText('leaderboard');
        helpButtonText.textContent = getText('help');
        if (localPlayerName) {
            welcomeUserMsg.textContent = getText('welcome_user', localPlayerName);
        }
    }

    if (!lobbyScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        lobbyTitle.textContent = getText('lobby_title');
        yourUserIdLabel.textContent = getText('your_user_id');
        playerUserId.textContent = userId || '...';
        createGameButton.textContent = getText('create_game');
        lobbyOrDivider.textContent = getText('lobby_or');
        gameIdInput.placeholder = getText('game_id_placeholder');
        joinGameButton.textContent = getText('join_game');
        waitingForPlayerMsg.textContent = getText('waiting_for_player');
        gameIdLabel.textContent = getText('game_id_label');
        lobbyBackButton.textContent = getText('lobby_back');
    }

    if (!helpScreen.classList.contains('hidden')) {
        helpTitle.textContent = getText('help_title');
        helpRule1.textContent = getText('help_rule_1');
        helpRule2.textContent = getText('help_rule_2');
        helpRule3.textContent = getText('help_rule_3');
        helpBackButton.textContent = getText('help_back');
    }

    if (!selectionScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        selectionTitle.textContent = getText('selection_title');
        waitingForOpponentSelection.textContent = getText('waiting_for_opponent_selection');
        renderCurrentPokemonCard();
    }

    if (!battleScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');
        battleLogTitle.textContent = getText('battle_log');
        endGameButton.textContent = getText('end_game');

        if (playerPokemon) {
            const playerLangName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name;
            playerPokemonName.textContent = playerLangName;
            playerHpText.textContent = getText('hp_text', playerHP, 100);
            if (localPlayerName) playerUsernameEl.textContent = localPlayerName;
            createAttackButtons();
        }
        if (opponentPokemon) {
            const opponentLangName = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id).name;
            opponentPokemonName.textContent = opponentLangName;
            opponentHpText.textContent = getText('hp_text', opponentHP, 100);
            if (opponentPlayerName) opponentUsernameEl.textContent = opponentPlayerName;
        }
        turnCounter.textContent = getText('turn_counter', Math.min(Math.ceil(currentTurn / 2), MAX_TURNS / 2), MAX_TURNS / 2);
    }

    if (!victoryScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        restartButton.textContent = getText('play_again');
        
        if (victoryScreen.dataset.result) {
            const resultKey = victoryScreen.dataset.result;
            if (resultKey === 'victory') {
                victoryText.textContent = getText('victory', localPlayerName || 'Player');
                victoryText.className = 'victory-text-base victory-text-win';
            } else if (resultKey === 'defeat') {
                victoryText.textContent = getText('defeat', opponentPlayerName || 'Opponent');
                victoryText.className = 'victory-text-base victory-text-lose';
            } else {
                victoryText.textContent = getText('draw');
                victoryText.className = 'victory-text-base victory-text-draw';
            }
        }
        showLogButton.textContent = getText('view_log');
    }

    logReviewTitle.textContent = getText('log_review_title');
    closeLogButton.textContent = getText('help_back');
    languageToggleButton.textContent = (currentLanguage === 'en') ? '日本語' : 'English';
}

function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ja' : 'en';
    updateAllText();
}

function playBgMusic() {
    if (musicStarted || !bgMusic) return;
    bgMusic.volume = 0.7;
    bgMusic.play().then(() => {
        musicStarted = true;
    }).catch(e => {
        console.error("Background music playback failed:", e);
    });
}

function initGame() {
    // Standard Reset
    startScreen.classList.remove('hidden');
    usernameScreen.classList.add('hidden'); 
    selectionScreen.classList.add('hidden');
    battleScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    helpScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    eventBattleScreen.classList.add('hidden');
    leaderboardScreen.classList.add('hidden');
    mainTitle.classList.remove('hidden');
    
    if (gameUnsubscribe) {
        gameUnsubscribe();
        gameUnsubscribe = null;
    }
    
    // Stop Event Listeners if we go back to main menu
    if (eventStatusUnsubscribe) eventStatusUnsubscribe();
    if (eventRoundUnsubscribe) eventRoundUnsubscribe();
    
    // Restart Listener only when needed (moved to showEventBattleScreen)

    if (gameDocRef && localPlayerRole === 'player1') {
        deleteDoc(gameDocRef).catch(e => console.error("Error cleaning up game doc", e));
    }

    playerPokemon = null;
    opponentPokemon = null;
    playerHP = 100;
    opponentHP = 100;
    currentTurn = 1;
    isPlayerTurn = true;
    gameInProgress = false;
    currentSelectionIndex = 0;
    gameMode = 'ai';
    gameId = null;
    localPlayerRole = null;
    opponentPlayerName = null;
    gameDocRef = null;
    isEventGame = false;

    battleLog.innerHTML = `<p id="battle-log-start">${getText('log_welcome')}</p>`;
    logReviewContent.innerHTML = '';
    endGameButton.classList.add('hidden');
    
    gameIdInput.value = '';
    lobbyErrorMsg.textContent = '';
    waitingForPlayerMsg.classList.add('hidden');
    gameIdDisplay.classList.add('hidden');
    createGameButton.disabled = false;
    joinGameButton.disabled = false;
    gameIdInput.disabled = false;
    
    updateAllText();
}

// --- NEW EVENT SYSTEM LOGIC ---

// 1. Show Screen & Start Listener
function showEventBattleScreen() {
    startScreen.classList.add('hidden');
    eventBattleScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    
    listenToEventStatus();
}

function hideEventBattleScreen() {
    startScreen.classList.remove('hidden');
    eventBattleScreen.classList.add('hidden');
    mainTitle.classList.remove('hidden');
    
    if (eventStatusUnsubscribe) eventStatusUnsubscribe();
    if (eventRoundUnsubscribe) eventRoundUnsubscribe();
}

// 2. Listen to Status (Locked, SignIn, Active)
function listenToEventStatus() {
    if (eventStatusUnsubscribe) eventStatusUnsubscribe();

    const docRef = doc(db, `artifacts/${appId}/public/data/event_config/status`);
    eventStatusUnsubscribe = onSnapshot(docRef, (snap) => {
        const state = snap.data()?.state || 'locked';

        eventLockedMsg.classList.add('hidden');
        eventSignInUI.classList.add('hidden');
        eventBracketUI.classList.add('hidden');
        
        if (state === 'locked') {
            eventLockedMsg.classList.remove('hidden');
        } else if (state === 'signin') {
            eventSignInUI.classList.remove('hidden');
            checkEventSignIn();
        } else if (state === 'active') {
            eventBracketUI.classList.remove('hidden');
            listenToActiveRound();
        }
    });
}

// 3. Sign In Logic
async function checkEventSignIn() {
    if(!userId) return;
    const ref = doc(db, `artifacts/${appId}/public/data/event_participants/${userId}`);
    const snap = await getDoc(ref);
    if(snap.exists()) {
        eventConfirmSignInBtn.classList.add('hidden');
        eventSignInStatus.classList.remove('hidden');
    } else {
        eventConfirmSignInBtn.classList.remove('hidden');
        eventSignInStatus.classList.add('hidden');
    }
}

async function signUserIntoEvent() {
    if(!userId || !localPlayerName) return alert("Error: No username.");
    eventConfirmSignInBtn.disabled = true;
    try {
        await setDoc(doc(db, `artifacts/${appId}/public/data/event_participants/${userId}`), {
            userId: userId,
            username: localPlayerName,
            joinedAt: serverTimestamp()
        });
        checkEventSignIn();
    } catch(e) {
        console.error(e);
        alert("Sign in failed.");
        eventConfirmSignInBtn.disabled = false;
    }
}

// 4. Bracket / Matchmaking Logic
function listenToActiveRound() {
    if (eventRoundUnsubscribe) eventRoundUnsubscribe();
    
    const ref = doc(db, `artifacts/${appId}/public/data/event_data/active_round`);
    eventRoundUnsubscribe = onSnapshot(ref, (snap) => {
        eventMatchesList.innerHTML = '';
        if(!snap.exists()) {
             eventMatchesList.innerHTML = '<p class="text-gray-400">Waiting for round to be published...</p>';
             return;
        }
        
        const data = snap.data();
        eventRoundLabel.textContent = data.roundName || "Current Round";
        
        const matches = data.matches || [];
        if(matches.length === 0) {
            eventMatchesList.innerHTML = '<p class="text-gray-400">No matches in this round.</p>';
            return;
        }

        matches.forEach(m => {
            const card = document.createElement('div');
            card.className = "bg-gray-800 border border-gray-600 rounded p-3 flex justify-between items-center";
            
            // Check if I am involved
            const isMyMatch = (m.p1 === localPlayerName || m.p2 === localPlayerName);
            const myColor = isMyMatch ? "border-yellow-400 border-2" : "";
            if(isMyMatch) card.className = `bg-gray-800 rounded p-3 flex justify-between items-center ${myColor}`;

            card.innerHTML = `
                <div class="flex flex-col md:flex-row items-center gap-2 flex-1">
                    <span class="text-blue-300 font-bold">${m.p1}</span>
                    <span class="text-gray-500 text-xs">VS</span>
                    <span class="text-red-300 font-bold">${m.p2}</span>
                </div>
            `;

            if(isMyMatch) {
                const btn = document.createElement('button');
                btn.className = "retro-btn !text-xs !py-2 !px-4 ml-4 bg-green-600 animate-pulse";
                btn.textContent = "FIGHT";
                btn.onclick = () => joinEventGame(m.gameId, m.p1, m.p2);
                card.appendChild(btn);
            } else {
                 const status = document.createElement('span');
                 status.className = "text-xs text-gray-500 ml-4";
                 status.textContent = "In Progress";
                 card.appendChild(status);
            }

            eventMatchesList.appendChild(card);
        });
    });
}

async function joinEventGame(gId, p1Name, p2Name) {
    // 1. Hide Event Screen
    hideEventBattleScreen();
    // 2. Prepare Game State locally
    isEventGame = true;
    gameId = gId;
    
    // 3. Determine Role based on name match
    if(localPlayerName === p1Name) localPlayerRole = 'player1';
    else if (localPlayerName === p2Name) localPlayerRole = 'player2';
    else { alert("Name mismatch error."); return; }
    
    // 4. Set Ref & Listen
    gameDocRef = doc(db, `artifacts/${appId}/public/data/games/${gameId}`);
    
    // 5. Trigger "Ready" on doc to show presence? (Optional, handled by selection screen)
    
    // 6. Go to Selection immediately via listener logic, but we trigger listener manually first
    listenToGame();
}


// --- LEADERBOARD & OTHER LOGIC (UNCHANGED) ---

async function showLeaderboard() {
    startScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    
    leaderboardList.innerHTML = '<p class="text-gray-400 py-4">Loading top players...</p>';
    
    try {
        const usersRef = collection(db, `artifacts/${appId}/public/data/registered_users`);
        // Query top 10 by score desc
        const q = query(usersRef, orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);
        
        leaderboardList.innerHTML = '';
        
        if (snapshot.empty) {
            leaderboardList.innerHTML = '<p class="text-gray-400 py-4">No scores yet.</p>';
            return;
        }
        
        let rank = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            const score = data.score || 0;
            const name = data.username || "Unknown";
            
            const div = document.createElement('div');
            div.className = "grid grid-cols-3 gap-2 border-b border-white/10 py-2 items-center hover:bg-white/5";
            
            let rankClass = "text-white";
            if (rank === 1) rankClass = "text-yellow-400 font-bold";
            else if (rank === 2) rankClass = "text-gray-300 font-bold";
            else if (rank === 3) rankClass = "text-orange-400 font-bold";
            
            div.innerHTML = `
                <div class="${rankClass}">#${rank}</div>
                <div class="truncate text-left">${name}</div>
                <div class="text-green-400 font-mono">${score}</div>
            `;
            leaderboardList.appendChild(div);
            rank++;
        });
        
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        leaderboardList.innerHTML = '<p class="text-red-400 py-4">Error loading leaderboard.</p>';
    }
}

function hideLeaderboard() {
    leaderboardScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    mainTitle.classList.remove('hidden');
}

async function incrementUserScore() {
    if (!userId) return;
    const userRef = doc(db, `artifacts/${appId}/public/data/registered_users/${userId}`);
    try {
        await updateDoc(userRef, {
            score: increment(1)
        });
        console.log("Score incremented!");
    } catch (e) {
        console.error("Error updating score:", e);
    }
}

// ... (Rest of logic: Username, Help, Selection, Firebase Init - Unchanged) ...

async function checkUserProfile() {
    if (!userId) return;
    const userDocRef = doc(db, `artifacts/${appId}/public/data/registered_users/${userId}`);
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            localPlayerName = docSnap.data().username;
            initGame();
        } else {
            startScreen.classList.add('hidden');
            usernameScreen.classList.remove('hidden');
            mainTitle.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Error checking profile:", e);
    }
}

async function handleSaveUsername() {
    const inputName = usernameInput.value.trim();
    if (inputName.length < 3) {
        usernameError.textContent = "Username must be at least 3 characters.";
        return;
    }
    usernameError.textContent = "Checking availability...";
    saveUsernameBtn.disabled = true;

    const usersRef = collection(db, `artifacts/${appId}/public/data/registered_users`);
    const q = query(usersRef, where("username", "==", inputName));
    try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            usernameError.textContent = "Username already taken.";
            saveUsernameBtn.disabled = false;
            return;
        }
        const userDocRef = doc(db, `artifacts/${appId}/public/data/registered_users/${userId}`);
        await setDoc(userDocRef, {
            username: inputName,
            userId: userId,
            score: 0,
            createdAt: serverTimestamp()
        });
        localPlayerName = inputName;
        usernameError.textContent = "";
        initGame();
    } catch (e) {
        console.error("Error saving username:", e);
        usernameError.textContent = "Error saving. Try again.";
        saveUsernameBtn.disabled = false;
    }
}

function showHelpScreen() {
    startScreen.classList.add('hidden');
    helpScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    updateAllText();
}
function hideHelpScreen() {
    startScreen.classList.remove('hidden');
    helpScreen.classList.add('hidden');
    mainTitle.classList.remove('hidden');
    updateAllText();
}
function showAiSelectionScreen() {
    playBgMusic();
    gameMode = 'ai';
    startScreen.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    prevPokemonButton.classList.remove('hidden');
    nextPokemonButton.classList.remove('hidden');
    pokemonCardDisplay.classList.remove('hidden');
    selectionTitle.textContent = getText('selection_title');
    waitingForOpponentSelection.classList.add('hidden');
    renderCurrentPokemonCard();
    updateAllText();
}
function showLobbyScreen() {
    playBgMusic();
    gameMode = 'multiplayer';
    startScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    updateAllText();
}
function leaveLobby() {
    initGame(); 
}

function renderCurrentPokemonCard() {
    const pokemon = POKEMON_DATA[currentLanguage][currentSelectionIndex];
    const basePokemon = POKEMON_DATA['en'][currentSelectionIndex];
    pokemonCardDisplay.innerHTML = `
        <div id="pokemon-card-clickable" class="pokemon-card w-full max-w-[300px] mx-auto p-4 rounded-lg border-4 shadow-lg cursor-pointer type-${basePokemon.type}-bg type-${basePokemon.type}-border">
            <h3 class="text-xl md:text-2xl font-bold text-center mb-3 type-${basePokemon.type}-text">${pokemon.name}</h3>
            <img src="${basePokemon.image}" alt="${pokemon.name}" class="w-40 h-40 md:w-48 md:h-48 object-cover rounded-lg mx-auto mb-3 border-2 border-black/20"
                 onerror="this.src='https://placehold.co/192x192/${basePokemon.type === 'electric' ? 'FFEB3B/333' : 'EFEFEF/333'}?text=${pokemon.name}&font=press-start-2p'; this.onerror=null;">
            <div class="grid grid-cols-2 gap-2 text-xs md:text-sm">
                ${pokemon.attacks.map(attack => `
                    <span class="block p-2 rounded text-center ${attack.type === 'heavy' ? 'bg-red-800 text-yellow-300' : (attack.type === 'medium' ? 'bg-blue-800' : 'bg-black/30')} type-${basePokemon.type}-text">
                        ${attack.name}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
    const cardElement = document.getElementById('pokemon-card-clickable');
    if (cardElement) {
        cardElement.addEventListener('click', () => selectPokemon(basePokemon.id));
    }
}
function showPrevPokemon() {
    currentSelectionIndex = (currentSelectionIndex - 1 + POKEMON_DATA[currentLanguage].length) % POKEMON_DATA[currentLanguage].length;
    renderCurrentPokemonCard();
}
function showNextPokemon() {
    currentSelectionIndex = (currentSelectionIndex + 1) % POKEMON_DATA[currentLanguage].length;
    renderCurrentPokemonCard();
}
async function selectPokemon(id) {
    const basePokemon = POKEMON_DATA['en'].find(p => p.id === id);
    playerPokemon = JSON.parse(JSON.stringify(basePokemon));
    playerPokemon.instanceId = `${localPlayerRole}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (gameMode === 'ai') {
        let aiIndex = Math.floor(Math.random() * POKEMON_DATA['en'].length);
        while (aiIndex === currentSelectionIndex) {
            aiIndex = Math.floor(Math.random() * POKEMON_DATA['en'].length);
        }
        const baseAiPokemon = POKEMON_DATA['en'][aiIndex];
        opponentPokemon = JSON.parse(JSON.stringify(baseAiPokemon));
        startBattle();
    } else {
        try {
            await updateDoc(gameDocRef, {
                [`${localPlayerRole}.pokemon`]: playerPokemon,
                [`${localPlayerRole}.pokemonId`]: id,
                [`${localPlayerRole}.ready`]: true
            });
            prevPokemonButton.classList.add('hidden');
            nextPokemonButton.classList.add('hidden');
            pokemonCardDisplay.classList.add('hidden');
            selectionTitle.textContent = getText('selection_title');
            waitingForOpponentSelection.classList.remove('hidden');
        } catch (e) {
            console.error("Error selecting Pokemon:", e);
        }
    }
}

async function initFirebase() {
    try {
        appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const config = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
        app = initializeApp(config);
        db = getFirestore(app);
        auth = getAuth(app);
        setLogLevel('debug');
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
        } else {
            await signInAnonymously(auth);
        }
        onAuthStateChanged(auth, (user) => {
            if (user) {
                userId = user.uid;
                playerUserId.textContent = userId;
                console.log("Firebase Auth Ready. UserID:", userId);
                checkUserProfile(); 
            } else {
                console.log("Firebase Auth: No user.");
                userId = null;
            }
        });
    } catch (e) {
        console.error("Error initializing Firebase:", e);
        playFriendButton.textContent = 'Multiplayer Disabled';
        playFriendButton.disabled = true;
    }
}
async function createGame() {
    createGameButton.disabled = true;
    joinGameButton.disabled = true;
    gameIdInput.disabled = true;
    lobbyErrorMsg.textContent = '';
    const gamesCollection = collection(db, `artifacts/${appId}/public/data/games`);
    try {
        const newGameDoc = doc(gamesCollection);
        gameId = newGameDoc.id;
        const player1Data = {
            hp: 100,
            pokemon: null,
            pokemonId: null,
            ready: false,
            username: localPlayerName 
        };
        const gameData = {
            player1: player1Data,
            player2: null,
            gameState: 'waiting',
            currentTurn: 1,
            winner: null,
            log: [getText('log_welcome')],
            createdAt: serverTimestamp(),
            lastAction: serverTimestamp()
        };
        await setDoc(newGameDoc, gameData);
        gameDocRef = newGameDoc;
        localPlayerRole = 'player1';
        gameIdText.textContent = gameId;
        gameIdDisplay.classList.remove('hidden');
        waitingForPlayerMsg.classList.remove('hidden');
        listenToGame();
    } catch (e) {
        console.error("Error creating game:", e);
        lobbyErrorMsg.textContent = getText('lobby_error_creating');
        createGameButton.disabled = false;
        joinGameButton.disabled = false;
        gameIdInput.disabled = false;
    }
}
async function joinGame() {
    gameId = gameIdInput.value.trim();
    if (!gameId) return;
    createGameButton.disabled = true;
    joinGameButton.disabled = true;
    gameIdInput.disabled = true;
    lobbyErrorMsg.textContent = '';
    const gameRef = doc(db, `artifacts/${appId}/public/data/games/${gameId}`);
    try {
        const gameSnap = await getDoc(gameRef);
        if (!gameSnap.exists()) throw new Error("Game not found");
        const gameData = gameSnap.data();
        if (isEventGame) {
             // Redundant check, but safe
            if (gameData.player1 && gameData.player1.username === localPlayerName) localPlayerRole = 'player1';
            else if (gameData.player2 && gameData.player2.username === localPlayerName) localPlayerRole = 'player2';
            else throw new Error("You are not assigned to this match!");
            gameDocRef = gameRef;
            listenToGame();
            return; 
        }
        if (gameData.player2) throw new Error("Game is full");
        const player2Data = {
            hp: 100,
            pokemon: null,
            pokemonId: null,
            ready: false,
            username: localPlayerName 
        };
        await updateDoc(gameRef, {
            player2: player2Data,
            gameState: 'selection',
            log: arrayUnion(`${localPlayerName} has joined!`)
        });
        gameDocRef = gameRef;
        localPlayerRole = 'player2';
        listenToGame();
    } catch (e) {
        console.error("Error joining game:", e);
        lobbyErrorMsg.textContent = getText('lobby_error_joining') + " " + e.message;
        createGameButton.disabled = false;
        joinGameButton.disabled = false;
        gameIdInput.disabled = false;
    }
}
function listenToGame() {
    if (gameUnsubscribe) gameUnsubscribe();
    gameUnsubscribe = onSnapshot(gameDocRef, (doc) => {
        if (!doc.exists()) {
            if (gameInProgress) {
                logMessage(getText('log_opponent_forfeit'));
                showVictoryScreen(playerPokemon, 'victory');
            } else {
                initGame();
            }
            return;
        }
        const gameData = doc.data();
        if (gameData.isEvent) isEventGame = true;
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';
        currentTurn = gameData.currentTurn;
        if (gameData[opponentRole] && gameData[opponentRole].username) {
            opponentPlayerName = gameData[opponentRole].username;
        }
        if (gameData[localPlayerRole]) playerHP = gameData[localPlayerRole].hp;
        if (gameData[opponentRole]) {
            opponentHP = gameData[opponentRole].hp;
            opponentPokemon = gameData[opponentRole].pokemon;
        }
        if (gameData.log && battleLog) {
            const logLength = battleLog.children.length;
            if (gameData.log.length > logLength || (logLength === 1 && battleLog.children[0].id === 'battle-log-start')) {
                battleLog.innerHTML = '';
                gameData.log.forEach(msg => logMessage(msg));
            }
        }
        switch (gameData.gameState) {
            case 'waiting':
                lobbyScreen.classList.remove('hidden');
                selectionScreen.classList.add('hidden');
                waitingForPlayerMsg.classList.remove('hidden');
                break;
            case 'selection':
                lobbyScreen.classList.add('hidden');
                selectionScreen.classList.remove('hidden');
                mainTitle.classList.add('hidden');
                if (gameData[localPlayerRole] && gameData[localPlayerRole].ready) {
                    prevPokemonButton.classList.add('hidden');
                    nextPokemonButton.classList.add('hidden');
                    pokemonCardDisplay.classList.add('hidden');
                    selectionTitle.textContent = getText('selection_title');
                    waitingForOpponentSelection.classList.remove('hidden');
                } else {
                    prevPokemonButton.classList.remove('hidden');
                    nextPokemonButton.classList.remove('hidden');
                    pokemonCardDisplay.classList.remove('hidden');
                    selectionTitle.textContent = getText('selection_title');
                    waitingForOpponentSelection.classList.add('hidden');
                    renderCurrentPokemonCard();
                }
                if (gameData.player1.ready && gameData.player2.ready) {
                    playerPokemon = gameData[localPlayerRole].pokemon;
                    opponentPokemon = gameData[opponentRole].pokemon;
                    if (localPlayerRole === 'player1' && !gameInProgress) {
                        updateDoc(gameDocRef, {
                            gameState: 'player1_turn',
                            log: arrayUnion(getText('log_player_chose', gameData.player1.pokemon.name), getText('log_opponent_chose', gameData.player2.pokemon.name), getText('log_battle_begin'))
                        });
                    }
                    if (!gameInProgress) startBattle();
                }
                break;
            case 'player1_turn':
                isPlayerTurn = (localPlayerRole === 'player1');
                if (gameInProgress) updateUI();
                break;
            case 'player2_turn':
                isPlayerTurn = (localPlayerRole === 'player2');
                if (gameInProgress) updateUI();
                break;
            case 'game_over':
                if (!gameInProgress) return;
                gameInProgress = false;
                if (gameData.winner === localPlayerRole) {
                    showVictoryScreen(playerPokemon, 'victory');
                } else if (gameData.winner === opponentRole) {
                    showVictoryScreen(opponentPokemon, 'defeat');
                } else {
                    showVictoryScreen(null, 'draw');
                }
                break;
        }
    }, (error) => {
        console.error("Error in game listener:", error);
    });
}
function startBattle() {
    gameInProgress = true;
    selectionScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    battleScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    endGameButton.textContent = getText('end_game');
    endGameButton.classList.remove('hidden');
    const playerLangData = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id);
    const opponentLangData = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id);
    if (gameMode === 'multiplayer') {
    } else {
        opponentPlayerName = 'AI';
    }
    playerUsernameEl.textContent = localPlayerName;
    playerUsernameEl.className = `text-sm md:text-lg font-bold text-center md:text-left truncate type-${playerPokemon.type}-text`;
    playerPokemonName.textContent = playerLangData.name;
    playerPokemonImg.src = playerPokemon.image;
    playerPokemonName.className = `text-[0.625rem] md:text-base font-normal leading-tight text-center md:text-left type-${playerPokemon.type}-text`;
    playerBox.className = `p-1 md:p-4 rounded-lg border-2 shadow-md type-${playerPokemon.type}-bg type-${playerPokemon.type}-border`;
    opponentUsernameEl.textContent = opponentPlayerName;
    opponentUsernameEl.className = `text-sm md:text-lg font-bold text-center md:text-left truncate type-${opponentPokemon.type}-text`;
    opponentPokemonName.textContent = opponentLangData.name; 
    opponentPokemonImg.src = opponentPokemon.image;
    opponentPokemonName.className = `text-[0.625rem] md:text-base font-normal leading-tight text-center md:text-left type-${opponentPokemon.type}-text`;
    opponentBox.className = `p-1 md:p-4 rounded-lg border-2 shadow-md type-${opponentPokemon.type}-bg type-${opponentPokemon.type}-border`;
    createAttackButtons();
    if (gameMode === 'ai') {
        battleLog.innerHTML = '';
        logMessage(getText('log_player_chose', playerLangData.name));
        logMessage(getText('log_ai_chose', opponentLangData.name));
        logMessage(getText('log_battle_begin'));
    }
    yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');
    battleLogTitle.textContent = getText('battle_log');
    updateUI();
}
function createAttackButtons() {
    playerControls.innerHTML = '';
    if (!playerPokemon) return;
    const playerLangData = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id);
    playerLangData.attacks.forEach((attack, index) => {
        const baseAttack = playerPokemon.attacks[index];
        const button = document.createElement('button');
        button.textContent = attack.name;
        button.className = `retro-btn !leading-tight !px-2 !pt-2 !pb-3 md:!p-4 attack-btn type-${playerPokemon.type}-btn w-full`;
        if (baseAttack.type === 'heavy') {
            button.id = 'heavy-attack-btn';
            button.classList.add('heavy-attack-disabled');
            button.classList.remove(`type-${playerPokemon.type}-btn`);
        }
        button.addEventListener('click', () => playerAttack(index));
        playerControls.appendChild(button);
    });
    updateUI();
}
function getMissChance(attack) {
    if (attack.type === 'medium') return 0.7;
    return 0.4;
}
async function playerAttack(attackIndex) {
    if (!isPlayerTurn || !gameInProgress) return;
    const attack = playerPokemon.attacks[attackIndex];
    const attackName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).attacks[attackIndex].name;
    const pokemonName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name;
    if (attack.type === 'heavy' && playerHP >= 50) {
        logMessage(getText('log_heavy_fail', attackName));
        if (gameMode === 'multiplayer') {
             await updateDoc(gameDocRef, { log: arrayUnion(getText('log_heavy_fail', attackName)) });
        }
        return; 
    }
    isPlayerTurn = false;
    updateUI(); 
    animateAttack(playerPokemonImg, true);
    const missChance = getMissChance(attack);
    const missReasons = MISS_MESSAGES[currentLanguage];
    let damage = 0;
    let didMiss = false;
    let missReason = '';
    if (Math.random() < missChance) {
        didMiss = true;
        missReason = missReasons[Math.floor(Math.random() * missReasons.length)];
    } else {
        damage = attack.damage;
    }
    if (gameMode === 'ai') {
        logMessage(getText('log_player_command', pokemonName, attackName));
        if (didMiss) {
            logMessage(getText('log_miss', missReason));
        } else {
            opponentHP = Math.max(0, opponentHP - damage);
            logMessage(getText('log_hit', attackName, damage));
            animateDamage(opponentPokemonImg);
        }
        updateUI();
        if (checkGameOver()) return;
        setTimeout(aiTurn, 1500);
    } else {
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';
        const newOpponentHP = Math.max(0, opponentHP - damage);
        const nextTurn = currentTurn + 1;
        const logMessages = [getText('log_player_command', pokemonName, attackName)];
        if (didMiss) {
            logMessages.push(getText('log_miss', missReason));
        } else {
            logMessages.push(getText('log_hit', attackName, damage));
        }
        const updateData = {
            currentTurn: nextTurn,
            gameState: `${opponentRole}_turn`,
            [`${opponentRole}.hp`]: newOpponentHP,
            log: arrayUnion(...logMessages),
            lastAction: serverTimestamp()
        };
        let gameOver = false;
        const opponentLangName = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id).name;
        if (newOpponentHP <= 0) {
            updateData.gameState = 'game_over';
            updateData.winner = localPlayerRole;
            logMessages.push(getText('log_opponent_fainted', opponentLangName));
            updateData.log = arrayUnion(...logMessages);
            gameOver = true;
        } else if (nextTurn > MAX_TURNS) {
            updateData.gameState = 'game_over';
            logMessages.push(getText('log_times_up'));
            if (playerHP > newOpponentHP) {
                updateData.winner = localPlayerRole;
                logMessages.push(getText('log_player_hp_win'));
            } else if (newOpponentHP > playerHP) {
                updateData.winner = opponentRole;
                logMessages.push(getText('log_opponent_hp_win'));
            } else {
                updateData.winner = 'draw';
                logMessages.push(getText('log_draw'));
            }
            updateData.log = arrayUnion(...logMessages);
            gameOver = true;
        }
        updateDoc(gameDocRef, updateData).catch(e => console.error("Error during attack:", e));
    }
}
function aiTurn() {
    if (!gameInProgress || gameMode !== 'ai') return;
    const { attack, attackName, pokemonName } = getAiAttack();
    animateAttack(opponentPokemonImg, false);
    logMessage(getText('log_ai_attack', pokemonName, attackName));
    const missChance = getMissChance(attack);
    const missReasons = MISS_MESSAGES[currentLanguage];
    if (Math.random() < missChance) {
        logMessage(getText('log_miss', missReasons[Math.floor(Math.random() * missReasons.length)]));
    } else {
        const damage = attack.damage;
        playerHP = Math.max(0, playerHP - damage);
        logMessage(getText('log_hit', attackName, damage));
        animateDamage(playerPokemonImg);
    }
    currentTurn++;
    isPlayerTurn = true;
    updateUI();
    checkGameOver();
}
function getAiAttack() {
    const attacks = opponentPokemon.attacks;
    const heavyAttack = attacks.find(a => a.type === 'heavy');
    const mediumAttack = attacks.find(a => a.type === 'medium');
    const basicAttacks = attacks.filter(a => a.damage === 20);
    const aiLangData = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id);
    const pokemonName = aiLangData.name;
    let chosenAttack = null;
    if (heavyAttack && opponentHP < 50 && Math.random() < 0.75) {
        logMessage(getText('log_ai_focus', pokemonName));
        chosenAttack = heavyAttack;
    }
    else if (playerHP <= 40) {
        chosenAttack = (heavyAttack && opponentHP < 50) ? heavyAttack : (mediumAttack || basicAttacks[0]);
    }
    else if (playerHP <= 20) {
        chosenAttack = mediumAttack || basicAttacks[0];
    }
    else {
        const randomChoice = Math.random();
        if (mediumAttack && randomChoice < 0.4) {
            chosenAttack = mediumAttack;
        } else if (randomChoice < 0.7) {
            chosenAttack = basicAttacks[0];
        } else {
            chosenAttack = basicAttacks[1] || basicAttacks[0];
        }
    }
    if (!chosenAttack) {
        chosenAttack = basicAttacks[Math.floor(Math.random() * basicAttacks.length)];
    }
    const attackIndex = attacks.findIndex(a => a.name === chosenAttack.name);
    const attackName = aiLangData.attacks[attackIndex].name;
    return { attack: chosenAttack, attackName, pokemonName };
}
function checkGameOver() {
    if (gameMode !== 'ai' || !gameInProgress) return true;
    const playerLangName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name;
    const aiLangName = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id).name;
    if (opponentHP <= 0) {
        logMessage(getText('log_ai_fainted', aiLangName));
        showVictoryScreen(playerPokemon, 'victory'); 
        return true;
    }
    if (playerHP <= 0) {
        logMessage(getText('log_player_fainted', playerLangName));
        showVictoryScreen(opponentPokemon, 'defeat'); 
        return true;
    }
    if (currentTurn > MAX_TURNS) {
        logMessage(getText('log_times_up'));
        if (playerHP > opponentHP) {
            logMessage(getText('log_player_hp_win'));
            showVictoryScreen(playerPokemon, 'victory');
        } else if (opponentHP > playerHP) {
            logMessage(getText('log_ai_hp_win'));
            showVictoryScreen(opponentPokemon, 'defeat');
        } else {
            logMessage(getText('log_draw'));
            showVictoryScreen(null, 'draw');
        }
        return true;
    }
    return false;
}
function updateUI() {
    playerHpText.textContent = getText('hp_text', playerHP, 100);
    opponentHpText.textContent = getText('hp_text', opponentHP, 100);
    updateHpBar(playerHpBar, playerHP);
    updateHpBar(opponentHpBar, opponentHP);
    turnCounter.textContent = getText('turn_counter', Math.min(Math.ceil(currentTurn / 2), MAX_TURNS / 2), MAX_TURNS / 2);
    yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');
    const heavyBtn = document.getElementById('heavy-attack-btn');
    if (heavyBtn) {
        if (playerHP < 50) {
            heavyBtn.classList.remove('heavy-attack-disabled');
            heavyBtn.classList.add('heavy-attack-ready');
            heavyBtn.disabled = false;
        } else {
            heavyBtn.classList.add('heavy-attack-disabled');
            heavyBtn.classList.remove('heavy-attack-ready');
            heavyBtn.disabled = true;
        }
    }
    playerControls.querySelectorAll('button').forEach(btn => {
        if (!isPlayerTurn || !gameInProgress) {
            btn.disabled = true;
        } 
        else if (btn.id !== 'heavy-attack-btn') {
            btn.disabled = false;
        } 
        else if (btn.id === 'heavy-attack-btn') {
             btn.disabled = (playerHP >= 50);
        }
    });
}
function updateHpBar(barElement, currentHp) {
    if (!barElement) return;
    const hpPercent = currentHp / 100;
    barElement.style.width = `${currentHp}%`;
    const backgroundPosition = 100 - (hpPercent * 100);
    barElement.style.backgroundPosition = `${backgroundPosition}% 50%`;
}
function showVictoryScreen(winner, messageKey) {
    gameInProgress = false;
    logReviewContent.innerHTML = battleLog.innerHTML;
    logReviewContent.scrollTop = logReviewContent.scrollHeight;
    endGameButton.classList.add('hidden');
    victoryScreen.dataset.result = messageKey;
    victoryText.textContent = '';
    if (winner) {
        winnerImg.src = winner.image.includes('placehold.co') ? winner.image.replace('150x150', '320x320') : winner.image;
        winnerImg.className = `w-full h-full object-cover rounded-full shadow-lg border-8 type-${winner.type}-border`;
    } else {
        winnerImg.src = 'https://placehold.co/320x320/EFEFEF/333?text=DRAW';
        winnerImg.className = 'w-full h-full object-cover rounded-full shadow-lg border-8 border-gray-500';
    }
    if (messageKey === 'victory') {
        victoryText.textContent = getText('victory', localPlayerName || 'Player');
        victoryText.className = 'victory-text-base victory-text-win';
        if (gameMode === 'multiplayer' || isEventGame) {
            incrementUserScore();
        }
    } else if (messageKey === 'defeat') {
        victoryText.textContent = getText('defeat', opponentPlayerName || 'Opponent');
        victoryText.className = 'victory-text-base victory-text-lose';
    } else {
        victoryText.textContent = getText('draw');
        victoryText.className = 'victory-text-base victory-text-draw';
    }
    restartButton.textContent = getText('play_again');
    showLogButton.textContent = getText('view_log');
    if (gameUnsubscribe) {
        gameUnsubscribe();
        gameUnsubscribe = null;
    }
    if (gameDocRef && localPlayerRole === 'player1') {
        setTimeout(() => {
            deleteDoc(gameDocRef).catch(e => console.error("Error cleaning up game", e));
            gameDocRef = null;
            gameId = null;
        }, 10000); 
    }
    setTimeout(() => {
        battleScreen.classList.add('hidden');
        victoryScreen.classList.remove('hidden');
        mainTitle.classList.add('hidden');
    }, 1000);
}
function logMessage(message, forceClear = false) {
    if (forceClear) {
        battleLog.innerHTML = '';
    }
    const p = document.createElement('p');
    p.textContent = message;
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
}
async function endGame() {
    if (!gameInProgress) return; 
    if (gameMode === 'ai') {
        gameInProgress = false; 
        logMessage(getText('log_forfeit'));
        setTimeout(() => {
            showVictoryScreen(opponentPokemon, 'defeat');
        }, 500);
    } else {
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';
        await updateDoc(gameDocRef, {
            gameState: 'game_over',
            winner: opponentRole,
            log: arrayUnion(getText('log_forfeit'))
        });
    }
    updateUI();
}
function animateDamage(imgElement) {
    if(!imgElement) return;
    imgElement.classList.add('taking-damage');
    setTimeout(() => {
        imgElement.classList.remove('taking-damage');
    }, 300);
}
function animateAttack(imgElement, isPlayer) {
    if(!imgElement) return;
    const attackClass = isPlayer ? 'attacking' : 'opponent-attacking';
    imgElement.classList.add(attackClass);
    setTimeout(() => {
        imgElement.classList.remove(attackClass);
    }, 200);
}

function initEventListeners() {
    restartButton.addEventListener('click', initGame);
    endGameButton.addEventListener('click', endGame);
    playAiButton.addEventListener('click', showAiSelectionScreen);
    playFriendButton.addEventListener('click', showLobbyScreen);
    
    // NEW EVENT LISTENERS
    eventBattleBtn.addEventListener('click', showEventBattleScreen);
    eventBackBtn.addEventListener('click', hideEventBattleScreen);
    eventConfirmSignInBtn.addEventListener('click', signUserIntoEvent);

    leaderboardBtn.addEventListener('click', showLeaderboard);
    leaderboardBackBtn.addEventListener('click', hideLeaderboard);

    helpButton.addEventListener('click', showHelpScreen);
    helpBackButton.addEventListener('click', hideHelpScreen);
    prevPokemonButton.addEventListener('click', showPrevPokemon);
    nextPokemonButton.addEventListener('click', showNextPokemon);
    languageToggleButton.addEventListener('click', toggleLanguage);
    createGameButton.addEventListener('click', createGame);
    joinGameButton.addEventListener('click', joinGame);
    lobbyBackButton.addEventListener('click', leaveLobby);
    saveUsernameBtn.addEventListener('click', handleSaveUsername);

    showLogButton.addEventListener('click', () => {
        logReviewOverlay.classList.remove('hidden');
        logReviewTitle.textContent = getText('log_review_title');
        closeLogButton.textContent = getText('help_back');
        logReviewContent.scrollTop = logReviewContent.scrollHeight;
    });
    closeLogButton.addEventListener('click', () => {
        logReviewOverlay.classList.add('hidden');
    });
}
initDomElements();
initEventListeners();
initFirebase();

