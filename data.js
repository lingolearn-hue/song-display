// data.js — public domain songs across genres and languages
// All compositions are in the public domain (pre-1928 or traditional folk/spiritual).

const SONGS = [

  // ── English folk & traditional ───────────────────────────

  {
    id: 'pd-001',
    title: 'Scarborough Fair',
    artist: 'Traditional English',
    key: 'Am', capo: 0, bpm: 76,
    texts: [{
      id: 'pd-001-t1', label: 'Original', format: 'chordpro', language: 'en',
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
{end_of_verse}`
    }]
  },

  {
    id: 'pd-002',
    title: 'Amazing Grace',
    artist: 'John Newton (1772)',
    key: 'G', capo: 0, bpm: 68,
    texts: [{
      id: 'pd-002-t1', label: 'Original', format: 'chordpro', language: 'en',
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
    }]
  },

  {
    id: 'pd-003',
    title: 'Greensleeves',
    artist: 'Traditional English (16th century)',
    key: 'Am', capo: 0, bpm: 80,
    texts: [{
      id: 'pd-003-t1', label: 'Original', format: 'chordpro', language: 'en',
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
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-004',
    title: 'Danny Boy',
    artist: 'Traditional Irish (Londonderry Air)',
    key: 'G', capo: 0, bpm: 60,
    texts: [{
      id: 'pd-004-t1', label: 'Original', format: 'chordpro', language: 'en',
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
{end_of_verse}`
    }]
  },

  {
    id: 'pd-005',
    title: 'House of the Rising Sun',
    artist: 'Traditional American Folk',
    key: 'Am', capo: 0, bpm: 78,
    texts: [{
      id: 'pd-005-t1', label: 'Original', format: 'chordpro', language: 'en',
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
    }]
  },

  {
    id: 'pd-006',
    title: 'Wayfaring Stranger',
    artist: 'Traditional American Spiritual',
    key: 'Dm', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-006-t1', label: 'Original', format: 'chordpro', language: 'en',
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
    }]
  },

  {
    id: 'pd-007',
    title: 'Oh! Susanna',
    artist: 'Stephen Foster (1848)',
    key: 'G', capo: 0, bpm: 110,
    texts: [{
      id: 'pd-007-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]I come from Alabama with my [G]banjo on my knee
I'm [G]going to Louisiana, my [D7]true love for to see
It [G]rained all night the day I left, the [G]weather it was dry
The [G]sun so hot I froze to death, Su[D7]sanna don't you [G]cry
{end_of_verse}

{start_of_chorus: Chorus}
Oh [G]Susanna, oh don't you cry for [G]me
For I [G]come from Alabama with my [D7]banjo on my [G]knee
{end_of_chorus}

{start_of_verse: Verse 2}
[G]I had a dream the other night when [G]everything was still
I [G]thought I saw Susanna a-[D7]coming down the hill
A [G]buckwheat cake was in her mouth, a [G]tear was in her eye
Says [G]I, I'm coming from the South, Su[D7]sanna don't you [G]cry
{end_of_verse}

{start_of_chorus: Chorus}
Oh [G]Susanna, oh don't you cry for [G]me
For I [G]come from Alabama with my [D7]banjo on my [G]knee
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-008',
    title: 'When the Saints Go Marching In',
    artist: 'Traditional Gospel',
    key: 'G', capo: 0, bpm: 120,
    texts: [{
      id: 'pd-008-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]I have a loving [G]brother
He is gone on [D7]before
And I promised I would meet him
When they [G]gather round the [G]shore
{end_of_verse}

{start_of_chorus: Chorus}
Oh when the [G]saints go marching [G]in
Oh when the saints go [D7]marching in
Lord how I [G]want to be in that [C]number
When the [G]saints go [D7]marching [G]in
{end_of_chorus}

{start_of_verse: Verse 2}
[G]I have a loving [G]sister
She is gone on [D7]before
And I promised I would meet her
When they [G]gather round the [G]shore
{end_of_verse}

{start_of_chorus: Chorus}
Oh when the [G]saints go marching [G]in
Oh when the saints go [D7]marching in
Lord how I [G]want to be in that [C]number
When the [G]saints go [D7]marching [G]in
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-009',
    title: 'Swing Low, Sweet Chariot',
    artist: 'Traditional Spiritual',
    key: 'D', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-009-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_chorus: Chorus}
[D]Swing low, sweet [G]chariot
[D]Coming for to carry me [A]home
[D]Swing low, sweet [G]chariot
[D]Coming for to [A]carry me [D]home
{end_of_chorus}

{start_of_verse: Verse 1}
[D]I looked over Jordan and [G]what did I see
[D]Coming for to carry me [A]home
A [D]band of angels [G]coming after me
[D]Coming for to [A]carry me [D]home
{end_of_chorus}

{start_of_chorus: Chorus}
[D]Swing low, sweet [G]chariot
[D]Coming for to carry me [A]home
[D]Swing low, sweet [G]chariot
[D]Coming for to [A]carry me [D]home
{end_of_chorus}

{start_of_verse: Verse 2}
[D]If you get there before I [G]do
[D]Coming for to carry me [A]home
Tell all my [D]friends I'm [G]coming too
[D]Coming for to [A]carry me [D]home
{end_of_verse}`
    }]
  },

  {
    id: 'pd-010',
    title: 'Clementine',
    artist: 'Percy Montrose (1884)',
    key: 'G', capo: 0, bpm: 100,
    texts: [{
      id: 'pd-010-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]In a cavern, in a canyon
Ex[D7]cavating for a mine
Dwelt a [G]miner, forty-niner
And his [D7]daughter Clemen[G]tine
{end_of_verse}

{start_of_chorus: Chorus}
Oh my [G]darling, oh my darling
Oh my [D7]darling Clemen[G]tine
You are [G]lost and gone forever
Dreadful [D7]sorry, Clemen[G]tine
{end_of_chorus}

{start_of_verse: Verse 2}
[G]Light she was and like a fairy
And her [D7]shoes were number nine
Herring [G]boxes without topses
Sandals [D7]were for Clemen[G]tine
{end_of_verse}

{start_of_chorus: Chorus}
Oh my [G]darling, oh my darling
Oh my [D7]darling Clemen[G]tine
You are [G]lost and gone forever
Dreadful [D7]sorry, Clemen[G]tine
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-011',
    title: 'Auld Lang Syne',
    artist: 'Robert Burns (1788)',
    key: 'G', capo: 0, bpm: 88,
    texts: [{
      id: 'pd-011-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]Should auld acquaintance [G]be forgot
And [C]never brought to [G]mind
Should [G]auld acquaintance [Em]be forgot
And [A7]auld lang [D7]syne
{end_of_verse}

{start_of_chorus: Chorus}
For [G]auld lang [D7]syne, my dear
For [G]auld lang [C]syne
We'll [G]tak' a cup o' [Em]kindness yet
For [G]auld [D7]lang [G]syne
{end_of_chorus}

{start_of_verse: Verse 2}
[G]And there's a hand my [G]trusty friend
And [C]give a hand o' [G]thine
We'll [G]tak' a cup o' [Em]kindness yet
For [A7]auld lang [D7]syne
{end_of_verse}

{start_of_chorus: Chorus}
For [G]auld lang [D7]syne, my dear
For [G]auld lang [C]syne
We'll [G]tak' a cup o' [Em]kindness yet
For [G]auld [D7]lang [G]syne
{end_of_chorus}`
    }]
  },

  // ── German ───────────────────────────────────────────────

  {
    id: 'pd-012',
    title: 'Stille Nacht',
    artist: 'Franz Xaver Gruber (1818)',
    key: 'C', capo: 0, bpm: 60,
    texts: [
      {
        id: 'pd-012-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[C]Stille Nacht, [G7]heilige [C]Nacht
Alles [C]schläft; [G7]einsam wacht
Nur das [F]traute hochheilige [C]Paar
Holder [F]Knabe im lockigen [C]Haar
[G7]Schlaf in himmlischer [C]Ruh
[G7]Schlaf in himmlischer [C]Ruh
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Stille Nacht, [G7]heilige [C]Nacht
Hirten [C]erst kund[G7]gemacht
Durch der [F]Engel Halleluja
Tönt es [F]laut von fern und [C]nah
[G7]Christ der Retter ist [C]da
[G7]Christ der Retter ist [C]da
{end_of_verse}`
      },
      {
        id: 'pd-012-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[C]Silent night, [G7]holy [C]night
All is [C]calm, [G7]all is bright
Round yon [F]virgin mother and [C]child
Holy [F]infant so tender and [C]mild
[G7]Sleep in heavenly [C]peace
[G7]Sleep in heavenly [C]peace
{end_of_verse}

{start_of_verse: Verse 2}
[C]Silent night, [G7]holy [C]night
Shepherds [C]quake at the [G7]sight
Glories [F]stream from heaven a[C]far
Heavenly [F]hosts sing alleluia
[G7]Christ the Saviour is [C]born
[G7]Christ the Saviour is [C]born
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-013',
    title: 'Lili Marleen',
    artist: 'Norbert Schultze (1938)',
    key: 'C', capo: 0, bpm: 84,
    texts: [
      {
        id: 'pd-013-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[C]Vor der Ka[F]serne, vor dem [C]großen Tor
Stand eine [F]Laterne, und steht sie [C]noch davor
So [G7]woll'n wir uns da wie[C]dersehen
Bei der [F]Laterne woll'n wir [C]stehen
Wie einst [G7]Lili Mar[C]leen
Wie einst [G7]Lili Mar[C]leen
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Unsere bei[F]den Schatten sah'n wie [C]einer aus
Daß wir so [F]lieb uns hatten das sah man [C]gleich daraus
Und [G7]alle Leute soll'n es [C]seh'n
Wenn wir bei der Laterne [C]steh'n
Wie einst [G7]Lili Mar[C]leen
Wie einst [G7]Lili Mar[C]leen
{end_of_verse}`
      },
      {
        id: 'pd-013-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[C]Underneath the [F]lantern by the [C]barrack gate
Darling I re[F]member the way you used to [C]wait
'Twas [G7]there that you whispered [C]tenderly
That you loved me, you'd always [C]be
My [G7]Lili of the [C]lamplight
My own [G7]Lili Mar[C]leen
{end_of_verse}

{start_of_verse: Verse 2}
[C]Time would come for [F]roll call, time for us to [C]part
Darling I'd ca[F]ress you and press you to my [C]heart
And [G7]there 'neath that far-off lan[C]tern light
I'd hold you tight, we'd kiss good[C]night
My [G7]Lili of the [C]lamplight
My own [G7]Lili Mar[C]leen
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-014',
    title: 'Edelweiß',
    artist: 'Traditional Austrian Folk',
    key: 'C', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-014-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[C]Edelweiß, [G7]Edelweiß
[C]Jeden Morgen grüß ich [F]dich
[C]Blüh und weiß, [Am]frisch und rein
[F]Schaust mich an, [C]glücklich zu [G7]sein
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Blüte [G7]weiß, [C]blüte [G7]weiß
[C]Blüh für immer in [F]Österreich
[C]Blüh für [Am]immer, blüh für [F]lang
[C]Heimatland, [G7]Heimat[C]land
{end_of_verse}`
    }]
  },

  // ── French ───────────────────────────────────────────────

  {
    id: 'pd-015',
    title: 'Au Clair de la Lune',
    artist: 'Traditional French (18th century)',
    key: 'G', capo: 0, bpm: 90,
    texts: [
      {
        id: 'pd-015-t1', label: 'Français', format: 'chordpro', language: 'fr',
        content: `{start_of_verse: Couplet 1}
[G]Au clair de la [D7]lune
Mon ami Pier[G]rot
Prête-moi ta [G]plume
Pour écrire un [D7]mot
Ma chandelle est [G]morte
Je n'ai plus de [D7]feu
Ouvre-moi ta [G]porte
Pour l'amour de [D7]Dieu
{end_of_verse}

{start_of_verse: Couplet 2}
[G]Au clair de la [D7]lune
Pierrot ré[G]pondit
Je n'ai pas de [G]plume
Je suis dans mon [D7]lit
Va chez la voi[G]sine
Je crois qu'elle y [D7]est
Car dans sa cui[G]sine
On bat le bri[D7]quet
{end_of_verse}`
      },
      {
        id: 'pd-015-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]By the light of the [D7]moonbeam
My dear friend Pier[G]rot
Lend your pen to [G]write for me
Just a word or [D7]so
My candle has [G]died out
I have lost my [D7]light
Open up your [G]door to me
For the love of [D7]God
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-016',
    title: 'Frère Jacques',
    artist: 'Traditional French',
    key: 'G', capo: 0, bpm: 100,
    texts: [
      {
        id: 'pd-016-t1', label: 'Français', format: 'chordpro', language: 'fr',
        content: `{start_of_verse: Couplet}
[G]Frère Jacques, [G]Frère Jacques
[G]Dormez-vous? [G]Dormez-vous?
[G]Sonnez les ma[G]tines
[G]Sonnez les ma[G]tines
[G]Din din [G]don
[G]Din din [G]don
{end_of_verse}`
      },
      {
        id: 'pd-016-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse}
[G]Are you sleeping, [G]are you sleeping
[G]Brother John? [G]Brother John?
[G]Morning bells are [G]ringing
[G]Morning bells are [G]ringing
[G]Ding ding [G]dong
[G]Ding ding [G]dong
{end_of_verse}`
      }
    ]
  },

  // ── Spanish ──────────────────────────────────────────────

  {
    id: 'pd-017',
    title: 'La Bamba',
    artist: 'Traditional Mexican Folk',
    key: 'C', capo: 0, bpm: 130,
    texts: [{
      id: 'pd-017-t1', label: 'Español', format: 'chordpro', language: 'es',
      content: `{start_of_verse: Verso 1}
[C]Para bailar la [F]bamba
Para bailar la [G7]bamba
Se necesita una [C]poca de [F]gracia
Una poca de [G7]gracia y otra co[C]sita
Y arriba y a[F]rriba
Y arriba y a[G7]rriba y a[C]rriba iré
{end_of_verse}

{start_of_chorus: Estribillo}
Yo no soy ma[F]rinero
Yo no soy ma[G7]rinero, soy capitán
Soy capi[C]tán, soy capi[F]tán
[G7]Bamba, bamba
[C]Bamba, bamba [F]bamba
[G7]Bamba, bam[C]ba
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-018',
    title: 'Cielito Lindo',
    artist: 'Quirino Mendoza y Cortés (1882)',
    key: 'G', capo: 0, bpm: 116,
    texts: [{
      id: 'pd-018-t1', label: 'Español', format: 'chordpro', language: 'es',
      content: `{start_of_verse: Verso 1}
[G]De la sierra mo[D7]rena
Cielito [G]lindo vienen bajando
Un par de [D7]ojitos negros
Cielito [G]lindo de contrabando
{end_of_verse}

{start_of_chorus: Estribillo}
[G]Ay, ay, ay, [D7]ay
Canta y no [G]llores
Porque cantando se [D7]alegran
Cielito [G]lindo los corazones
{end_of_chorus}

{start_of_verse: Verso 2}
[G]Ese lunar que [D7]tienes
Cielito [G]lindo junto a la boca
No se lo des a [D7]nadie
Cielito [G]lindo que a mí me toca
{end_of_verse}

{start_of_chorus: Estribillo}
[G]Ay, ay, ay, [D7]ay
Canta y no [G]llores
Porque cantando se [D7]alegran
Cielito [G]lindo los corazones
{end_of_chorus}`
    }]
  },

  // ── Italian ──────────────────────────────────────────────

  {
    id: 'pd-019',
    title: 'O Sole Mio',
    artist: 'Eduardo di Capua (1898)',
    key: 'G', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-019-t1', label: 'Italiano', format: 'chordpro', language: 'it',
        content: `{start_of_verse: Strofa 1}
[G]Che bella cosa [D7]na jurnata 'e sole
N'aria se[G]rena doppo na [D7]tempesta
Pe' ll'aria [G]fresca pare già na [D7]festa
Che bella [G]cosa na jurnata 'e [D7]sole
{end_of_verse}

{start_of_chorus: Ritornello}
[G]Ma n'atu sole
Cchiù bello, [D7]oi ne'
'O sole [G]mio
Sta 'nfronte a [D7]te
[G]Sta 'nfronte a [D7]te
[G]'O sole, [D7]'o sole mio
Sta 'nfronte a [G]te
Sta 'nfronte a [D7]te
{end_of_chorus}`
      },
      {
        id: 'pd-019-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]What a wonderful [D7]thing is a sunny day
The sky is [G]clear after a [D7]storm
The air is [G]cool and the sun is [D7]bright
What a wonderful [G]thing is a sunny [D7]day
{end_of_verse}

{start_of_chorus: Chorus}
[G]But another sun
Even brighter, [D7]oh my
My own [G]sunshine
Is the face of [D7]thee
[G]The face of [D7]thee
[G]Oh sunshine, [D7]my own sunshine
Shines from the face of [G]thee
Shines from the face of [D7]thee
{end_of_chorus}`
      }
    ]
  },

  // ── Portuguese ───────────────────────────────────────────

  {
    id: 'pd-020',
    title: 'Asa Branca',
    artist: 'Luiz Gonzaga / Humberto Teixeira (1947)',
    key: 'G', capo: 0, bpm: 96,
    texts: [{
      id: 'pd-020-t1', label: 'Português', format: 'chordpro', language: 'pt',
      content: `{start_of_verse: Verso 1}
[G]Quando oiei a terra ardendo
Qual a [D7]fogueira de São João
Eu perguntei a [G]Deus do céu, ai
Por que tamanha [D7]judiação
{end_of_verse}

{start_of_verse: Verso 2}
[G]Que braseiro, que [D7]fornalha
Nem um [G]pé de plantação
Por falta d'água [G]perdi meu gado
Morreu de [D7]sede meu alazão
{end_of_verse}

{start_of_chorus: Refrão}
[G]Até mesmo a [C]asa branca
Bateu [G]asas do sertão
Então eu disse, a[D7]deus Rosélia
Adeus [G]Rosélia, guarda [D7]contigo
O meu co[G]ração
{end_of_chorus}`
    }]
  },

  // ── Dutch ────────────────────────────────────────────────

  {
    id: 'pd-021',
    title: 'Het Wilhelmus',
    artist: 'Philips van Marnix (c. 1572)',
    key: 'C', capo: 0, bpm: 72,
    texts: [
      {
        id: 'pd-021-t1', label: 'Nederlands', format: 'chordpro', language: 'nl',
        content: `{start_of_verse: Couplet 1}
[C]Wilhelmus van Nas[F]souwe
Ben ik van [C]Duitsen bloed
Den vader[F]land getrouwe
Blijf ik tot in den [C]dood
Een Prins van O[F]ranje
Ben ik vrij onver[C]veerd
Den Koning van His[F]panje
Heb ik altijd ge[C]eerd
{end_of_verse}

{start_of_verse: Couplet 6}
[C]Mijn schild ende be[F]trouwen
Zijt Gij o God mijn [C]Heer
Op U zo wil ik [F]bouwen
Verlaat mij nimmer[C]meer
Dat ik doch vroom mag [F]blijven
Uw dienaar t'aller [C]stond
Die tyranny ver[F]drijven
Die mij mijn hart [C]doorwondt
{end_of_verse}`
      },
      {
        id: 'pd-021-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[C]William of Nassau [F]am I
Of [C]German blood proud
True to the [F]fatherland
I will re[C]main till death
A Prince of O[F]range
Am I, free and fearless
The King of His[C]pania
Have I always hon[F]oured
{end_of_verse}`
      }
    ]
  },

  // ── National anthems ─────────────────────────────────────

  {
    id: 'pd-022',
    title: 'La Marseillaise',
    artist: 'Claude Joseph Rouget de Lisle (1792)',
    key: 'G', capo: 0, bpm: 88,
    texts: [
      {
        id: 'pd-022-t1', label: 'Français', format: 'chordpro', language: 'fr',
        content: `{start_of_verse: Couplet 1}
[G]Allons enfants de la [D7]Patrie
Le [G]jour de gloire est ar[D7]rivé
Contre nous de la ty[G]rannie
L'étendard san[D7]glant est le[G]vé
Entendez-vous dans les [C]campagnes
Mugir ces fé[G]roces sol[D7]dats
Ils viennent jusque dans [G]nos bras
Égorger vos [D7]fils, vos com[G]pagnes
{end_of_verse}

{start_of_chorus: Refrain}
Aux [G]armes citoyens
Formez vos [D7]bataillons
Mar[G]chons, mar[C]chons
Qu'un sang im[G]pur
Abreuve nos [D7]sil[G]lons
{end_of_chorus}`
      },
      {
        id: 'pd-022-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]Arise, children of the [D7]Fatherland
The [G]day of glory has ar[D7]rived
Against us tyranny's
Bloody [G]banner is raised
Do you hear in the [C]countryside
The roar of those [G]ferocious [D7]soldiers
They're coming right into your [G]arms
To cut the throats of your sons and [D7]companions
{end_of_verse}

{start_of_chorus: Chorus}
To [G]arms, citizens
Form your [D7]battalions
March, [G]march
Let impure [C]blood
Water our [G]furrows
{end_of_chorus}`
      }
    ]
  },

  {
    id: 'pd-023',
    title: 'God Save the King',
    artist: 'Traditional British (c. 1745)',
    key: 'G', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-023-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]God save our gracious [D7]King
[G]Long live our noble [D7]King
[G]God save the [C]King
Send him vic[G]torious
Happy and [D7]glorious
Long to reign [G]over [D7]us
[G]God save the [G]King
{end_of_verse}

{start_of_verse: Verse 2}
[G]O Lord our God a[D7]rise
[G]Scatter his ene[D7]mies
[G]And make them [C]fall
Confound their [G]politics
Frustrate their [D7]knavish tricks
On Thee our [G]hopes we [D7]fix
[G]God save us [G]all
{end_of_verse}`
    }]
  },

  {
    id: 'pd-024',
    title: 'Das Deutschlandlied',
    artist: 'August Heinrich Hoffmann (1841)',
    key: 'C', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-024-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 3}
[C]Einigkeit und Recht und [G7]Freiheit
Für das [C]deutsche Vater[F]land
Danach lasst uns [C]alle streben
Brüderlich mit [G7]Herz und [C]Hand
Einigkeit und Recht und [F]Freiheit
Sind des [C]Glückes Unter[G7]pfand
Blüh im Glanze [C]dieses Glückes
Blühe, deutsches [G7]Vater[C]land
{end_of_verse}`
      },
      {
        id: 'pd-024-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 3}
[C]Unity and justice and [G7]freedom
For the [C]German father[F]land
For these let us all be striving
Brotherly with heart and [G7]hand
Unity and justice and [F]freedom
Are the [C]pledge of for[G7]tune's favour
Flourish in the [C]glory of this fortune
Flourish, German [G7]father[C]land
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-025',
    title: 'The Star-Spangled Banner',
    artist: 'Francis Scott Key (1814)',
    key: 'Bb', capo: 0, bpm: 60,
    texts: [{
      id: 'pd-025-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[Bb]Oh, say can you [F]see
By the [Bb]dawn's early [Eb]light
What so [Bb]proudly we [F]hailed
At the [Bb]twilight's last [F]gleaming
Whose broad [Bb]stripes and bright [Eb]stars
Through the [Bb]perilous [F]fight
O'er the [Bb]ramparts we [Eb]watched
Were so [F]gallantly streaming
And the [Bb]rockets' red glare
The [Eb]bombs bursting in [Bb]air
Gave [F]proof through the night
That our [Bb]flag was still [F]there
{end_of_verse}

{start_of_chorus: Chorus}
Oh [Bb]say does that [Eb]star-spangled [Bb]banner yet [F]wave
O'er the [Bb]land of the [Eb]free
And the [F]home of the [Bb]brave
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-026',
    title: 'Advance Australia Fair',
    artist: 'Peter Dodds McCormick (1878)',
    key: 'G', capo: 0, bpm: 76,
    texts: [{
      id: 'pd-026-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]Australians all let us re[C]joice
For we are [G]young and [D7]free
We've golden [G]soil and wealth for [C]toil
Our home is [D7]girt by [G]sea
Our land a[C]bounds in nature's gifts
Of beauty [G]rich and [D7]rare
In his[G]tory's page let every [C]stage
Advance Aus[D7]tralia [G]fair
{end_of_verse}

{start_of_chorus: Chorus}
In [G]joyful strains then [C]let us [G]sing
Advance Aus[D7]tralia [G]fair
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-027',
    title: 'Ô Canada',
    artist: 'Calixa Lavallée (1880)',
    key: 'G', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-027-t1', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse}
[G]O Canada, our home and [D7]native [G]land
True patriot [G7]love in all of us com[C]mand
With glowing [G]hearts we see thee [D7]rise
The True North [G]strong and [D7]free
From far and [G]wide, O [Em]Canada
We stand on [D]guard for [D7]thee
[G]God keep our land [G7]glorious and [C]free
[G]O Canada, we stand on guard for [D7]thee
[G]O Canada, we stand on guard for [D7]thee
{end_of_verse}`
      },
      {
        id: 'pd-027-t2', label: 'Français', format: 'chordpro', language: 'fr',
        content: `{start_of_verse: Couplet}
[G]Ô Canada, terre de nos aï[D7]eux
Ton front est [G7]ceint de fleurons glo[C]rieux
Car ton bras [G]sait porter l'é[D7]pée
Il sait porter la [G]croix
Ton his[G]toire est une é[Em]popée
Des plus bril[D]lants ex[D7]ploits
[G]Et ta valeur, de [G7]foi trempée
Pro[C]tégera nos [G]foyers et nos [D7]droits
Pro[G]tégera nos [D7]foyers et nos [G]droits
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-028',
    title: 'Het Wilhelmus (NL Anthem)',
    artist: 'Traditional Dutch (1572)',
    key: 'G', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-028-t1', label: 'Nederlands', format: 'chordpro', language: 'nl',
      content: `{start_of_verse: Couplet 1}
[G]Wilhelmus van Nas[C]souwe
Ben ik van [G]Duitsen [D7]bloed
Den vader[G]land ge[C]trouwe
Blijf ik tot in den [G]dood
Een Prins van O[C]ranje
Ben ik vrij on[G]ver[D7]veerd
Den Koning van His[G]panje
Heb ik altijd ge[D7]eerd
{end_of_verse}`
    }]
  },

  // ── Irish / Celtic ───────────────────────────────────────

  {
    id: 'pd-029',
    title: 'The Wild Rover',
    artist: 'Traditional Irish',
    key: 'G', capo: 0, bpm: 108,
    texts: [{
      id: 'pd-029-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]I've been a wild rover for many a year
And I [C]spent all me money on [G]whiskey and beer
And now I'm returning with gold in great store
And I [C]never will play the wild [G]rover no [D7]more
{end_of_verse}

{start_of_chorus: Chorus}
And it's [G]no, nay, never
[C]No nay never no [G]more
Will I [G]play the wild rover
No [D7]never no [G]more
{end_of_chorus}

{start_of_verse: Verse 2}
[G]I went to an ale house I used to frequent
And I [C]told the landlady my [G]money was spent
I asked her for credit, she answered me nay
Such a [C]custom as yours I can [G]have any [D7]day
{end_of_verse}

{start_of_chorus: Chorus}
And it's [G]no, nay, never
[C]No nay never no [G]more
Will I [G]play the wild rover
No [D7]never no [G]more
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-030',
    title: "Molly Malone (Cockles & Mussels)",
    artist: 'Traditional Irish',
    key: 'G', capo: 0, bpm: 92,
    texts: [{
      id: 'pd-030-t1', label: 'Original', format: 'chordpro', language: 'en',
      content: `{start_of_verse: Verse 1}
[G]In Dublin's fair city where [Em]girls are so pretty
I [G]first set my eyes on sweet [Am]Molly Ma[D7]lone
As she [G]wheeled her wheel barrow through [Em]streets broad and narrow
Crying [C]cockles and mussels a[D7]live alive [G]oh
{end_of_verse}

{start_of_chorus: Chorus}
A[G]live alive [Em]oh alive alive [Am]oh
Crying [C]cockles and mussels a[D7]live alive [G]oh
{end_of_chorus}

{start_of_verse: Verse 2}
[G]She was a fish monger and [Em]sure 'twas no wonder
For [G]so were her father and [Am]mother be[D7]fore
And they [G]each wheeled their barrow through [Em]streets broad and narrow
Crying [C]cockles and mussels a[D7]live alive [G]oh
{end_of_verse}

{start_of_chorus: Chorus}
A[G]live alive [Em]oh alive alive [Am]oh
Crying [C]cockles and mussels a[D7]live alive [G]oh
{end_of_chorus}`
    }]
  },

  // ── German folk & classical ──────────────────────────────

  {
    id: 'pd-031',
    title: 'Lorelei',
    artist: 'Friedrich Silcher (1837) / Heinrich Heine',
    key: 'G', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-031-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[G]Ich weiß nicht was soll es be[D7]deuten
Dass ich so traurig [G]bin
Ein Märchen aus alten [C]Zeiten
Das kommt mir nicht aus dem [G]Sinn
Die [G]Luft ist kühl und es [D7]dunkelt
Und ruhig fließt der [G]Rhein
Der Gipfel des Berges fun[D7]kelt
Im Abendsonnenschein
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Die schönste Jungfrau [D7]sitzet
Dort oben wunderbar
Ihr goldnes Geschmeide [G]blitzet
Sie kämmt ihr [C]goldenes Haar
Sie kämmt es mit [G]goldenem Kamme
Und singt ein [D7]Lied dabei
Das hat eine wundersame
Gewaltige Melodei
{end_of_verse}`
      },
      {
        id: 'pd-031-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]I cannot explain the sadness
That's [D7]fallen on my [G]breast
An old, old fable haunts me
And will [C]not let me [G]rest
The air is cool in the [D7]twilight
And calm flows the [G]Rhine
The mountain peaks are gleaming
In the [D7]fading evening shine
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-032',
    title: 'Müde bin ich, geh zur Ruh',
    artist: 'Traditional German lullaby',
    key: 'C', capo: 0, bpm: 60,
    texts: [{
      id: 'pd-032-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[C]Müde bin ich, geh zur [G7]Ruh
Schließe [C]beide Äuglein [F]zu
[C]Vater, lass die [G7]Augen dein
Über meinem [C]Bette sein
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Hab ich Unrecht heut ge[G7]tan
Sieh es lieber [C]Gott nicht [F]an
[C]Deine Gnad und [G7]Jesu Blut
Macht ja allen [C]Schaden gut
{end_of_verse}

{start_of_verse: Strophe 3}
[C]Alle die mir sind ver[G7]wandt
Gott, lass ruhn in dei[C]ner [F]Hand
[C]Alle Menschen groß und [G7]klein
Sollen dir befoh[C]len sein
{end_of_verse}`
    }]
  },

  {
    id: 'pd-033',
    title: 'Heidenröslein',
    artist: 'Franz Schubert (1815) / Goethe',
    key: 'G', capo: 0, bpm: 88,
    texts: [{
      id: 'pd-033-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[G]Sah ein Knab ein Rös[D7]lein stehn
Rös[G]lein auf der [C]Heiden
War so [G]jung und mor[D7]genschön
Lief er [G]schnell es nah zu sehn
Sah's mit [C]vielen [G]Freuden
[D7]Röslein, [G]Röslein, [C]Röslein [G]rot
[D7]Röslein auf der [G]Heiden
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Knabe sprach: Ich breche [D7]dich
Rös[G]lein auf der [C]Heiden
Rös[G]lein sprach: Ich ste[D7]che dich
Dass du e[G]wig denkst an mich
Und ich [C]will's nicht [G]leiden
[D7]Röslein, [G]Röslein, [C]Röslein [G]rot
[D7]Röslein auf der [G]Heiden
{end_of_verse}`
    }]
  },

  {
    id: 'pd-034',
    title: 'Der Lindenbaum',
    artist: 'Franz Schubert (1823) / Wilhelm Müller',
    key: 'E', capo: 0, bpm: 80,
    texts: [{
      id: 'pd-034-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[E]Am Brunnen vor dem [B7]Tore
Da steht ein [E]Lindenbaum
Ich träumt in seinem [A]Schatten
So manchen [E]süßen [B7]Traum
Ich schnitt in seine [E]Rinde
So manches liebe [B7]Wort
Es zog in Freud und [E]Leide
Zu ihm mich immer [B7]fort
{end_of_verse}

{start_of_verse: Strophe 2}
[E]Ich musst auch heute [B7]wandern
Vorbei in tiefer [E]Nacht
Da hab ich noch im [A]Dunkel
Die Augen zugemacht
Und seine Zweige [B7]rauschten
Als riefen sie mir [E]zu
Komm her zu [B7]mir Geselle
Hier findst du deine [E]Ruh
{end_of_verse}`
    }]
  },

  {
    id: 'pd-035',
    title: 'Kein schöner Land',
    artist: 'Anton Wilhelm von Zuccalmaglio (c. 1840)',
    key: 'G', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-035-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[G]Kein schöner Land in [C]dieser [G]Zeit
Als hier das unsre [D7]weit und [G]breit
Wo wir uns finden [C]wohl zusammen
Unter Linden[G]bäumen [D7]zu a[G]bendlicher Stund
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Da haben wir so [C]manche [G]Stund
Gesessen wohl in [D7]frohem [G]Bund
Und taten singen [C]die Lieder
Die schallten [G]wieder [D7]in die [G]Rund
{end_of_verse}

{start_of_verse: Strophe 3}
[G]Daß wir uns hier in [C]diesem [G]Tal
Noch treffen so viel [D7]hundert[G]mal
Gott mag es schenken [C]Gott mag es lenken
Er hat uns [G]allen so [D7]gnädig be[G]dacht
{end_of_verse}`
    }]
  },

  {
    id: 'pd-036',
    title: 'Muss i denn',
    artist: 'Friedrich Silcher (1827)',
    key: 'G', capo: 0, bpm: 100,
    texts: [{
      id: 'pd-036-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Vers 1}
[G]Muss i denn, muss i [D7]denn
Zum Städtele [G]raus
Städtele raus
Und du mein [G]Schatz bleibst [D7]hier
Wenn i komm, wenn i [G]komm
Wenn i wie[G]derkomm
Wiederkommen [D7]komm i ein mein [G]Schatz bei dir
{end_of_verse}

{start_of_verse: Vers 2}
[G]Wie du weinst, wie du [D7]weinst
Dass i wandere [G]muss
Wandere muss
Wie wenn d'Lieb jetzt [G]wär vor[D7]bei
Sind au drauß, sind au [G]drauß
Der Mädele [G]viel
Lieber Schatz, i [D7]bleib dir treu
{end_of_verse}`
    }]
  },

  {
    id: 'pd-037',
    title: 'Im Frühtau zu Berge',
    artist: 'Traditional German / Swedish origin',
    key: 'D', capo: 0, bpm: 108,
    texts: [{
      id: 'pd-037-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[D]Im Frühtau zu Berge wir [A7]zieh'n, fallera
Wir [D]wandern ohne Kummer und [G]Müh, falle[D]ra
Des [A7]sind wir Frühauf[D]steher so froh, fallera
Weil [D]droben die Sonne so [A7]golden schön [D]loht
{end_of_verse}

{start_of_chorus: Refrain}
Ihr [G]Schläfer, heraus, die Sonne scheint [D]rot
Ihr [G]Schläfer, heraus, die Sonne scheint [A7]rot
[D]Im Frühtau zu Berge wir [A7]zieh'n, fallera
[D]Im Frühtau zu Berge wir [A7]zieh'n falle[D]ra
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-038',
    title: 'Hänschen klein',
    artist: 'Franz Wiedemann (1857)',
    key: 'C', capo: 0, bpm: 112,
    texts: [{
      id: 'pd-038-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[C]Hänschen klein
Ging allein
In die weite [G7]Welt hinein
Stock und Hut
Steht ihm gut
Ist gar wohl ge[C]mut
Aber [F]Mutter weinet sehr
Hat ja nun kein [C]Hänschen mehr
[G7]Wünsch dir Glück
Sagt ihr Blick
Kehr nur bald zu[C]rück
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Sieben Jahr
Trüb und klar
Hänschen in der [G7]Fremde war
Da besinnt
Sich das Kind
Eilt nach Haus ge[C]schwind
[F]Doch nun ist's kein Häns[C]chen mehr
Nein, ein großer [G7]Hans ist er
Mit dem Stock
Durch den Wald
Kommt er heim schon [C]bald
{end_of_verse}`
    }]
  },

  // ── Chinese folk & traditional ───────────────────────────
  // Each song includes a 汉字 (Chinese characters) text and a Pīnyīn text.
  // Pinyin uses tone numbers for readability: ma1 = mā, ma2 = má, etc.

  {
    id: 'pd-039',
    title: '茉莉花 (Mòlìhuā)',
    artist: 'Traditional Chinese folk (Jiangsu)',
    key: 'G', capo: 0, bpm: 80,
    texts: [
      {
        id: 'pd-039-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[G]好一朵美丽的[D7]茉莉花
[G]好一朵美丽的[D7]茉莉花
[C]芬芳美丽[G]满枝桠
[D7]又香又白[G]人人夸
[G]让我来将你摘下
[D7]送给别人家
[G]茉莉花呀[D7]茉莉[G]花
{end_of_verse}`
      },
      {
        id: 'pd-039-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[G]Hǎo yī duǒ měilì de [D7]mòlìhuā
[G]Hǎo yī duǒ měilì de [D7]mòlìhuā
[C]Fēnfāng měilì [G]mǎn zhī yā
[D7]Yòu xiāng yòu bái [G]rén rén kuā
[G]Ràng wǒ lái jiāng nǐ zhāi xià
[D7]Sòng gěi bié rén jiā
[G]Mòlìhuā ya [D7]mòlì[G]huā
{end_of_verse}`
      },
      {
        id: 'pd-039-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]What a beautiful [D7]jasmine flower
[G]What a beautiful [D7]jasmine flower
[C]Fragrant and [G]lovely on every branch
[D7]White and sweet, [G]praised by all
[G]Let me pick you from your stem
[D7]And give you as a gift
[G]Jasmine flower, [D7]jasmine [G]flower
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-040',
    title: '月亮代表我的心 (Yuèliang Dàibiǎo Wǒ de Xīn)',
    artist: 'Sun Yi (1973) — melody traditional',
    key: 'C', capo: 0, bpm: 72,
    texts: [
      {
        id: 'pd-040-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[C]你问我爱你有多[G7]深
我爱你有几[Am]分
[F]我的情也真[C]我的爱也真
[G7]月亮代表我的[C]心
{end_of_verse}

{start_of_verse: 第二段}
[C]你问我爱你有多[G7]深
我爱你有几[Am]分
[F]我的情不移[C]我的爱不变
[G7]月亮代表我的[C]心
{end_of_verse}

{start_of_chorus: 副歌}
[Am]轻轻的一个吻
已经打动我的[Em]心
[F]深深的一段情
叫我思念到如[G7]今
{end_of_chorus}`
      },
      {
        id: 'pd-040-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[C]Nǐ wèn wǒ ài nǐ yǒu duō [G7]shēn
Wǒ ài nǐ yǒu jǐ [Am]fēn
[F]Wǒ de qíng yě zhēn [C]wǒ de ài yě zhēn
[G7]Yuèliang dàibiǎo wǒ de [C]xīn
{end_of_verse}

{start_of_chorus: Fùgē}
[Am]Qīngqīng de yī gè wěn
Yǐjīng dǎdòng wǒ de [Em]xīn
[F]Shēnshēn de yī duàn qíng
Jiào wǒ sīniàn dào rú[G7]jīn
{end_of_chorus}`
      },
      {
        id: 'pd-040-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[C]You ask how deeply I [G7]love you
How much do I love [Am]you
[F]My feelings are true, [C]my love is true
[G7]The moon represents my [C]heart
{end_of_verse}

{start_of_chorus: Chorus}
[Am]A gentle kiss
Has already moved my [Em]heart
[F]A deep and lasting love
Makes me think of you [G7]still today
{end_of_chorus}`
      }
    ]
  },

  {
    id: 'pd-041',
    title: '康定情歌 (Kāngdìng Qínggē)',
    artist: 'Traditional Sichuan folk',
    key: 'G', capo: 0, bpm: 84,
    texts: [
      {
        id: 'pd-041-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[G]跑马溜溜的山上
一朵溜溜的云哟
[D7]端端溜溜的照在
康定溜溜的城哟
[G]月亮弯弯
康定溜溜的城哟
{end_of_verse}

{start_of_verse: 第二段}
[G]李家溜溜的大姐
人才溜溜的好哟
[D7]张家溜溜的大哥
看上溜溜的她哟
[G]月亮弯弯
看上溜溜的她哟
{end_of_verse}`
      },
      {
        id: 'pd-041-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[G]Pǎomǎ liūliū de shān shàng
Yī duǒ liūliū de yún yo
[D7]Duānduān liūliū de zhào zài
Kāngdìng liūliū de chéng yo
[G]Yuèliang wānwān
Kāngdìng liūliū de chéng yo
{end_of_verse}`
      },
      {
        id: 'pd-041-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]On the horse-racing mountain
A drifting cloud
[D7]Gently shining down upon
The city of [G]Kangding
The moon is crescent
Over the city of Kangding
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-042',
    title: '在那遥远的地方 (Zài Nà Yáoyuǎn de Dìfāng)',
    artist: 'Wang Luobin (1939) — traditional Qinghai folk melody',
    key: 'D', capo: 0, bpm: 80,
    texts: [
      {
        id: 'pd-042-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[D]在那遥远的地方
有位好姑[A7]娘
人们走过了她的帐[D]房
都要回头留恋地张[A7]望
{end_of_verse}

{start_of_verse: 第二段}
[D]她那粉红的笑脸
好像红太[A7]阳
她那活泼动人的眼睛
好像晚上明媚的月[D]亮
{end_of_verse}

{start_of_verse: 第三段}
[D]我愿抛弃了财产
跟她去放[A7]羊
每天看着那粉红的笑脸
和那美丽金边的衣[D]裳
{end_of_verse}`
      },
      {
        id: 'pd-042-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[D]Zài nà yáoyuǎn de dìfāng
Yǒu wèi hǎo gū[A7]niáng
Rénmen zǒuguò le tā de zhàng[D]fáng
Dōu yào huítóu liúliàn de zhāng[A7]wàng
{end_of_verse}

{start_of_verse: Dì èr duàn}
[D]Tā nà fěnhóng de xiào liǎn
Hǎoxiàng hóng tài[A7]yáng
Tā nà huópo dòng rén de yǎnjīng
Hǎoxiàng wǎnshàng míngmèi de yuè[D]liàng
{end_of_verse}`
      },
      {
        id: 'pd-042-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[D]In that faraway place
There is a beautiful [A7]girl
People passing by her tent
Always turn to look [D]back with longing
{end_of_verse}

{start_of_verse: Verse 2}
[D]Her rosy smiling face
Is like the red [A7]sun
Her lively and charming eyes
Are like the bright moon on a [D]clear night
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-043',
    title: '龙的传人 (Lóng de Chuán rén)',
    artist: 'Hou Dejian (1978)',
    key: 'Am', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-043-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[Am]遥远的东方有一条龙
它的名字就[E]叫中国
[Am]遥远的东方有一群人
他们全都是龙的[E]传人
[Am]巨龙脚底下我成长
长成以后是龙的[E]传人
[Am]黑眼睛黑头发黄皮肤
永永远远是龙的[E]传人
{end_of_verse}

{start_of_chorus: 副歌}
[Am]百年前宁静的一个夜
巨变前夕的[C]黑暗
[G]枪炮声敲碎了宁静夜
四面楚歌是[Am]龙的传人
{end_of_chorus}`
      },
      {
        id: 'pd-043-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[Am]Yáoyuǎn de dōngfāng yǒu yī tiáo lóng
Tā de míngzì jiù [E]jiào Zhōngguó
[Am]Yáoyuǎn de dōngfāng yǒu yī qún rén
Tāmen quándōu shì lóng de [E]chuánrén
{end_of_verse}`
      },
      {
        id: 'pd-043-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[Am]Far in the east there is a dragon
Its name is [E]China
[Am]Far in the east there is a people
They are all [E]descendants of the dragon
[Am]I grew up beneath the dragon's feet
And growing up became [E]a child of the dragon
[Am]Black eyes, black hair, yellow skin
Forever and always [E]a child of the dragon
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-044',
    title: '小河淌水 (Xiǎo Hé Tǎng Shuǐ)',
    artist: 'Traditional Yunnan folk',
    key: 'G', capo: 0, bpm: 60,
    texts: [
      {
        id: 'pd-044-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[G]月亮出来亮汪汪
亮汪汪
[D7]想起我的阿哥在深山
哥像月亮天上走
[G]天上走
[D7]哥啊哥啊
[G]山下小河淌水清悠悠
{end_of_verse}

{start_of_verse: 第二段}
[G]月亮出来照半山
照半山
[D7]望见月亮想起我的阿哥在深山
一阵清风吹上来
[G]吹上来
[D7]哥啊哥啊
[G]你可听见阿妹叫你来
{end_of_verse}`
      },
      {
        id: 'pd-044-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[G]Yuèliang chūlái liàng wāngwāng
Liàng wāngwāng
[D7]Xiǎngqǐ wǒ de āgē zài shēn shān
Gē xiàng yuèliang tiānshàng zǒu
[G]Tiānshàng zǒu
[D7]Gē a gē a
[G]Shān xià xiǎohé tǎng shuǐ qīng yōuyōu
{end_of_verse}`
      },
      {
        id: 'pd-044-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]The moon comes out so bright and clear
So bright and clear
[D7]I think of my love deep in the mountains
My love moves like the moon across the sky
[G]Across the sky
[D7]My love, oh my love
[G]The little river runs softly down below
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-045',
    title: '红河谷 (Hóng Hé Gǔ)',
    artist: 'Traditional (Canadian/Chinese version)',
    key: 'G', capo: 0, bpm: 84,
    texts: [
      {
        id: 'pd-045-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[G]从这里你就要离去
离开这美丽的地[D7]方
[G]你带走了那里的阳光
[C]也带走了我的[G]希望
{end_of_verse}

{start_of_chorus: 副歌}
[G]红河谷中我的亲人
[D7]我一直思念着[G]你
[G]你的眼睛比太阳还亮
[C]照亮我心中的[G]夜
{end_of_chorus}`
      },
      {
        id: 'pd-045-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[G]Cóng zhèlǐ nǐ jiù yào líqù
Líkāi zhè měilì de dì[D7]fāng
[G]Nǐ dài zǒu le nàlǐ de yángguāng
[C]Yě dài zǒu le wǒ de [G]xīwàng
{end_of_verse}`
      },
      {
        id: 'pd-045-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]From this valley they say you are going
We will [D7]miss your bright eyes and sweet [G]smile
For they say you are taking the sunshine
That has [C]brightened our pathways a[G]while
{end_of_verse}

{start_of_chorus: Chorus}
[G]Come and sit by my side if you love me
Do not [D7]hasten to bid me a[G]dieu
But re[G]member the Red River Valley
And the [C]one who has loved you so [G]true
{end_of_chorus}`
      }
    ]
  },

  {
    id: 'pd-046',
    title: '彩云追月 (Cǎiyún Zhuī Yuè)',
    artist: 'Ren Guang (1935)',
    key: 'Dm', capo: 0, bpm: 72,
    texts: [
      {
        id: 'pd-046-t1', label: '汉字', format: 'chordpro', language: 'zh',
        content: `{start_of_verse: 第一段}
[Dm]彩云追月
[A7]彩云追月
[Dm]月色朦胧
[Gm]夜色朦胧
[Dm]天上彩云追月色
[A7]地上春光万里明
[Dm]彩云追月
[A7]彩云追月
[Dm]碧月流光追月行
{end_of_verse}`
      },
      {
        id: 'pd-046-t2', label: 'Pīnyīn', format: 'chordpro', language: 'zh-pinyin',
        content: `{start_of_verse: Dì yī duàn}
[Dm]Cǎiyún zhuī yuè
[A7]Cǎiyún zhuī yuè
[Dm]Yuèsè ménglóng
[Gm]Yèsè ménglóng
[Dm]Tiānshàng cǎiyún zhuī yuèsè
[A7]Dìshàng chūnguāng wànlǐ míng
[Dm]Cǎiyún zhuī yuè
[A7]Cǎiyún zhuī yuè
[Dm]Bì yuè liú guāng zhuī yuè xíng
{end_of_verse}`
      },
      {
        id: 'pd-046-t3', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[Dm]Coloured clouds chase the moon
[A7]Coloured clouds chase the moon
[Dm]The moonlight is hazy
[Gm]The night is soft and dim
[Dm]In the sky the clouds pursue the moonlight
[A7]On the earth spring shines for ten thousand miles
[Dm]Coloured clouds chase the moon
[A7]Coloured clouds chase the moon
[Dm]The jade moon flows with light as it races on
{end_of_verse}`
      }
    ]
  },

];

// ── Demo setlists ─────────────────────────────────────────

const SETLISTS = [
  {
    id: 'sl-demo-1',
    name: 'Folk Evening',
    songIds: ['pd-001','pd-003','pd-005','pd-006','pd-029','pd-030']
  },
  {
    id: 'sl-demo-2',
    name: 'Hymns & Spirituals',
    songIds: ['pd-002','pd-004','pd-008','pd-009']
  },
  {
    id: 'sl-demo-3',
    name: 'National Anthems',
    songIds: ['pd-022','pd-023','pd-024','pd-025','pd-026','pd-027','pd-028']
  },
  {
    id: 'sl-demo-4',
    name: 'Multilingual',
    songIds: ['pd-012','pd-013','pd-015','pd-019','pd-021']
  },
  {
    id: 'sl-demo-5',
    name: 'Deutsche Volkslieder',
    songIds: ['pd-013','pd-014','pd-024','pd-031','pd-032','pd-033','pd-034','pd-035','pd-036','pd-037','pd-038']
  },
  {
    id: 'sl-demo-6',
    name: '中文歌曲 (Chinese Songs)',
    songIds: ['pd-039','pd-040','pd-041','pd-042','pd-043','pd-044','pd-045','pd-046']
  },

  // ── Deutsche Weihnachtslieder ────────────────────────────

  {
    id: 'pd-047',
    title: 'O Tannenbaum',
    artist: 'Ernst Anschütz (1824)',
    key: 'F', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-047-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Wie [C7]treu sind dei[F]ne Blätter
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Wie [C7]treu sind dei[F]ne Blätter
Du [Bb]grünst nicht nur zur [F]Sommerzeit
Nein [C7]auch im Winter wenn es [F]schneit
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Wie [C7]treu sind dei[F]ne Blätter
{end_of_verse}

{start_of_verse: Strophe 2}
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Du [C7]kannst mir sehr ge[F]fallen
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Du [C7]kannst mir sehr ge[F]fallen
Wie [Bb]oft hat nicht zur [F]Weihnachtszeit
Ein [C7]Baum von dir mich hoch er[F]freut
[F]O Tannenbaum, o [Bb]Tannen[F]baum
Du [C7]kannst mir sehr ge[F]fallen
{end_of_verse}`
      },
      {
        id: 'pd-047-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[F]O Christmas tree, o [Bb]Christmas [F]tree
How [C7]lovely are thy [F]branches
[F]O Christmas tree, o [Bb]Christmas [F]tree
How [C7]lovely are thy [F]branches
Not [Bb]only green in [F]summer's heat
But [C7]also winter's snow and [F]sleet
[F]O Christmas tree, o [Bb]Christmas [F]tree
How [C7]lovely are thy [F]branches
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-048',
    title: 'O du fröhliche',
    artist: 'Johannes Daniel Falk (1816)',
    key: 'G', capo: 0, bpm: 72,
    texts: [
      {
        id: 'pd-048-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[G]O du fröhliche
[D7]O du selige
[G]Gnadenbringende [D7]Weih[G]nachtszeit
[G]Welt ging ver[C]loren
[G]Christ ist ge[D7]boren
[G]Freue, freue [D7]dich, o [G]Christen[D7]heit
{end_of_verse}

{start_of_verse: Strophe 2}
[G]O du fröhliche
[D7]O du selige
[G]Gnadenbringende [D7]Weih[G]nachtszeit
[G]Christ ist er[C]schienen
[G]Uns zu ver[D7]sühnen
[G]Freue, freue [D7]dich, o [G]Christen[D7]heit
{end_of_verse}

{start_of_verse: Strophe 3}
[G]O du fröhliche
[D7]O du selige
[G]Gnadenbringende [D7]Weih[G]nachtszeit
[G]Himmlische [C]Heere
[G]Jauchzen dir [D7]Ehre
[G]Freue, freue [D7]dich, o [G]Christen[D7]heit
{end_of_verse}`
      },
      {
        id: 'pd-048-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]O how joyful
[D7]O how blessed
[G]O how mercifully [D7]comes Christ[G]mas
[G]World was [C]lost then
[G]Christ came to [D7]save us
[G]Rejoice, rejoice [D7]O Christen[G]dom
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-049',
    title: 'Vom Himmel hoch da komm ich her',
    artist: 'Martin Luther (1535)',
    key: 'C', capo: 0, bpm: 76,
    texts: [
      {
        id: 'pd-049-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[C]Vom Himmel hoch da [G7]komm ich [C]her
Ich bring euch gute neue [G7]Mehr
Der guten Mär bring ich so [C]viel
Davon ich sing'n und sagen [G7]will
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Euch ist ein Kindlein [G7]heut ge[C]born
Von einer Jungfrau aus[G7]erkorn
Ein Kindelein so zart und [C]fein
Das soll eu'r Freud und [G7]Wonne sein
{end_of_verse}

{start_of_verse: Strophe 3}
[C]Es ist der Herr Christ [G7]unser [C]Gott
Der will euch führ'n aus [G7]aller Not
Er will eu'r Heiland selber [C]sein
Von allen Sünden machen [G7]rein
{end_of_verse}`
      },
      {
        id: 'pd-049-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[C]From heaven above to [G7]earth I [C]come
To bring good news to [G7]everyone
Glad tidings of great [C]joy I bring
To all the world and [G7]gladly sing
{end_of_verse}

{start_of_verse: Verse 2}
[C]To you this night is [G7]born a [C]child
Of Mary chosen [G7]mother mild
This little child of [C]lowly birth
Shall be the joy of [G7]all the earth
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-050',
    title: 'Ihr Kinderlein kommet',
    artist: 'Christoph von Schmid (1798)',
    key: 'G', capo: 0, bpm: 80,
    texts: [
      {
        id: 'pd-050-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[G]Ihr Kinderlein kommet o [D7]kommet doch all
Zur Krippe her kommet in [G]Bethlehems Stall
Und seht was in dieser [C]hochheiligen Nacht
Der [G]Vater im Himmel für [D7]Freude uns [G]macht
{end_of_verse}

{start_of_verse: Strophe 2}
[G]O seht in der Krippe im [D7]nächtlichen Glanz
Ein himmlisches Kind viel [G]schöner als Lanz
Es liegt auch im Dunkeln und [C]Kälte so lind
Wie [G]schlummert so süße das [D7]himmlische [G]Kind
{end_of_verse}

{start_of_verse: Strophe 3}
[G]Wer lag in dem Kripplein auf [D7]Heu und auf Stroh
Maria und Josef be[G]trachten es froh
Den redlichen Hirten er[C]schallet es weit
Hier [G]wohnet in Armut die [D7]Herrlich[G]keit
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-051',
    title: 'Es ist ein Ros entsprungen',
    artist: 'Traditional German (c. 1600)',
    key: 'G', capo: 0, bpm: 68,
    texts: [
      {
        id: 'pd-051-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[G]Es ist ein Ros ent[D7]sprungen
Aus einer Wurzel [G]zart
Wie uns die Alten [C]sungen
Von Jesse kam die [G]Art
Und hat ein Blümlein [D7]bracht
Mitten im kalten [G]Winter
Wohl zu der [D7]halben [G]Nacht
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Das Röslein das ich [D7]meine
Davon Jesaja [G]sagt
Hat uns gebracht alleine
Marie die reine [G]Magd
Aus Gottes ewgem [D7]Rat
Hat sie ein Kind ge[G]boren
Wohl zu der [D7]halben [G]Nacht
{end_of_verse}`
      },
      {
        id: 'pd-051-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]Lo how a rose e'er [D7]blooming
From tender stem hath [G]sprung
Of Jesse's lineage [C]coming
As men of old have [G]sung
It came a flower [D7]bright
Amid the cold of [G]winter
When half-spent was the [D7]night
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-052',
    title: 'Leise rieselt der Schnee',
    artist: 'Eduard Ebel (1895)',
    key: 'C', capo: 0, bpm: 72,
    texts: [{
      id: 'pd-052-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[C]Leise rieselt der [G7]Schnee
Still und starr liegt der [C]See
[F]Weihnachtlich glänzet der [C]Wald
[G7]Freue dich's Christkind kommt [C]bald
{end_of_verse}

{start_of_verse: Strophe 2}
[C]In den Wipfeln der [G7]Tann
Singt die Amsel ihr [C]Lied
[F]Weihnachtlich klinget es [C]weit
[G7]Stimmet an mit Fröhlich[C]keit
{end_of_verse}

{start_of_verse: Strophe 3}
[C]Bald ist heilige [G7]Nacht
Chor der Engel er[C]wacht
[F]Hört nur wie lieblich es [C]schallt
[G7]Frieden den Menschen ge[C]hallt
{end_of_verse}`
    }]
  },

  {
    id: 'pd-053',
    title: 'Kling Glöckchen klingelingeling',
    artist: 'Karl Enslin (1854)',
    key: 'C', capo: 0, bpm: 112,
    texts: [{
      id: 'pd-053-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_chorus: Refrain}
[C]Kling Glöckchen klingelingeling
[C]Kling Glöckchen kling
[F]Lasst mich ein ihr [C]Kinder
Ist so kalt der [G7]Winter
Öffnet mir die [C]Türen
Lasst mich nicht er[G7]frieren
[C]Kling Glöckchen klingelingeling
[C]Kling Glöckchen kling
{end_of_chorus}

{start_of_verse: Strophe 1}
[C]Mädchen hört und [G7]Bübchen schaut
[C]Was vom Himmel nieder[G7]schaut
[C]Christ das bringt euch al[F]le Jahr
Gute Dinge wunder[C]bar
[G7]Kindlein betet betet fein
Schlafet süß im [C]Mondenschein
{end_of_verse}

{start_of_chorus: Refrain}
[C]Kling Glöckchen klingelingeling
[C]Kling Glöckchen kling
[F]Lasst mich ein ihr [C]Kinder
Ist so kalt der [G7]Winter
Öffnet mir die [C]Türen
Lasst mich nicht er[G7]frieren
[C]Kling Glöckchen klingelingeling
[C]Kling Glöckchen kling
{end_of_chorus}`
    }]
  },

  {
    id: 'pd-054',
    title: 'Morgen kommt der Weihnachtsmann',
    artist: 'Hoffmann von Fallersleben (1835)',
    key: 'G', capo: 0, bpm: 100,
    texts: [{
      id: 'pd-054-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[G]Morgen kommt der Weih[D7]nachtsmann
Kommt mit seinen [G]Gaben
Bunter List und [C]Zuckerwerk
Äpfel, Nuß und [G]Marzipan
Kinder die ihn [D7]lieben
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Trommel, Pfeifen und Ge[D7]wehr
Fahn und Säbel [G]schöne
Reitersmann und [C]Festungsberg
Alles wird er [G]bringen
Doch nur für die [D7]Kinder
Die auch folgsam [G]sind
{end_of_verse}`
    }]
  },

  {
    id: 'pd-055',
    title: 'In dulci jubilo',
    artist: 'Heinrich Suso / Traditional (14th century)',
    key: 'G', capo: 0, bpm: 88,
    texts: [
      {
        id: 'pd-055-t1', label: 'Latein/Deutsch', format: 'chordpro', language: 'de',
        content: `{start_of_verse: Strophe 1}
[G]In dulci [D7]jubilo
Nun singet und seid [G]froh
Unsers Herzens [C]Wonne
Liegt in präse[G]pio
Und leuchtet als die [C]Sonne
Matris in [G]gremio
[D7]Alpha es et [G]O
[D7]Alpha es et [G]O
{end_of_verse}

{start_of_verse: Strophe 2}
[G]O Jesu [D7]parvule
Nach dir ist mir so [G]weh
Tröst mir mein [C]Gemüte
O puer op[G]time
Durch alle deine [C]Güte
O princeps glo[G]riae
[D7]Trahe me post [G]te
[D7]Trahe me post [G]te
{end_of_verse}`
      },
      {
        id: 'pd-055-t2', label: 'English', format: 'chordpro', language: 'en',
        content: `{start_of_verse: Verse 1}
[G]In dulci [D7]jubilo
Now sing with hearts a[G]glow
Our delight and [C]pleasure
Lies in præse[G]pio
Like sunshine is our [C]treasure
Matris in [G]gremio
[D7]Alpha es et [G]O
[D7]Alpha es et [G]O
{end_of_verse}`
      }
    ]
  },

  {
    id: 'pd-056',
    title: 'Süßer die Glocken nie klingen',
    artist: 'Friedrich Wilhelm Kritzinger (1828)',
    key: 'G', capo: 0, bpm: 76,
    texts: [{
      id: 'pd-056-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[G]Süßer die Glocken nie [D7]klingen
Als zu der Weih[G]nachtszeit
[G]Wenn durch die Lüfte ihr [D7]Bringen
Friede und Selig[G]keit
[C]Tönet ihr Glocken vom [G]hohen Turm
[D7]Tönet durch Frieden und [G]Sturm
{end_of_verse}

{start_of_verse: Strophe 2}
[G]Wunderbar tönen die [D7]Glocken
Aus dem verschneiten [G]Tal
[G]Locken vom Schlummer und [D7]Stocken
Zur heiligen Weih[G]nacht
[C]Tönet ihr Glocken vom [G]hohen Turm
[D7]Tönet durch Frieden und [G]Sturm
{end_of_verse}`
    }]
  },

  {
    id: 'pd-057',
    title: 'Fröhliche Weihnacht überall',
    artist: 'Hermann Kletke (1841)',
    key: 'C', capo: 0, bpm: 96,
    texts: [{
      id: 'pd-057-t1', label: 'Deutsch', format: 'chordpro', language: 'de',
      content: `{start_of_verse: Strophe 1}
[C]Fröhliche Weihnacht über[G7]all
Tönet durch die [C]Lüfte froher [F]Schall
[C]Weihnachtston Weihnachts[G7]baum
Weihnachtsduft im [C]ganzen Raum
{end_of_verse}

{start_of_verse: Strophe 2}
[C]Fröhliche Weihnacht überall
Tönet durch die [G7]Lüfte froher [C]Schall
[F]Brennt im Herzen fromm und [C]hell
Eurer Liebe [G7]Quell und [C]Well
{end_of_verse}`
    }]
  },

];