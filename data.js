// data.js — sample songs using public domain / traditional material only
// All songs below are in the public domain (pre-1928 compositions, traditional folk).

const SONGS = [
  {
    id: 'pd-001',
    title: 'Scarborough Fair',
    artist: 'Traditional English',
    key: 'Am',
    capo: 0,
    bpm: 76,
    texts: [
      {
        id: 'pd-001-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Am]Are you going to [G]Scarborough [Am]Fair?
[C]Parsley, [Am]sage, rose[C]mary [D]and [Am]thyme
Re[C]member me to [Em]one who lives [Am]there
[Am]She once [C]was a [D]true love of [Am]mine
{end_of_verse}

{start_of_verse: Verse 2}
[Am]Tell her to make me a [G]cambric [Am]shirt
[C]Parsley, [Am]sage, rose[C]mary [D]and [Am]thyme
With[C]out no seams nor [Em]needle work
[Am]Then she'll [C]be a [D]true love of [Am]mine
{end_of_verse}

{start_of_verse: Verse 3}
[Am]Tell her to find me an [G]acre of [Am]land
[C]Parsley, [Am]sage, rose[C]mary [D]and [Am]thyme
Be[C]tween the salt water [Em]and the sea [Am]strand
[Am]Then she'll [C]be a [D]true love of [Am]mine
{end_of_verse}

{start_of_verse: Verse 4}
[Am]Tell her to reap it with a [G]sickle of [Am]leather
[C]Parsley, [Am]sage, rose[C]mary [D]and [Am]thyme
And [C]gather it all in a [Em]bunch of [Am]heather
[Am]Then she'll [C]be a [D]true love of [Am]mine
{end_of_verse}`
      }
    ]
  },
  {
    id: 'pd-002',
    title: 'Amazing Grace',
    artist: 'John Newton (1772)',
    key: 'G',
    capo: 0,
    bpm: 68,
    texts: [
      {
        id: 'pd-002-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[G]Amazing [G7]grace how [C]sweet the [G]sound
That saved a [G]wretch like [D]me
[G]I once was [G7]lost but [C]now am [G]found
Was [G]blind but [D]now I [G]see
{end_of_verse}

{start_of_verse: Verse 2}
[G]'Twas grace that [G7]taught my [C]heart to [G]fear
And grace my [G]fears re[D]lieved
[G]How precious [G7]did that [C]grace ap[G]pear
The [G]hour I [D]first be[G]lieved
{end_of_verse}

{start_of_verse: Verse 3}
[G]Through many [G7]dangers, [C]toils and [G]snares
I have al[G]ready [D]come
[G]'Tis grace has [G7]brought me [C]safe thus [G]far
And [G]grace will [D]lead me [G]home
{end_of_verse}

{start_of_verse: Verse 4}
[G]When we've been [G7]there ten [C]thousand [G]years
Bright shining [G]as the [D]sun
[G]We've no less [G7]days to [C]sing God's [G]praise
Than [G]when we'd [D]first be[G]gun
{end_of_verse}`
      }
    ]
  },
  {
    id: 'pd-003',
    title: 'Greensleeves',
    artist: 'Traditional English (16th century)',
    key: 'Am',
    capo: 0,
    bpm: 80,
    texts: [
      {
        id: 'pd-003-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Am]Alas my love [C]you do me [G]wrong
To [G]cast me off dis[Am]courteously
For [Am]I have loved [C]you so [G]long
De[G]lighting in your [Am]company
{end_of_verse}

{start_of_chorus: Chorus}
[C]Greensleeves was [G]all my joy
[G]Greensleeves was [Am]my delight
[C]Greensleeves was my [G]heart of gold
And [G]who but my Lady [Am]Greensleeves
{end_of_chorus}

{start_of_verse: Verse 2}
[Am]I have been ready [C]at your hand
To [G]grant whatever [Am]you would crave
[Am]I have both waged [C]life and [G]land
Your [G]love and good will [Am]for to have
{end_of_verse}

{start_of_chorus: Chorus}
[C]Greensleeves was [G]all my joy
[G]Greensleeves was [Am]my delight
[C]Greensleeves was my [G]heart of gold
And [G]who but my Lady [Am]Greensleeves
{end_of_chorus}

{start_of_verse: Verse 3}
[Am]My men were clothed [C]all in [G]green
And [G]they did ever [Am]wait on thee
[Am]All this was gallant [C]to be [G]seen
And [G]yet thou wouldst not [Am]love me
{end_of_verse}

{start_of_chorus: Chorus}
[C]Greensleeves was [G]all my joy
[G]Greensleeves was [Am]my delight
[C]Greensleeves was my [G]heart of gold
And [G]who but my Lady [Am]Greensleeves
{end_of_chorus}`
      }
    ]
  },
  {
    id: 'pd-004',
    title: 'Danny Boy',
    artist: 'Traditional Irish (Londonderry Air)',
    key: 'G',
    capo: 0,
    bpm: 60,
    texts: [
      {
        id: 'pd-004-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
Oh [G]Danny Boy, the pipes, the [G7]pipes are [C]calling
From glen to [G]glen and down the [D]mountain [D7]side
The summer's [G]gone and all the [G7]roses [C]falling
It's you, it's [G]you must go and [D]I must [G]bide
{end_of_verse}

{start_of_verse: Verse 2}
But come ye [G]back when summer's [G7]in the [C]meadow
Or when the [G]valley's hushed and [D]white with [D7]snow
It's I'll be [G]there in sunshine [G7]or in [C]shadow
Oh Danny [G]Boy, oh Danny [D]Boy, I love you [G]so
{end_of_verse}

{start_of_verse: Verse 3}
But if ye [G]come and all the [G7]flowers are [C]dying
If I am [G]dead, as dead I [D]well may [D7]be
Ye'll come and [G]find the place where [G7]I am [C]lying
And kneel and [G]say an Ave [D]there for [G]me
{end_of_verse}

{start_of_verse: Verse 4}
And I shall [G]hear, though soft you [G7]tread a[C]bove me
And all my [G]grave will warmer, [D]sweeter [D7]be
For you will [G]bend and tell me [G7]that you [C]love me
And I shall [G]sleep in peace un[D]til you [G]come to me
{end_of_verse}`
      }
    ]
  },
  {
    id: 'pd-005',
    title: 'House of the Rising Sun',
    artist: 'Traditional American Folk',
    key: 'Am',
    capo: 0,
    bpm: 78,
    texts: [
      {
        id: 'pd-005-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Am]There is a [C]house in [D]New Or[F]leans
They [Am]call the [C]Rising [E]Sun
[Am]And it's been the [C]ruin of [D]many a poor [F]girl
And [Am]me, oh [E]God, I'm [Am]one
{end_of_verse}

{start_of_verse: Verse 2}
[Am]My mother [C]was a [D]tailor
She [Am]sewed my [C]new blue [E]jeans
[Am]My sweetheart [C]was a [D]gambler, Lord
Down [Am]in New Or[E]leans
{end_of_verse}

{start_of_verse: Verse 3}
[Am]Now the only [C]thing a [D]gambler [F]needs
Is a [Am]suitcase [C]and a [E]trunk
[Am]And the only [C]time he's [D]satisfied
Is [Am]when he's on a [E]drunk
{end_of_verse}

{start_of_verse: Verse 4}
[Am]Oh mother [C]tell your [D]children
Not to [Am]do what [C]I have [E]done
[Am]Spend your lives in [C]sin and [D]misery
In the [Am]House of the [E]Rising [Am]Sun
{end_of_verse}`
      }
    ]
  },
  {
    id: 'pd-006',
    title: 'Wayfaring Stranger',
    artist: 'Traditional American Spiritual',
    key: 'Dm',
    capo: 0,
    bpm: 72,
    texts: [
      {
        id: 'pd-006-t1',
        label: 'Original',
        format: 'chordpro',
        language: 'en',
        content: `{start_of_verse: Verse 1}
[Dm]I am a poor wayfaring [Dm]stranger
Trav'ling through [F]this world of [Dm]woe
Yet there's no [Dm]sickness, toil nor [Gm]danger
In that bright [Dm]land to [A]which I [Dm]go
{end_of_verse}

{start_of_chorus: Chorus}
I'm going [F]there to see my [C]father
I'm going [Dm]there no more to [Dm]roam
I'm just going [F]over Jordan
I'm just going [A]over [Dm]home
{end_of_chorus}

{start_of_verse: Verse 2}
[Dm]I know dark clouds will gather [Dm]round me
I know my [F]way is rough and [Dm]steep
Yet beauteous [Dm]fields lie just be[Gm]fore me
Where God's re[Dm]deemed their [A]vigils [Dm]keep
{end_of_verse}

{start_of_chorus: Chorus}
I'm going [F]there to see my [C]mother
She said she'd [Dm]meet me when I [Dm]come
I'm just going [F]over Jordan
I'm just going [A]over [Dm]home
{end_of_chorus}`
      }
    ]
  }
];

const SETLISTS = [
  {
    id: 'sl-demo-1',
    name: 'Folk Evening',
    songIds: ['pd-001', 'pd-003', 'pd-005', 'pd-006']
  },
  {
    id: 'sl-demo-2',
    name: 'Hymns',
    songIds: ['pd-002', 'pd-004']
  }
];
