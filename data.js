// data.js — sample songs in ChordPro format

const SONGS = [
  {
    id: '1',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    key: 'C',
    capo: 0,
    bpm: 72,
    texts: [
      {
        id: 't1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[C]I heard there was a [Am]secret chord
[C]That David played and it [Am]pleased the Lord
[F]But you don't really [G]care for music, [C]do [G]you?
[C]Well it goes like [F]this: the [G]fourth, the [Am]fifth
The [F]minor fall, the [G]major lift
The [G]baffled king com[Em]posing Halle[Am]lujah
{end_of_verse}

{start_of_chorus: Chorus}
Halle[F]lujah, Halle[Am]lujah
Halle[F]lujah, Halle[C]lu — [G]jah
Halle[C]lujah
{end_of_chorus}

{start_of_verse: Verse 2}
[C]Your faith was strong but [Am]you needed proof
[C]You saw her bathing [Am]on the roof
Her [F]beauty and the [G]moonlight over[C]threw [G]you
[C]She tied you to a [F]kitchen [G]chair
She [Am]broke your throne, and she [F]cut your hair
And [G]from your lips she [Em]drew the Halle[Am]lujah
{end_of_verse}

{start_of_chorus: Chorus}
Halle[F]lujah, Halle[Am]lujah
Halle[F]lujah, Halle[C]lu — [G]jah
Halle[C]lujah
{end_of_chorus}

{start_of_verse: Verse 3}
[C]Maybe I've been [Am]here before
[C]I know this room, I've [Am]walked this floor
I [F]used to live a[G]lone before I [C]knew [G]you
[C]I've seen your flag on the [F]marble [G]arch
But [Am]love is not a [F]victory march
It's a [G]cold and it's a [Em]broken Halle[Am]lujah
{end_of_verse}

{start_of_chorus: Chorus}
Halle[F]lujah, Halle[Am]lujah
Halle[F]lujah, Halle[C]lu — [G]jah
Halle[C]lujah
{end_of_chorus}`
      }
    ]
  },
  {
    id: '2',
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    key: 'G',
    capo: 0,
    bpm: 66,
    texts: [
      {
        id: 't2',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Intro / Verse 1}
[Em7]So, so you think you can [G]tell
[Em7]Heaven from hell?
[Em7]Blue skies from [G]pain?
[Em7]Can you tell a green [G]field
From a [A]cold steel rail?
A [Em7]smile from a [G]veil?
Do you think you can [A]tell?
{end_of_verse}

{start_of_verse: Verse 2}
[Em7]Did they get you to trade
Your [G]heroes for ghosts?
[Em7]Hot ashes for [G]trees?
[Em7]Hot air for a [G]cool breeze?
[A]Cold comfort for [Em7]change?
Did you ex[G]change
A walk-on [A]part in the war
For a lead [G]role in a [Em7]cage?
{end_of_verse}

{start_of_chorus: Chorus}
[C]How I wish, how I wish you were [G]here
We're just [D]two lost souls swimming in a fish bowl
[Am]Year after [G]year
[C]Running over the same old ground
What have we [G]found?
The same old [D]fears
Wish you were [Am]here
{end_of_chorus}`
      }
    ]
  },
  {
    id: '3',
    title: 'Blackbird',
    artist: 'The Beatles',
    key: 'G',
    capo: 0,
    bpm: 96,
    texts: [
      {
        id: 't3',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[G]Blackbird singing in the [Am]dead of [G/B]night
[C]Take these broken [Db]wings and [D]learn to [Eb]fly
[G]All your [Am]life
[G]You were only [C]waiting for this [G]moment to a[G]rise
{end_of_verse}

{start_of_verse: Verse 2}
[G]Blackbird singing in the [Am]dead of [G/B]night
[C]Take these sunken [Db]eyes and [D]learn to [Eb]see
[G]All your [Am]life
[G]You were only [C]waiting for this [G]moment to be [G]free
{end_of_verse}

{start_of_bridge: Bridge}
[F]Blackbird [Em]fly, [Dm]Blackbird [C]fly
[Bb]Into the [C]light of the [F]dark black [G]night
{end_of_bridge}

{start_of_verse: Verse 3}
[G]Blackbird singing in the [Am]dead of [G/B]night
[C]Take these broken [Db]wings and [D]learn to [Eb]fly
[G]All your [Am]life
[G]You were only [C]waiting for this [G]moment to a[G]rise
[G]You were only [C]waiting for this [G]moment to a[G]rise
[G]You were only [C]waiting for this [G]moment to a[G]rise
{end_of_verse}`
      }
    ]
  },
  {
    id: '4',
    title: 'Fast Car',
    artist: 'Tracy Chapman',
    key: 'D',
    capo: 2,
    bpm: 100,
    texts: [
      {
        id: 't4',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Dmaj7]You got a fast car
[Asus4]I want a ticket to anywhere
[G6]Maybe we make a deal
[D]Maybe together we can get somewhere
{end_of_verse}

{start_of_verse: Verse 2}
[Dmaj7]Any place is better
[Asus4]Starting from zero got nothing to lose
[G6]Maybe we'll make something
[D]Me, myself, I got nothing to prove
{end_of_verse}

{start_of_chorus: Chorus}
[Dmaj7]You got a fast car
[Asus4]I want a ticket to anywhere
[G6]Maybe we make a deal
[D]Maybe together we can get somewhere
{end_of_chorus}

{start_of_verse: Verse 3}
[Dmaj7]I remember when we were driving, driving in your car
[Asus4]Speed so fast, felt like I was drunk
[G6]City lights lay out before us
[D]And your arm felt nice wrapped around my shoulder
{end_of_verse}`
      }
    ]
  },
  {
    id: '5',
    title: 'Wonderwall',
    artist: 'Oasis',
    key: 'F#m',
    capo: 2,
    bpm: 87,
    texts: [
      {
        id: 't5',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Em7]Today is gonna be the day
That they're gonna [G]throw it back to [Dsus4]you
[Em7]By now you should've somehow
Realised [G]what you gotta [Dsus4]do
[Em7]I don't believe that [G]anybody
[A7sus4]Feels the way I do
About you [Dsus4]now
{end_of_verse}

{start_of_verse: Verse 2}
[Em7]Backbeat, the word is on the street
That the fire in your [G]heart is [Dsus4]out
[Em7]I'm sure you've heard it all before
But you never really [G]had a [Dsus4]doubt
[Em7]I don't believe that [G]anybody
[A7sus4]Feels the way I do
About you [Dsus4]now
{end_of_verse}

{start_of_bridge: Pre-Chorus}
And all the [C]roads we have to walk are [D]winding
And all the [C]lights that lead us there are [D]blinding
There are many [C]things that I would
Like to [D]say to you [Em7]but I don't know how
{end_of_bridge}

{start_of_chorus: Chorus}
Because [G]maybe
[Dsus4]You're gonna be the one that [Am]saves me
[C]And after all
[G]You're my wonder[Dsus4]wall
{end_of_chorus}`
      }
    ]
  },
  {
    id: '6',
    title: 'Hotel California',
    artist: 'Eagles',
    key: 'Bm',
    capo: 0,
    bpm: 75,
    texts: [
      {
        id: 't6',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Bm]On a dark desert highway, [F#]cool wind in my hair
[A]Warm smell of colitas [E]rising up through the air
[G]Up ahead in the distance, [D]I saw a shimmering light
[Em]My head grew heavy and my sight grew dim
[F#]I had to stop for the night
{end_of_verse}

{start_of_verse: Verse 2}
[Bm]There she stood in the doorway; [F#]I heard the mission bell
[A]And I was thinking to myself this could be
[E]heaven or this could be hell
[G]Then she lit up a candle [D]and she showed me the way
[Em]There were voices down the corridor,
[F#]I thought I heard them say:
{end_of_verse}

{start_of_chorus: Chorus}
[G]Welcome to the Hotel Cali[D]fornia
[F#]Such a lovely place (such a [Bm]lovely place)
Such a lovely [Em]face
[G]Plenty of room at the Hotel Cali[D]fornia
[F#]Any time of year (any [Em]time of year)
You can find it [F#]here
{end_of_chorus}`
      }
    ]
  }
];

const SETLISTS = [
  {
    id: 'sl1',
    name: 'Sunday Service',
    songIds: ['1', '3', '2', '4']
  },
  {
    id: 'sl2',
    name: 'Open Mic Night',
    songIds: ['5', '6', '1']
  },
  {
    id: 'sl3',
    name: 'Campfire Set',
    songIds: ['2', '3', '4', '5', '6']
  }
];
