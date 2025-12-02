// --- FIREBASE IMPORTS ---
// FIX: Added all Firebase imports directly to this file
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    onSnapshot, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp,
    arrayUnion,
    setLogLevel,
    collection // FIX: Added the missing import for collection()
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- FIREBASE CONFIG ---
// User-provided config (as fallback)
const firebaseConfig = {
  apiKey: "AIzaSyBu05x09GesEm9zSwrnzQbN2SV03q3xF-0",
  authDomain: "re-fight.firebaseapp.com",
  projectId: "re-fight",
  storageBucket: "re-fight.firebasestorage.app",
  messagingSenderId: "192047188516",
  appId: "1:192047188516:web:1d10ba434ebc33359c66b1",
  measurementId: "G-RC3WBTFK5J"
};

// --- TRANSLATION DATA ---
const UI_TEXT = {
    'en': {
        'title_battle': '(re)Pokémon Battle',
        'title_choose': 'Choose Your Pokémon!',
        'play_ai': 'Play With AI',
        'play_friend': 'Play With Friend',
        'maintenance': 'Under Maintenance',
        'your_turn': 'Your Turn!',
        'opponents_turn': "Opponent's Turn", // NEW
        'battle_log': 'Battle Log',
        'turn_counter': (current, max) => `Turn: ${current} / ${max}`,
        'log_welcome': 'Welcome! Choose your Pokémon to begin.',
        'log_player_chose': (name) => `You chose ${name}!`,
        'log_ai_chose': (name) => `The AI chose ${name}!`,
        'log_opponent_chose': (name) => `Opponent chose ${name}!`, // NEW
        'log_battle_begin': 'Let the battle begin!',
        'log_player_command': (pokemon, attack) => `You commanded ${pokemon} to use ${attack}!`,
        'log_opponent_command': (pokemon, attack) => `Opponent's ${pokemon} uses ${attack}!`, // NEW
        'log_miss': (reason) => `...but ${reason}`,
        'log_hit': (attack, damage) => `${attack} hit! It dealt ${damage} damage.`,
        'log_ai_attack': (pokemon, attack) => `The AI's ${pokemon} uses ${attack}!`,
        'log_heavy_fail': (attack) => `You can't use ${attack} with more than 50 HP!`,
        'log_ai_focus': (pokemon) => `The AI's ${pokemon} is focusing its power!`,
        'log_ai_fainted': (pokemon) => `The AI's ${pokemon} fainted!`,
        'log_player_fainted': (pokemon) => `Your ${pokemon} fainted!`,
        'log_opponent_fainted': (pokemon) => `Opponent's ${pokemon} fainted!`, // NEW
        'log_times_up': "The battle is over! Time's up!",
        'log_player_hp_win': 'You have more HP! You win!',
        'log_ai_hp_win': 'The AI has more HP! You lose.',
        'log_opponent_hp_win': 'Opponent has more HP! You lose.', // NEW
        'log_draw': "It's a draw!",
        'log_forfeit': 'You forfeited the match!',
        'log_opponent_forfeit': 'Opponent forfeited the match!', // NEW
        'hp_text': (current, max) => `HP: ${current}/${max}`,
        'victory': (name) => `${name} WINS!`, // UPDATED
        'defeat': (name) => `${name} WINS...`, // UPDATED
        'draw': "IT'S A DRAW!",
        'play_again': 'Play Again',
        'end_game': 'End Game',
        'help': 'Help',
        'help_title': 'How to Play',
        'help_rule_1': 'Attacks have different power levels (Basic ~20, Medium ~30-40, Heavy ~50-60).',
        // UPDATED Rule 2 to reflect new logic
        'help_rule_2': 'Basic/Heavy attacks have 40% miss chance. Medium attacks have 70% miss chance.',
        'help_rule_3': 'Heavy Attacks (e.g., Volt Tackle) can ONLY be used when your HP is less than 50 (49 or less)!',
        'help_back': 'Back',
        'view_log': 'View Final Log',
        'log_review_title': 'Final Battle Log',
        'lobby_title': 'Multiplayer Lobby', // NEW
        'your_user_id': 'Your User ID:', // NEW
        'create_game': 'Create Game', // NEW
        'lobby_or': '--- OR ---', // NEW
        'join_game': 'Join Game', // NEW
        'game_id_placeholder': 'Enter Game ID...', // NEW
        'lobby_error_joining': 'Error: Could not find game or game is full.', // NEW
        'lobby_error_creating': 'Error: Could not create game.', // NEW
        'waiting_for_player': 'Waiting for opponent to join...', // NEW
        'game_id_label': 'Share Game ID:', // NEW
        'lobby_back': 'Back to Menu', // NEW
        'selection_title': 'Choose Your Pokémon!', // NEW
        'waiting_for_opponent_selection': 'Waiting for opponent to choose...', // NEW
        'player1_name': 'Player 1', // NEW
        'player2_name': 'Player 2', // NEW
        // REVERTED: Removed Username text
    },
    'ja': {
        'title_battle': 'ポケモンバトル',
        'title_choose': 'ポケモンをえらんでね！',
        'play_ai': 'AIとたいせん',
        'play_friend': 'ともだちとたいせん',
        'maintenance': 'メンテナンスちゅう',
        'your_turn': 'あなたのターン！',
        'opponents_turn': "あいてのターン", // NEW
        'battle_log': 'バトルログ',
        'turn_counter': (current, max) => `ターン: ${current} / ${max}`,
        'log_welcome': 'ようこそ！ポケモンをえらんでね。',
        'log_player_chose': (name) => `あなたは ${name} をえらんだ！`,
        'log_ai_chose': (name) => `AIは ${name} をえらんだ！`,
        'log_opponent_chose': (name) => `あいては ${name} をえらんだ！`, // NEW
        'log_battle_begin': 'バトルかいし！',
        'log_player_command': (pokemon, attack) => `いけっ ${pokemon}！ ${attack}！`,
        'log_opponent_command': (pokemon, attack) => `あいての ${pokemon} は ${attack} をつかった！`, // NEW
        'log_miss': (reason) => `...しかし ${reason}`,
        'log_hit': (attack, damage) => `${attack} があたった！ ${damage} のダメージ。`,
        'log_ai_attack': (pokemon, attack) => `AIの ${pokemon} は ${attack} をつかった！`,
        'log_heavy_fail': (attack) => `HPが50いじょうのときは ${attack} はつかえない！`, // Corrected logic
        'log_ai_focus': (pokemon) => `AIの ${pokemon} はちからをためている！`,
        'log_ai_fainted': (pokemon) => `AIの ${pokemon} はたおれた！`,
        'log_player_fainted': (pokemon) => `あなたの ${pokemon} はたおれた！`,
        'log_opponent_fainted': (pokemon) => `あいての ${pokemon} はたおれた！`, // NEW
        'log_times_up': 'バトルしゅうりょう！ じかんぎれ！',
        'log_player_hp_win': 'あなたのHPがおおい！ あなたの勝ち！',
        'log_ai_hp_win': 'AIのHPがおおい！ あなたのまけ。',
        'log_opponent_hp_win': 'あいてのHPがおおい！ あなたのまけ。', // Fixed typo
        'log_draw': 'ひきわけ！',
        'log_forfeit': 'しょうぶをあきらめた！',
        'log_opponent_forfeit': 'あいてが しょうぶを あきらめた！', // NEW
        'hp_text': (current, max) => `HP: ${current}/${max}`,
        'victory': (name) => `${name} の しょうり！`, // UPDATED
        'defeat': (name) => `${name} の しょうり...`, // UPDATED
        'draw': 'ひきわけ',
        'play_again': 'もういっかい',
        'end_game': 'おわる',
        'help': 'ヘルプ',
        'help_title': 'あそびかた',
        'help_rule_1': 'こうげきには いろいろな いりょくが あるよ (じゃく: ~20, ちゅう: ~30-40, きょう: ~50-60)。',
        // UPDATED Rule 2 to reflect new logic
        'help_rule_2': '「じゃく」/「きょう」こうげきは 40%はずれる。「ちゅう」こうげきは 70%はずれる。',
        'help_rule_3': '「きょう」こうげき (ボルテッカーなど) は、じぶんのHPが 50みまん (49いか) のときだけ つかえる！',
        'help_back': 'もどる',
        'view_log': 'さいしゅうログ',
        'log_review_title': 'さいしゅうバトルログ',
        'lobby_title': 'マルチプレイ ロビー', // NEW
        'your_user_id': 'あなたのID:', // NEW
        'create_game': 'ゲームを つくる', // NEW
        'lobby_or': '--- または ---', // NEW
        'join_game': 'ゲームに はいる', // NEW
        'game_id_placeholder': 'ゲームIDを にゅうりょく...', // NEW
        'lobby_error_joining': 'エラー: ゲームが みつからないか、まんいんです。', // NEW
        'lobby_error_creating': 'エラー: ゲームを つくれませんでした。', // NEW
        'waiting_for_player': 'あいてを まっています...', // NEW
        'game_id_label': 'ゲームIDを おしえてね:', // NEW
        'lobby_back': 'メニューへ もどる', // NEW
        'selection_title': 'ポケモンをえらんでね！', // NEW
        'waiting_for_opponent_selection': 'あいてが えらぶのを まっています...', // NEW
        'player1_name': 'プレイヤー1', // NEW
        'player2_name': 'プレイヤー2', // NEW
        // REVERTED: Removed Username text
    }
};

// --- MISS_MESSAGES ---
const MISS_MESSAGES = {
    'en': [
        "its brain momentarily believed it was JMike the Pirate and went searching for buried treasure.", // FIX: it's -> its
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
        "It briefly forgot the task because it was trying to imitate the deep, thoughtful gaze of Croket the Frog.", // FIX: Corrected "I was" to "it was"
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
        "クロケット・ザ・フロッグの あまりにも かんぺきな みどりいろに、こころのなかで ハイタッチするしか なかった。", // FIX: Corrected typo
        "クロケット・ザ・フロッグの ふかく ものおもいに ふける まなざしを マネしようとして、タスクを わすれた。",
        "チャズのせいだ。かれが ちいさな いちりんしゃに のっている すがたを そうぞうしたら、むしできなかった。"
    ]
};


// --- DATA ---
const POKEMON_DATA = {
    'en': [
        { id: 1, name: 'Pika(re)', type: 'electric', 
          // FIX: Replaced placeholder with local pika.png
          image: './pika.png', 
          attacks: [
            { name: 'Quick Attack', damage: 20 },
            { name: 'Thunder Shock', damage: 20 },
            { name: 'Thunder Bolt', damage: 30, type: 'medium' }, // NEW type
            { name: 'Volt Tackle', damage: 50, type: 'heavy' }
        ]},
        { id: 2, name: '(re)mander', type: 'fire', 
          // FIX: Replaced placeholder with local char.png
          image: './char.png', 
          attacks: [
            { name: 'Scratch', damage: 20 },
            { name: 'Ember', damage: 20 },
            { name: 'Flamethrower', damage: 30, type: 'medium' }, // NEW type
            { name: 'Flare Blitz', damage: 50, type: 'heavy' }
        ]},
        { id: 3, name: 'Squi(re)tle', type: 'water', 
          // FIX: Replaced placeholder with local squirtle.png
          image: './squirtle.png', 
          attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Bubble', damage: 20 },
            { name: 'Water Gun', damage: 40, type: 'medium' }, // NEW type
            { name: 'Hydro Pump', damage: 60, type: 'heavy' }
        ]},
        { id: 4, name: 'Bulbasau(re)', type: 'grass', 
          // FIX: Replaced placeholder with local bulba.png
          image: './bulba.png', 
          attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Vine Whip', damage: 20 },
            { name: 'Razor Leaf', damage: 30, type: 'medium' }, // NEW type
            { name: 'Solar Beam', damage: 50, type: 'heavy' }
        ]},
        { id: 5, name: '(re)evee', type: 'normal', 
          // FIX: Replaced placeholder with local eevie.png
          image: './eevie.png', 
          attacks: [
            { name: 'Tackle', damage: 20 },
            { name: 'Quick Attack', damage: 20 },
            { name: 'Swift', damage: 40, type: 'medium' }, // NEW type
            { name: 'Last Resort', damage: 60, type: 'heavy' }
        ]}
    ],
    'ja': [
        { id: 1, name: 'ピカリ', type: 'electric', 
          // FIX: Replaced placeholder with local pika.png
          image: './pika.png', 
          attacks: [
            { name: 'でんこうせっか', damage: 20 },
            { name: 'でんきショック', damage: 20 },
            { name: '10まんボルト', damage: 30, type: 'medium' }, // NEW type
            { name: 'ボルテッカー', damage: 50, type: 'heavy' }
        ]},
        { id: 2, name: 'リトカゲ', type: 'fire', 
          // FIX: Replaced placeholder with local char.png
          image: './char.png', 
          attacks: [
            { name: 'ひっかく', damage: 20 },
            { name: 'ひのこ', damage: 20 },
            { name: 'かえんほうしゃ', damage: 30, type: 'medium' }, // NEW type
            { name: 'フレアドライブ', damage: 50, type: 'heavy' }
        ]},
        { id: 3, name: 'リガメ', type: 'water', 
          // FIX: Replaced placeholder with local squirtle.png
          image: './squirtle.png', 
          attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'あわ', damage: 20 },
            { name: 'みずでっぽう', damage: 30, type: 'medium' }, // NEW type
            { name: 'ハイドロポンプ', damage: 50, type: 'heavy' }
        ]},
        { id: 4, name: 'リダネ', type: 'grass', 
          // FIX: Replaced placeholder with local bulba.png
          image: './bulba.png', 
          attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'つるのムチ', damage: 20 },
            { name: 'はっぱカッター', damage: 30, type: 'medium' }, // NEW type
            { name: 'ソーラービーム', damage: 50, type: 'heavy' }
        ]},
        { id: 5, name: 'リイーブイ', type: 'normal', 
          // FIX: Replaced placeholder with local eevie.png
          image: './eevie.png', 
          attacks: [
            { name: 'たいあたり', damage: 20 },
            { name: 'でんこうせっか', damage: 20 },
            { name: 'スピードスター', damage: 40, type: 'medium' }, // NEW type
            { name: 'とっておき', damage: 60, type: 'heavy' }
        ]}
    ]
};


// --- FIREBASE STATE ---
let app, auth, db;
let appId = 'default-app-id'; // This will be replaced by __app_id
let userId = null;
let gameUnsubscribe = null; // To detach listener
let gameDocRef = null;
let eventCodesUnsubscribe = null; // NEW: Listener for event codes

// --- GAME STATE ---
let playerPokemon = null;
let opponentPokemon = null; // Renamed from aiPokemon
let playerHP = 100;
let opponentHP = 100; // Renamed from aiHP
let currentTurn = 1;
let isPlayerTurn = true;
let gameInProgress = false;
let currentSelectionIndex = 0;
let currentLanguage = 'en';
let gameMode = 'ai'; // 'ai' or 'multiplayer'
let gameId = null;
let localPlayerRole = null; // 'player1' or 'player2'
let localPlayerName = null; // NEW
let opponentPlayerName = null; // NEW
let musicStarted = false; // NEW: To track if music has started
// REVERTED: Removed Username state
// let localPlayerUsername = null;
// let opponentUsername = null;

const MAX_TURNS = 20; // UPDATED: 10 per player (20 total)
//REMOVED: const MISS_CHANCE = 0.5; // This is now dynamic

// --- DOM ELEMENTS ---
// FIX: Changed all 'const' to 'let' so they can be assigned after DOM load
let startScreen;
let selectionScreen;
let battleScreen;
let victoryScreen;
let helpScreen;
let lobbyScreen; // NEW

let playAiButton;
let playFriendButton;
let helpButton;
let helpButtonText;
let helpTitle;
let helpRule1;
let helpRule2;
let helpRule3;
let helpBackButton;

// NEW: Lobby elements
let lobbyTitle;
let playerUserId;
let yourUserIdLabel;
let createGameButton;
let lobbyOrDivider;
let gameIdInput;
let joinGameButton;
let lobbyErrorMsg;
let waitingForPlayerMsg;
let gameIdDisplay;
let gameIdLabel;
let gameIdText;
let lobbyBackButton;

// NEW: Event Battle elements
let eventBattleBtn;
let eventBattleScreen;
let eventBackBtn;
let eventCodeInput1;
let eventCodeInput2;
// NEW: Remove buttons
let removeBtn1;
let removeBtn2;

// REVERTED: Removed Username prompt elements
let lobbyContentContainer;


let pokemonCardDisplay;
let prevPokemonButton;
let nextPokemonButton;
let selectionTitle; // NEW
let waitingForOpponentSelection; // NEW

let playerBox;
let opponentBox; // Renamed

// RENAMED: all 'ai-' vars to 'opponent-'
let opponentPokemonName;
let opponentHpText;
let opponentHpBar;
let opponentPokemonImg;

// NEW: Username Display Elements
let playerUsernameEl;
let opponentUsernameEl;

// REVERTED: Removed Username display elements

let playerPokemonName;
let playerHpText;
let playerHpBar;
let playerPokemonImg;

let battleLog;
let battleLogStart;
let turnCounter;
let playerControls;
let yourTurnTitle;
let battleLogTitle;

let endGameButton;

let winnerImg;
let victoryText;
// REVERTED: Removed winnerUsername
let restartButton;
let mainTitle;
let languageToggleButton;

// FIX: REMOVED videoOverlay and attackVideo
// let videoOverlay;
// let attackVideo;

let logReviewOverlay;
let logReviewTitle;
let logReviewContent;
let showLogButton;
let closeLogButton;
let bgMusic; // NEW: Background music element

// --- FUNCTIONS ---

/**
 * NEW: Assigns all DOM elements to variables.
 * Must be called *after* DOMContentLoaded.
 */
function initDomElements() {
    startScreen = document.getElementById('start-screen');
    selectionScreen = document.getElementById('selection-screen');
    battleScreen = document.getElementById('battle-screen');
    victoryScreen = document.getElementById('victory-screen');
    helpScreen = document.getElementById('help-screen');
    lobbyScreen = document.getElementById('lobby-screen');
    eventBattleScreen = document.getElementById('event-battle-screen'); // NEW

    playAiButton = document.getElementById('play-ai-btn');
    playFriendButton = document.getElementById('play-friend-btn');
    eventBattleBtn = document.getElementById('event-battle-btn'); // NEW
    helpButton = document.getElementById('help-btn');
    helpButtonText = document.getElementById('help-btn-text');
    helpTitle = document.getElementById('help-title');
    helpRule1 = document.getElementById('help-rule-1');
    helpRule2 = document.getElementById('help-rule-2');
    helpRule3 = document.getElementById('help-rule-3');
    helpBackButton = document.getElementById('help-back-btn');

    // NEW: Lobby elements
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

    // NEW: Event Battle DOM
    eventBackBtn = document.getElementById('event-back-btn');
    eventCodeInput1 = document.getElementById('event-code-3');
    eventCodeInput2 = document.getElementById('event-code-2');
    
    // NEW: Remove Buttons
    removeBtn1 = document.getElementById('remove-btn-1');
    removeBtn2 = document.getElementById('remove-btn-2');

    // REVERTED: Removed Username prompt elements
    lobbyContentContainer = document.getElementById('lobby-content-container');

    pokemonCardDisplay = document.getElementById('pokemon-card-display');
    prevPokemonButton = document.getElementById('prev-pokemon');
    nextPokemonButton = document.getElementById('next-pokemon');
    selectionTitle = document.getElementById('selection-title'); // NEW
    waitingForOpponentSelection = document.getElementById('waiting-for-opponent-selection'); // NEW

    playerBox = document.getElementById('player-box');
    opponentBox = document.getElementById('opponent-box'); // Renamed

    // RENAMED: all 'ai-' vars to 'opponent-'
    opponentPokemonName = document.getElementById('opponent-pokemon-name');
    opponentHpText = document.getElementById('opponent-hp-text');
    opponentHpBar = document.getElementById('opponent-hp-bar');
    opponentPokemonImg = document.getElementById('opponent-pokemon-img');

    // NEW: Username Display Elements
    playerUsernameEl = document.getElementById('player-username');
    opponentUsernameEl = document.getElementById('opponent-username');

    // REVERTED: Removed Username display elements

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
    // REVERTED: Removed winnerUsername
    restartButton = document.getElementById('restart-button');
    mainTitle = document.getElementById('main-title');
    languageToggleButton = document.getElementById('language-toggle');

    // FIX: REMOVED videoOverlay and attackVideo
    // let videoOverlay;
    // let attackVideo;

    logReviewOverlay = document.getElementById('log-review-overlay');
    logReviewTitle = document.getElementById('log-review-title');
    logReviewContent = document.getElementById('log-review-content');
    showLogButton = document.getElementById('show-log-button');
    closeLogButton = document.getElementById('close-log-button');

    bgMusic = document.getElementById('bg-music'); // NEW
}


/**
 * Gets a translated string from the UI_TEXT object.
 */
function getText(key, ...args) {
    const textOrFn = UI_TEXT[currentLanguage][key];
    if (typeof textOrFn === 'function') {
        return textOrFn(...args);
    }
    return textOrFn || key;
}

/**
 * Updates all text elements on the screen to the current language.
 */
function updateAllText() {
    // Set body language attribute for CSS
    document.body.lang = currentLanguage;

    // Start Screen
    if (!startScreen.classList.contains('hidden')) {
        mainTitle.textContent = getText('title_battle');
        mainTitle.style.color = '#6d47fb';
        playAiButton.textContent = getText('play_ai');
        playFriendButton.textContent = getText('play_friend');
        // playFriendButton.dataset.maintenanceText = getText('maintenance'); // No longer needed
        helpButtonText.textContent = getText('help');
    }

    // Lobby Screen
    if (!lobbyScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        
        // REVERTED: Removed username prompt text

        // Lobby content text
        lobbyTitle.textContent = getText('lobby_title');
        yourUserIdLabel.textContent = getText('your_user-id');
        playerUserId.textContent = userId || '...';
        createGameButton.textContent = getText('create_game');
        lobbyOrDivider.textContent = getText('lobby_or');
        gameIdInput.placeholder = getText('game_id_placeholder');
        joinGameButton.textContent = getText('join_game');
        waitingForPlayerMsg.textContent = getText('waiting_for_player');
        gameIdLabel.textContent = getText('game_id_label');
        lobbyBackButton.textContent = getText('lobby_back');
    }

    // Help Screen
    if (!helpScreen.classList.contains('hidden')) {
        helpTitle.textContent = getText('help_title');
        helpRule1.textContent = getText('help_rule_1');
        helpRule2.textContent = getText('help_rule_2');
        helpRule3.textContent = getText('help_rule_3');
        helpBackButton.textContent = getText('help_back');
    }

    // Selection Screen
    if (!selectionScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        selectionTitle.textContent = getText('selection_title');
        waitingForOpponentSelection.textContent = getText('waiting_for_opponent_selection');
        renderCurrentPokemonCard(); // Re-render card for language change
    }

    // Battle Screen
    if (!battleScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');
        battleLogTitle.textContent = getText('battle-log');
        endGameButton.textContent = getText('end_game');

        if (playerPokemon) {
            // REVERTED: Removed username
            const playerLangName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name; // NEW
            playerPokemonName.textContent = playerLangName; // REVERTED
            playerHpText.textContent = getText('hp_text', playerHP, 100);
            // NEW: Update username element
            if (localPlayerName) playerUsernameEl.textContent = localPlayerName;
            createAttackButtons();
        }
        if (opponentPokemon) {
            // REVERTED: Removed username
            const opponentLangName = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id).name; // NEW
            opponentPokemonName.textContent = opponentLangName; // REVERTED
            opponentHpText.textContent = getText('hp_text', opponentHP, 100);
            // NEW: Update username element
            if (opponentPlayerName) opponentUsernameEl.textContent = opponentPlayerName;
        }
        turnCounter.textContent = getText('turn_counter', Math.min(Math.ceil(currentTurn / 2), MAX_TURNS / 2), MAX_TURNS / 2); // Show turn pair
    }

    // Victory Screen
    if (!victoryScreen.classList.contains('hidden')) {
        mainTitle.classList.add('hidden');
        restartButton.textContent = getText('play_again');
        
        // REVERTED: Removed username logic
        if (victoryScreen.dataset.result) {
            const resultKey = victoryScreen.dataset.result;
            
            // UPDATED: Set victory text with player name
            if (resultKey === 'victory') {
                victoryText.textContent = getText('victory', localPlayerName || 'Player');
                victoryText.className = 'victory-text-base victory-text-win';
            } else if (resultKey === 'defeat') {
                victoryText.textContent = getText('defeat', opponentPlayerName || 'Opponent');
                victoryText.className = 'victory-text-base victory-text-lose';
            } else { // Draw
                victoryText.textContent = getText('draw');
                victoryText.className = 'victory-text-base victory-text-draw';
            }
        }
        showLogButton.textContent = getText('view_log');
    }

    // Log Review Screen
    logReviewTitle.textContent = getText('log_review_title');
    closeLogButton.textContent = getText('help_back'); // Re-using 'back' text

    // Language Toggle
    languageToggleButton.textContent = (currentLanguage === 'en') ? '日本語' : 'English';
}

/**
 * Toggles the language and updates the UI.
 */
function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'ja' : 'en';
    updateAllText();
}

// NEW: Function to play background music
function playBgMusic() {
    if (musicStarted || !bgMusic) return;
    bgMusic.volume = 0.7; // Set volume to 70% (reduced by 30%)
    bgMusic.play().then(() => {
        musicStarted = true;
    }).catch(e => {
        console.error("Background music playback failed:", e);
        // Autoplay is often blocked; music will wait for another interaction if this fails,
        // but since it's tied to a click, it should work.
    });
}


// --- SCREEN NAVIGATION & RESETS ---

/**
 * Initializes/Resets the game to the start screen.
 */
function initGame() {
    startScreen.classList.remove('hidden');
    selectionScreen.classList.add('hidden');
    battleScreen.classList.add('hidden');
    victoryScreen.classList.add('hidden');
    helpScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    eventBattleScreen.classList.add('hidden'); // NEW
    mainTitle.classList.remove('hidden');
    
    // Detach any active game listener
    if (gameUnsubscribe) {
        gameUnsubscribe();
        gameUnsubscribe = null;
    }
    // Clean up game doc if P1
    if (gameDocRef && localPlayerRole === 'player1') {
        deleteDoc(gameDocRef).catch(e => console.error("Error cleaning up game doc", e));
    }

    // Reset all game state variables
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
    localPlayerName = null; // NEW
    opponentPlayerName = null; // NEW
    gameDocRef = null;

    // Reset UI text and elements
    battleLog.innerHTML = `<p id="battle-log-start">${getText('log_welcome')}</p>`;
    logReviewContent.innerHTML = '';
    endGameButton.classList.add('hidden');
    
    // Reset lobby UI
    gameIdInput.value = '';
    lobbyErrorMsg.textContent = '';
    waitingForPlayerMsg.classList.add('hidden');
    gameIdDisplay.classList.add('hidden');
    createGameButton.disabled = false;
    joinGameButton.disabled = false;
    gameIdInput.disabled = false;
    
    // REVERTED: Reset username prompt
    // if (usernamePromptContainer) {
    //     usernamePromptContainer.classList.add('hidden');
    //     lobbyContentContainer.classList.remove('hidden');
    // }

    updateAllText();
}

/**
 * Shows the Help screen.
 */
function showHelpScreen() {
    startScreen.classList.add('hidden');
    helpScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    updateAllText();
}

/**
 * Hides the Help screen and returns to Start.
 */
function hideHelpScreen() {
    startScreen.classList.remove('hidden');
    helpScreen.classList.add('hidden');
    mainTitle.classList.remove('hidden');
    updateAllText();
}

/**
 * NEW: Shows the Event Battle Screen.
 */
function showEventBattleScreen() {
    startScreen.classList.add('hidden');
    eventBattleScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    
    // Note: We don't need to load from localStorage here anymore, 
    // the Firestore listener handles it.
}

/**
 * NEW: Hides the Event Battle Screen.
 */
function hideEventBattleScreen() {
    startScreen.classList.remove('hidden');
    eventBattleScreen.classList.add('hidden');
    mainTitle.classList.remove('hidden');
}

/**
 * Shows the AI selection screen.
 */
function showAiSelectionScreen() {
    playBgMusic(); // NEW: Start music
    gameMode = 'ai';
    startScreen.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    
    // For AI, show selection UI immediately
    prevPokemonButton.classList.remove('hidden');
    nextPokemonButton.classList.remove('hidden');
    pokemonCardDisplay.classList.remove('hidden');
    selectionTitle.textContent = getText('selection_title');
    waitingForOpponentSelection.classList.add('hidden');
    
    renderCurrentPokemonCard();
    updateAllText();
}

/**
 * NEW: Shows the Multiplayer Lobby screen.
 */
function showLobbyScreen() {
    playBgMusic(); // NEW: Start music
    gameMode = 'multiplayer';
    startScreen.classList.add('hidden');
    lobbyScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');
    
    // REVERTED: Removed username check
    // Always show lobby content
    lobbyContentContainer.classList.remove('hidden');
    // usernamePromptContainer.classList.add('hidden');

    updateAllText();
}

/**
 * NEW: Confirms and saves the username.
 */
// REVERTED: Removed function

/**
 * NEW: Leaves the lobby and returns to the main menu.
 */
function leaveLobby() {
    // This will reset all state, detach listeners, and delete game docs
    initGame(); 
}


// --- POKÉMON SELECTION ---

/**
 * Renders the currently selected Pokémon card.
 */
function renderCurrentPokemonCard() {
    const pokemon = POKEMON_DATA[currentLanguage][currentSelectionIndex];
    const basePokemon = POKEMON_DATA['en'][currentSelectionIndex];
    
    // Card HTML
    // FIX: Removed the broken onclick="" attribute from the div
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

    // FIX: Add event listener programmatically
    // Functions in modules are not global, so "onclick" in HTML fails.
    const cardElement = document.getElementById('pokemon-card-clickable');
    if (cardElement) {
        cardElement.addEventListener('click', () => selectPokemon(basePokemon.id));
    }
}

/**
 * Shows the previous Pokémon in the selection list.
 */
function showPrevPokemon() {
    currentSelectionIndex = (currentSelectionIndex - 1 + POKEMON_DATA[currentLanguage].length) % POKEMON_DATA[currentLanguage].length;
    renderCurrentPokemonCard();
}

/**
 * Shows the next Pokémon in the selection list.
 */
function showNextPokemon() {
    currentSelectionIndex = (currentSelectionIndex + 1) % POKEMON_DATA[currentLanguage].length;
    renderCurrentPokemonCard();
}

/**
 * Handles the final selection of a Pokémon.
 */
async function selectPokemon(id) {
    const basePokemon = POKEMON_DATA['en'].find(p => p.id === id);
    // Create a deep copy to avoid modifying the original data
    playerPokemon = JSON.parse(JSON.stringify(basePokemon));
    
    if (gameMode === 'ai') {
        // --- AI Mode Selection ---
        // AI chooses a different Pokémon
        let aiIndex = Math.floor(Math.random() * POKEMON_DATA['en'].length);
        while (aiIndex === currentSelectionIndex) {
            aiIndex = Math.floor(Math.random() * POKEMON_DATA['en'].length);
        }
        const baseAiPokemon = POKEMON_DATA['en'][aiIndex];
        opponentPokemon = JSON.parse(JSON.stringify(baseAiPokemon));
        
        // Start the battle
        startBattle();
    } else {
        // --- Multiplayer Mode Selection ---
        // Update the game doc with player's choice
        try {
            await updateDoc(gameDocRef, {
                [`${localPlayerRole}.pokemon`]: playerPokemon,
                [`${localPlayerRole}.pokemonId`]: id, // Store ID for language
                [`${localPlayerRole}.ready`]: true
            });
            
            // Show waiting screen
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


// --- FIREBASE MULTIPLAYER ---

/**
 * Initializes Firebase app and auth.
 */
async function initFirebase() {
    try {
        // Use provided __app_id if available
        appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        
        // Use provided config if available, otherwise use the one in the script
        const config = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;

        app = initializeApp(config);
        db = getFirestore(app);
        auth = getAuth(app);
        
        setLogLevel('debug'); // Enable Firestore debug logging

        // Sign in
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
                // Now that auth is ready, initialize the game UI
                initGame();
                startEventCodeListener(); // NEW: Start listening to global event codes
            } else {
                console.log("Firebase Auth: No user.");
                userId = null;
                // You could disable multiplayer here
            }
        });

    } catch (e) {
        console.error("Error initializing Firebase:", e);
        // Show an error to the user
        playFriendButton.textContent = 'Multiplayer Disabled';
        playFriendButton.disabled = true;
    }
}


/**
 * NEW: Creates a new game in Firestore.
 */
async function createGame() {
    createGameButton.disabled = true;
    joinGameButton.disabled = true;
    gameIdInput.disabled = true;
    lobbyErrorMsg.textContent = '';
    
    // Public game collection
    const gamesCollection = collection(db, `artifacts/${appId}/public/data/games`);
    
    try {
        const newGameDoc = doc(gamesCollection); // Create a new doc with a random ID
        gameId = newGameDoc.id;
        
        const player1Data = {
            hp: 100,
            pokemon: null,
            pokemonId: null, // NEW
            ready: false,
            // REVERTED: Removed username
            // username: localPlayerUsername 
        };
        
        const gameData = {
            player1: player1Data,
            player2: null,
            gameState: 'waiting', // waiting, p1_turn, p2_turn, game_over
            currentTurn: 1,
            winner: null,
            log: [getText('log_welcome')], // Start with a welcome message
            createdAt: serverTimestamp(),
            lastAction: serverTimestamp()
        };

        await setDoc(newGameDoc, gameData);
        
        gameDocRef = newGameDoc;
        localPlayerRole = 'player1';

        // Show game ID and wait
        gameIdText.textContent = gameId;
        gameIdDisplay.classList.remove('hidden');
        waitingForPlayerMsg.classList.remove('hidden');
        
        // Listen for game changes
        listenToGame();

    } catch (e) {
        console.error("Error creating game:", e);
        lobbyErrorMsg.textContent = getText('lobby_error_creating');
        createGameButton.disabled = false;
        joinGameButton.disabled = false;
        gameIdInput.disabled = false;
    }
}

/**
 * NEW: Joins an existing game in Firestore.
 */
async function joinGame() {
    gameId = gameIdInput.value.trim();
    if (!gameId) return;

    createGameButton.disabled = true;
    joinGameButton.disabled = true;
    gameIdInput.disabled = true;
    lobbyErrorMsg.textContent = '';
    
    // Public game doc path
    const gameRef = doc(db, `artifacts/${appId}/public/data/games/${gameId}`);
    
    try {
        const gameSnap = await getDoc(gameRef);
        if (!gameSnap.exists()) {
            throw new Error("Game not found");
        }
        
        const gameData = gameSnap.data();
        
        // Check if game is full
        if (gameData.player2) {
            throw new Error("Game is full");
        }
        
        const player2Data = {
            hp: 100,
            pokemon: null,
            pokemonId: null, // NEW
            ready: false,
            // REVERTED: Removed username
            // username: localPlayerUsername
        };

        await updateDoc(gameRef, {
            player2: player2Data,
            gameState: 'selection', // Both players joined, move to selection
            log: arrayUnion('Player 2 has joined!') // Simple log
        });

        gameDocRef = gameRef;
        localPlayerRole = 'player2';

        // Listen for game changes
        listenToGame();

    } catch (e) {
        console.error("Error joining game:", e);
        lobbyErrorMsg.textContent = getText('lobby_error_joining');
        createGameButton.disabled = false;
        joinGameButton.disabled = false;
        gameIdInput.disabled = false;
    }
}

/**
 * NEW: Listens to real-time updates for the current game.
 */
function listenToGame() {
    if (gameUnsubscribe) {
        gameUnsubscribe(); // Detach old listener if any
    }
    
    gameUnsubscribe = onSnapshot(gameDocRef, (doc) => {
        if (!doc.exists()) {
            // Game was deleted (maybe by P1)
            console.log("Game document deleted.");
            if (gameInProgress) {
                 // Opponent probably left, show forfeit
                logMessage(getText('log_opponent_forfeit'));
                showVictoryScreen(playerPokemon, 'victory');
            } else {
                // If not in game, just go back to menu
                initGame();
            }
            return;
        }

        const gameData = doc.data();
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';

        // --- Update Local State from Firestore ---
        currentTurn = gameData.currentTurn;
        
        // REVERTED: Removed username syncing
        // if (gameData[opponentRole]) {
        //     opponentUsername = gameData[opponentRole].username || null;
        // }

        if (gameData[localPlayerRole]) {
            playerHP = gameData[localPlayerRole].hp;
        }
        if (gameData[opponentRole]) {
            opponentHP = gameData[opponentRole].hp;
            opponentPokemon = gameData[opponentRole].pokemon; // Get opponent's chosen Pokemon
        }
        
        // Update battle log
        if (gameData.log && battleLog) {
            // Only update log if it's different (simple check)
            const logLength = battleLog.children.length;
            if (gameData.log.length > logLength || (logLength === 1 && battleLog.children[0].id === 'battle-log-start')) {
                battleLog.innerHTML = ''; // Clear log
                gameData.log.forEach(msg => {
                    logMessage(msg); // Add messages from Firestore
                });
            }
        }

        // --- Handle Game State ---
        switch (gameData.gameState) {
            case 'waiting':
                // P1 is waiting for P2
                lobbyScreen.classList.remove('hidden');
                selectionScreen.classList.add('hidden');
                waitingForPlayerMsg.classList.remove('hidden');
                break;
                
            case 'selection':
                // Both players joined, move to selection screen
                lobbyScreen.classList.add('hidden');
                selectionScreen.classList.remove('hidden');
                mainTitle.classList.add('hidden');
                
                // Check if *we* are ready
                if (gameData[localPlayerRole] && gameData[localPlayerRole].ready) {
                    prevPokemonButton.classList.add('hidden');
                    nextPokemonButton.classList.add('hidden');
                    pokemonCardDisplay.classList.add('hidden');
                    selectionTitle.textContent = getText('selection_title');
                    waitingForOpponentSelection.classList.remove('hidden');
                } else {
                    // We are not ready, show selection
                    prevPokemonButton.classList.remove('hidden');
                    nextPokemonButton.classList.remove('hidden');
                    pokemonCardDisplay.classList.remove('hidden');
                    selectionTitle.textContent = getText('selection_title');
                    waitingForOpponentSelection.classList.add('hidden');
                    renderCurrentPokemonCard();
                }
                
                // Check if *both* are ready
                if (gameData.player1.ready && gameData.player2.ready) {
                    playerPokemon = gameData[localPlayerRole].pokemon;
                    opponentPokemon = gameData[opponentRole].pokemon;
                    
                    // P1 starts the battle logic
                    if (localPlayerRole === 'player1' && !gameInProgress) {
                        updateDoc(gameDocRef, {
                            gameState: 'player1_turn', // FIX: Was 'p1_turn'
                            log: arrayUnion(getText('log_player_chose', gameData.player1.pokemon.name), getText('log_opponent_chose', gameData.player2.pokemon.name), getText('log_battle_begin'))
                        });
                    }
                    // Both players call startBattle() to set up UI
                    if (!gameInProgress) {
                        startBattle();
                    }
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
                if (!gameInProgress) return; // Don't show victory twice
                gameInProgress = false;
                
                // Determine result from our perspective
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
        // Handle error, maybe show a disconnect message
    });
}

/**
 * NEW: Listens to global event codes for the battle screen.
 */
function startEventCodeListener() {
    if (eventCodesUnsubscribe) eventCodesUnsubscribe();
    // Path: artifacts/{appId}/public/data/event_data/global
    const docRef = doc(db, `artifacts/${appId}/public/data/event_data/global`);
    eventCodesUnsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Check if element is focused to avoid overwriting while typing
            if (eventCodeInput1 && document.activeElement !== eventCodeInput1) {
                 eventCodeInput1.value = data.row1 || '';
            }
            if (eventCodeInput2 && document.activeElement !== eventCodeInput2) {
                 eventCodeInput2.value = data.row2 || '';
            }
        }
    });
}

/**
 * NEW: Saves event code to Firestore (helper function).
 */
function saveEventCode(row, value) {
    if (!db) return;
    const docRef = doc(db, `artifacts/${appId}/public/data/event_data/global`);
    // Use merge: true to ensure the document exists and we only update the specific field
    setDoc(docRef, { [row]: value }, { merge: true }).catch(e => console.error("Error saving code:", e));
}


// --- BATTLE LOGIC ---

/**
 * Toggles the language and updates the UI.
 */
function startBattle() {
    gameInProgress = true;
    selectionScreen.classList.add('hidden');
    lobbyScreen.classList.add('hidden');
    battleScreen.classList.remove('hidden');
    mainTitle.classList.add('hidden');

    endGameButton.textContent = getText('end_game');
    endGameButton.classList.remove('hidden');

    // Setup UI
    const playerLangData = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id);
    const opponentLangData = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id);

    // NEW: Set Player 1 / Player 2 names
    if (gameMode === 'multiplayer') {
        localPlayerName = getText(localPlayerRole === 'player1' ? 'player1_name' : 'player2_name');
        opponentPlayerName = getText(localPlayerRole === 'player1' ? 'player2_name' : 'player1_name');
    } else {
        // Handle AI mode names
        localPlayerName = getText('player1_name'); // You are P1
        opponentPlayerName = 'AI'; // Or a translated name
    }
    
    // Set Player UI
    playerUsernameEl.textContent = localPlayerName;
    playerUsernameEl.className = `text-sm md:text-lg font-bold text-center md:text-left truncate type-${playerPokemon.type}-text`;
    playerPokemonName.textContent = playerLangData.name;
    playerPokemonImg.src = playerPokemon.image;
    playerPokemonName.className = `text-[0.625rem] md:text-base font-normal leading-tight text-center md:text-left type-${playerPokemon.type}-text`;
    playerBox.className = `p-1 md:p-4 rounded-lg border-2 shadow-md type-${playerPokemon.type}-bg type-${playerPokemon.type}-border`;

    // Set Opponent UI
    opponentUsernameEl.textContent = opponentPlayerName;
    opponentUsernameEl.className = `text-sm md:text-lg font-bold text-center md:text-left truncate type-${opponentPokemon.type}-text`;
    opponentPokemonName.textContent = opponentLangData.name; 
    opponentPokemonImg.src = opponentPokemon.image;
    opponentPokemonName.className = `text-[0.625rem] md:text-base font-normal leading-tight text-center md:text-left type-${opponentPokemon.type}-text`;
    opponentBox.className = `p-1 md:p-4 rounded-lg border-2 shadow-md type-${opponentPokemon.type}-bg type-${opponentPokemon.type}-border`;

    createAttackButtons();

    // Reset log only for AI mode
    if (gameMode === 'ai') {
        battleLog.innerHTML = '';
        logMessage(getText('log_player_chose', playerLangData.name));
        logMessage(getText('log_ai_chose', opponentLangData.name));
        logMessage(getText('log_battle_begin'));
    }

    yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');
    battleLogTitle.textContent = getText('battle-log');

    updateUI();
}

/**
 * Creates and populates attack buttons.
 */
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
    
    // Update button states immediately
    updateUI();
}

/**
 * Generates a video file name from an attack name.
 */
// FIX: REMOVED getAttackVideoSrc function

/**
* NEW: Calculates miss chance based on attack.
*/
function getMissChance(attack) {
    if (attack.type === 'medium') {
        return 0.7; // 70% miss chance
    }
    return 0.4; // 40% miss chance
}

/**
* Handles the player's attack action.
*/
async function playerAttack(attackIndex) {
    if (!isPlayerTurn || !gameInProgress) return;

    const attack = playerPokemon.attacks[attackIndex];
    const attackName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).attacks[attackIndex].name;
    const pokemonName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name;

    // FIX: Corrected heavy attack logic. Fail if HP is >= 50.
    if (attack.type === 'heavy' && playerHP >= 50) {
        logMessage(getText('log_heavy_fail', attackName));
        // In AI mode, this doesn't cost a turn. In multiplayer, we'll make it not cost a turn either.
        if (gameMode === 'multiplayer') {
             await updateDoc(gameDocRef, {
                log: arrayUnion(getText('log_heavy_fail', attackName))
            });
        }
        return; // Don't waste the turn
    }

    isPlayerTurn = false;
    updateUI(); // Disable buttons immediately

    // FIX: REMOVED all video logic
    // --- Post-video logic ---
    // This logic is now instant
    animateAttack(playerPokemonImg, true);

    // USE new miss chance logic
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
        // --- AI Mode Logic ---
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
        // --- Multiplayer Mode Logic ---
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';
        const newOpponentHP = Math.max(0, opponentHP - damage);
        const nextTurn = currentTurn + 1; // Increment turn
        
        const logMessages = [getText('log_player_command', pokemonName, attackName)];
        if (didMiss) {
            logMessages.push(getText('log_miss', missReason));
        } else {
            logMessages.push(getText('log_hit', attackName, damage));
        }

        // Prepare update for Firestore
        const updateData = {
            currentTurn: nextTurn,
            gameState: `${opponentRole}_turn`,
            [`${opponentRole}.hp`]: newOpponentHP,
            log: arrayUnion(...logMessages),
            lastAction: serverTimestamp()
        };
        
        // Check for game over
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
            if (playerHP > newOpponentHP) { // Compare current player HP to new opponent HP
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
        
        // Send update to Firestore
        updateDoc(gameDocRef, updateData).catch(e => console.error("Error during attack:", e));
    }
}


/**
* Simulates the AI's turn and logic. (Only for AI mode)
*/
function aiTurn() {
    if (!gameInProgress || gameMode !== 'ai') return;

    const { attack, attackName, pokemonName } = getAiAttack();

    // FIX: REMOVED all video logic
    // --- Post-video logic ---
    // This logic is now instant
    animateAttack(opponentPokemonImg, false); // 'false' for opponent animation

    logMessage(getText('log_ai_attack', pokemonName, attackName));
    
    // USE new miss chance logic
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

/**
* "Smart" AI logic to select an attack.
*/
function getAiAttack() {
    const attacks = opponentPokemon.attacks;
    const heavyAttack = attacks.find(a => a.type === 'heavy');
    // Updated to use 'medium' type
    const mediumAttack = attacks.find(a => a.type === 'medium');
    const basicAttacks = attacks.filter(a => a.damage === 20);

    const aiLangData = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id);
    const pokemonName = aiLangData.name;
    let chosenAttack = null;

    // Rule 1: If AI HP < 50, high chance to use Heavy Attack.
    if (heavyAttack && opponentHP < 50 && Math.random() < 0.75) {
        logMessage(getText('log_ai_focus', pokemonName));
        chosenAttack = heavyAttack;
    }
    // Rule 2: If Player HP is low, try to finish.
    else if (playerHP <= 40) {
        chosenAttack = (heavyAttack && opponentHP < 50) ? heavyAttack : (mediumAttack || basicAttacks[0]);
    }
    // Rule 3: If Player HP is very low, use medium to be safe
    else if (playerHP <= 20) {
        chosenAttack = mediumAttack || basicAttacks[0];
    }
    // Rule 4: Otherwise, random choice, weighted towards medium.
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

/**
* Checks if the game is over (AI Mode ONLY).
*/
function checkGameOver() {
    // This function is only for AI mode. Multiplayer game over is handled in playerAttack.
    if (gameMode !== 'ai' || !gameInProgress) return true;

    const playerLangName = POKEMON_DATA[currentLanguage].find(p => p.id === playerPokemon.id).name;
    const aiLangName = POKEMON_DATA[currentLanguage].find(p => p.id === opponentPokemon.id).name;

    if (opponentHP <= 0) {
        logMessage(getText('log_ai_fainted', aiLangName));
        showVictoryScreen(playerPokemon, 'victory'); // Pass winner
        return true;
    }
    if (playerHP <= 0) {
        logMessage(getText('log_player_fainted', playerLangName));
        showVictoryScreen(opponentPokemon, 'defeat'); // Pass winner
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

/**
* Updates all dynamic UI elements (HP bars, text, buttons).
*/
function updateUI() {
    // Update HP Text
    playerHpText.textContent = getText('hp_text', playerHP, 100);
    opponentHpText.textContent = getText('hp_text', opponentHP, 100);

    // Update HP bar color and width
    updateHpBar(playerHpBar, playerHP);
    updateHpBar(opponentHpBar, opponentHP);

    // Update Turn Counter
    turnCounter.textContent = getText('turn_counter', Math.min(Math.ceil(currentTurn / 2), MAX_TURNS / 2), MAX_TURNS / 2);
    
    // Update Turn Title
    yourTurnTitle.textContent = getText(isPlayerTurn ? 'your_turn' : 'opponents_turn');

    // Update Attack Buttons
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

    // Disable all buttons if not player's turn or game is over
    playerControls.querySelectorAll('button').forEach(btn => {
        // Master disable
        if (!isPlayerTurn || !gameInProgress) {
            btn.disabled = true;
        } 
        // Re-enable if it IS our turn
        else if (btn.id !== 'heavy-attack-btn') {
            btn.disabled = false;
        } 
        // Special check for heavy button
        else if (btn.id === 'heavy-attack-btn') {
             btn.disabled = (playerHP >= 50);
        }
    });
}

/**
* Updates an HP bar's width and color based on percentage.
*/
function updateHpBar(barElement, currentHp) {
    if (!barElement) return;
    const hpPercent = currentHp / 100;
    barElement.style.width = `${currentHp}%`;
    const backgroundPosition = 100 - (hpPercent * 100);
    barElement.style.backgroundPosition = `${backgroundPosition}% 50%`;
}


/**
* Displays the victory screen.
*/
function showVictoryScreen(winner, messageKey) {
    gameInProgress = false;

    // Capture the final log
    logReviewContent.innerHTML = battleLog.innerHTML;
    logReviewContent.scrollTop = logReviewContent.scrollHeight;

    endGameButton.classList.add('hidden');
    victoryScreen.dataset.result = messageKey;
    
    // Clear old text
    // REVERTED: Removed winnerUsername
    victoryText.textContent = '';

    if (winner) {
        winnerImg.src = winner.image.includes('placehold.co') ? winner.image.replace('150x150', '320x320') : winner.image;
        winnerImg.className = `w-full h-full object-cover rounded-full shadow-lg border-8 type-${winner.type}-border`;
    } else {
        winnerImg.src = 'https://placehold.co/320x320/EFEFEF/333?text=DRAW';
        winnerImg.className = 'w-full h-full object-cover rounded-full shadow-lg border-8 border-gray-500';
    }

    // Set text content
    if (messageKey === 'victory') {
        victoryText.textContent = getText('victory', localPlayerName || 'Player');
        victoryText.className = 'victory-text-base victory-text-win';
    } else if (messageKey === 'defeat') {
        victoryText.textContent = getText('defeat', opponentPlayerName || 'Opponent');
        victoryText.className = 'victory-text-base victory-text-lose';
    } else { // Draw
        victoryText.textContent = getText('draw');
        victoryText.className = 'victory-text-base victory-text-draw';
    }

    restartButton.textContent = getText('play_again');
    showLogButton.textContent = getText('view_log');

    // Detach listener and clean up game doc
    if (gameUnsubscribe) {
        gameUnsubscribe();
        gameUnsubscribe = null;
    }
    if (gameDocRef && localPlayerRole === 'player1') {
        // P1 is responsible for cleaning up the game doc after a delay
        setTimeout(() => {
            deleteDoc(gameDocRef).catch(e => console.error("Error cleaning up game", e));
            gameDocRef = null;
            gameId = null;
        }, 10000); // Clean up after 10 seconds
    }


    setTimeout(() => {
        battleScreen.classList.add('hidden');
        victoryScreen.classList.remove('hidden');
        mainTitle.classList.add('hidden');
    }, 1000);
}

/**
* Adds a message to the battle log and scrolls down.
*/
function logMessage(message, forceClear = false) {
    if (forceClear) {
        battleLog.innerHTML = '';
    }
    const p = document.createElement('p');
    p.textContent = message;
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
}

/**
* Handles manually ending the game (forfeit).
*/
async function endGame() {
    if (!gameInProgress) return; // FIX: Don't do anything if game is already over
    
    if (gameMode === 'ai') {
        gameInProgress = false; // AI mode can end immediately
        logMessage(getText('log_forfeit'));
        setTimeout(() => {
            showVictoryScreen(opponentPokemon, 'defeat');
        }, 500);
    } else {
        // Multiplayer forfeit
        // FIX: Do NOT set gameInProgress = false here.
        // Let the snapshot listener handle the game over state.
        const opponentRole = localPlayerRole === 'player1' ? 'player2' : 'player1';
        await updateDoc(gameDocRef, {
            gameState: 'game_over',
            winner: opponentRole,
            log: arrayUnion(getText('log_forfeit'))
        });
        // The onSnapshot listener will see 'game_over' and call showVictoryScreen
    }
    updateUI(); // Disable all buttons
}

/**
* Triggers a visual "damage" animation.
*/
function animateDamage(imgElement) {
    if(!imgElement) return;
    imgElement.classList.add('taking-damage');
    setTimeout(() => {
        imgElement.classList.remove('taking-damage');
    }, 300);
}

/**
* Triggers a visual "attack" animation.
*/
function animateAttack(imgElement, isPlayer) {
    if(!imgElement) return;
    // RENAMED: .ai-attacking to .opponent-attacking
    const attackClass = isPlayer ? 'attacking' : 'opponent-attacking';
    imgElement.classList.add(attackClass);
    setTimeout(() => {
        imgElement.classList.remove(attackClass);
    }, 200);
}


// --- EVENT LISTENERS ---
// FIX: Moved all event listeners into a function
function initEventListeners() {
    restartButton.addEventListener('click', initGame);
    endGameButton.addEventListener('click', endGame);
    playAiButton.addEventListener('click', showAiSelectionScreen);
    playFriendButton.addEventListener('click', showLobbyScreen);
    
    // NEW: Event Battle Listeners
    eventBattleBtn.addEventListener('click', showEventBattleScreen);
    eventBackBtn.addEventListener('click', hideEventBattleScreen);
    
    // NEW: Save inputs on change (Debounced to avoid too many writes)
    let debounceTimer;
    eventCodeInput1.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => saveEventCode('row1', e.target.value), 500);
    });
    eventCodeInput2.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => saveEventCode('row2', e.target.value), 500);
    });

    // NEW: Remove Button Listeners (Now saves empty string to Firestore)
    if (removeBtn1) {
        removeBtn1.addEventListener('click', () => {
            saveEventCode('row1', '');
        });
    }
    if (removeBtn2) {
        removeBtn2.addEventListener('click', () => {
             saveEventCode('row2', '');
        });
    }

    helpButton.addEventListener('click', showHelpScreen);
    helpBackButton.addEventListener('click', hideHelpScreen);

    prevPokemonButton.addEventListener('click', showPrevPokemon);
    nextPokemonButton.addEventListener('click', showNextPokemon);

    languageToggleButton.addEventListener('click', toggleLanguage);

    // NEW: Lobby Listeners
    // REVERTED: Removed confirmUsername listener
    createGameButton.addEventListener('click', createGame);
    joinGameButton.addEventListener('click', joinGame);
    lobbyBackButton.addEventListener('click', leaveLobby);

    // Log Review Listeners
    showLogButton.addEventListener('click', () => {
        logReviewOverlay.classList.remove('hidden');
        logReviewTitle.textContent = getText('log_review_title');
        closeLogButton.textContent = getText('help_back');
        logReviewContent.scrollTop = logReviewContent.scrollHeight;
    });
    closeLogButton.addEventListener('click', () => {
        logReviewOverlay.classList.add('hidden');
    });


    // FIX: REMOVED video error handler
}

// --- START FIREBASE & GAME ---
// UPDATED: Remove DOMContentLoaded listener.
// This script is type="module" and at the end of the <body>,
// so the DOM is guaranteed to be ready when this code executes.
initDomElements(); // 1. Find all elements
initEventListeners(); // 2. Attach all listeners

initFirebase(); // 3. Start Firebase auth, which will then call initGame()
