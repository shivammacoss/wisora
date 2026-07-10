import type { Chapter } from '../types';

/**
 * The Guru Granth Sahib — a reading journey through the eternal Guru, with
 * summaries: an introduction, the daily prayers and the 31 Raags, and closing
 * meditations on the core concepts. Chapter 1 is free; the rest unlock for
 * 1 unit of local currency. 46 chapters.
 */
export const guruGranthSahibChapters: Chapter[] = [
  {
    order: 1,
    title: 'Introduction to the Guru Granth Sahib',
    readingTimeMins: 4,
    isFree: true,
    content: [
      'The Guru Granth Sahib is unlike any other scripture in world religion. It is not merely a book. For Sikhs, it is the eternal Guru — the living spiritual teacher whose presence continues the succession of the ten human Sikh Gurus. When the tenth Guru, Guru Gobind Singh, was preparing to leave his mortal form in 1708, he declared that after him there would be no eleventh human Guru. Instead, the scripture itself would be the Guru forever. He bowed before it and formally installed it as Guru — a role it has held for over three centuries.',
      'Every gurdwara (Sikh place of worship) around the world enshrines the Guru Granth Sahib as its central spiritual presence. It is placed on a raised platform, covered with fine cloths, and treated with the same reverence a living Guru would receive. Devotees bow before it, listen to its recitation, and take counsel from its verses.',
      'What makes the Guru Granth Sahib remarkable is its universal inclusivity. Alongside the compositions of six Sikh Gurus, it includes the writings of Hindu Bhakti saints (like Kabir, Namdev, Ravidas) and Muslim Sufi mystics (like Sheikh Farid). No other major world scripture opens its pages to teachers from other faiths with such generosity. Its message is that the divine is one, though called by many names.',
    ],
  },
  {
    order: 2,
    title: 'Historical Context — The Ten Gurus and Compilation',
    readingTimeMins: 4,
    isFree: false,
    content: [
      'The story of the Guru Granth Sahib begins with Guru Nanak Dev Ji (1469–1539), the founder of Sikhism. Born in Punjab in what is now Pakistan, he emerged from a lifetime of spiritual seeking to proclaim a revolutionary message: there is one Creator, all human beings are equal, and the divine can be realized through remembrance of God’s name, honest work, and sharing with others. His famous declaration — “Na koi Hindu, na koi Musalman” (“There is no Hindu, no Muslim”) — became the foundation of Sikh spiritual thought.',
      'Nine successor Gurus continued his mission. Each preserved and expanded the sacred compositions. Guru Arjan Dev Ji (the fifth Guru) undertook the great work of compilation in 1604, creating the Adi Granth — the first authorized version of the scripture. He gathered the hymns of the first five Gurus, added compositions of Bhakti and Sufi saints whose message aligned with Sikh teaching, and installed the scripture at the Harmandir Sahib (Golden Temple) in Amritsar.',
      'A century later, Guru Gobind Singh Ji (the tenth Guru) added the compositions of his father, Guru Tegh Bahadur Ji, to complete the final version. He then declared that this scripture would be the eternal Guru — the Guru Granth Sahib — ending the human Guruship. Since 1708, the scripture itself has been the living Guru of the Sikhs.',
    ],
  },
  {
    order: 3,
    title: 'Structure and Language of the Scripture',
    readingTimeMins: 4,
    isFree: false,
    content: [
      'The Guru Granth Sahib contains 1,430 pages (each called an ang, meaning “limb” — for the scripture is considered the body of the Guru). It begins with the foundational compositions used in daily Sikh prayers — Japji Sahib, So Dar, So Purakh, and Sohila. The main body is then organized by 31 Raags — classical musical measures. Within each Raag, compositions are further arranged by author, meter, and length.',
      'This musical organization is unique among world scriptures. Every hymn (shabad) has a specific Raag associated with it — a specific mood and time of day. Raag Bhairav is for early morning. Raag Basant celebrates spring. Raag Malhar evokes the monsoon. The scripture is not just meant to be read; it is meant to be sung, and its music itself is medicine for the soul.',
      'The language of the Guru Granth Sahib is extraordinarily rich. It draws on Punjabi, Sanskrit, Persian, Arabic, Braj, Sindhi, and various regional dialects. This linguistic diversity reflects the Gurus’ outreach to speakers of every background and rejects the exclusivity of any single sacred language.',
    ],
  },
  {
    order: 4,
    title: 'Core Themes and Central Concepts',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'At the heart of Guru Granth Sahib teaching stands Ik Onkar — the affirmation that there is One God. The scripture opens with this symbol, and every hymn returns to it. This One is beyond form, beyond gender, beyond birth and death — yet also intimately close to every soul.',
      'The path to realizing this One is captured in three simple practices: Naam Japna (meditation on the divine Name), Kirat Karni (earning an honest living), and Vand Chakna (sharing with others). Together they form a spirituality grounded in daily life rather than escape from it.',
      'Key concepts include Hukam (the divine order and will), Sewa (selfless service), Sangat (holy company), Simran (loving remembrance), and Grace (the divine gift that comes when the seeker prepares the heart). The scripture rejects rituals divorced from love, caste divisions, empty scholarship, and hollow renunciation. It affirms family life, work, community service, and unwavering devotion as the path.',
    ],
  },
  {
    order: 5,
    title: 'Japji Sahib — The Morning Prayer',
    readingTimeMins: 4,
    isFree: false,
    content: [
      'Japji Sahib, composed by Guru Nanak Dev Ji, is the opening composition of the Guru Granth Sahib and the daily morning prayer of every practicing Sikh. It consists of 38 sections (pauris) framed by an opening Mool Mantra and a closing Salok. Together they form a complete spiritual roadmap.',
      'The Mool Mantra — the foundational statement of Sikh belief — declares: “Ik Onkar, Satnam, Karta Purakh, Nirbhau, Nirvair, Akal Murat, Ajooni, Saibhang, Gurprasad” — “One God, whose name is Truth, the Creator, without fear, without hatred, timeless in form, unborn, self-existent, known by the Guru’s grace.”',
      'The pauris that follow explore great spiritual questions. How does one become truthful? Not by ritual bathing at holy places, not by keeping silence, not by outward austerity — but by walking in the Hukam, the divine will. The composition describes the five realms the soul passes through — Dharam Khand (realm of duty), Gyan Khand (realm of knowledge), Saram Khand (realm of effort), Karam Khand (realm of grace), and Sach Khand (realm of truth).',
      'The closing Salok returns to the practical: “Air is the Guru, water is the father, and the great earth is the mother of all.” The night and day are nurses in whose lap the whole world plays. Actions determine one’s path — those who meditate become jewels; those who remember the Name go home with honor.',
    ],
  },
  {
    order: 6,
    title: 'So Dar — The Divine Court',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'So Dar — meaning “That Door” or “That Gate” — is a devotional composition sung as part of Rehras Sahib, the evening prayer. It asks a question of profound spiritual awe: “What is that Door, what is that Home, where You sit and take care of all?”',
      'The composition describes the countless beings who stand before the divine court, singing praises. Musicians play instruments beyond number. Countless winds, waters, and fires praise Him. Yama, the god of death, praises Him. The written laws of destiny praise Him. Yogis, ascetics, and warriors sing. The beautiful goddesses of many worlds sing. The gems, the seas, the treasures of the deep sing.',
      'Yet, the composition concludes, “Only those praise You who please You, whose hearts are dyed in Your love.” This is the Sikh vision of worship: not empty performance but a devotion that comes from the heart. The One who is described as living in a court beyond imagination is also intimately close — inside every heart that loves Him.',
    ],
  },
  {
    order: 7,
    title: 'So Purakh — The Primal Being',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'So Purakh — “That Primal Being” — is the third section of Rehras Sahib, again asking the great question of who and what the divine truly is. The answer unfolds in ecstatic verses attributed to Guru Ram Das Ji and Guru Arjan Dev Ji.',
      'The Primal Being is Nirankar — Formless. Pure, immaculate, beyond attributes. Yet He is also everywhere, in every form. He is the doer, the cause, the sustainer. Everyone else is under His command. Devotees sing His praise, and their tongues taste the ambrosia of His Name.',
      'The composition speaks of the profound blessing of Sadhsangat — the company of the holy. In such company, the mind is illumined, worldly attachments loosen, and the soul rises toward its source. The refrain calls out: “You alone are the True Lord.” Even amid the noise of the world, the devotee’s heart returns to this one truth.',
    ],
  },
  {
    order: 8,
    title: 'Sohila — The Song of Praise',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Sohila is the shortest of the daily prayers, recited at bedtime. Its tone is one of quiet trust — a lullaby for the soul before sleep. It consists of five shabads composed by Guru Nanak, Guru Ram Das, and Guru Arjan.',
      'The opening shabad speaks of the marriage of the soul with the divine — the divine as the beloved, and the song of celebration sung at that meeting. Sohila teaches the practitioner to remember death not as a fear but as a return home. When the moment comes to leave the world, only the Name of God will accompany the soul.',
      'The final verses describe the Aarti — the cosmic worship performed by the universe itself. The sky is the platter. The sun and moon are the lamps. The stars are the pearls. The forests fill the air with fragrance. The wind is the fan. All of nature performs continuous worship of the Creator. The devotee, joining in, simply remembers the Name and drifts into sleep at peace.',
    ],
  },
  {
    order: 9,
    title: 'Sri Raag — The Supreme Melody',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'The main body of the Guru Granth Sahib opens with Sri Raag — “the supreme melody” — a Raag traditionally associated with seriousness, discipline, and the fleeting nature of worldly attachments. Its very name declares its status: Sri, meaning “excellent” or “supreme.”',
      'The compositions in Sri Raag consistently return to the great themes of Sikh spirituality. Life is short. The body will fail. Wealth cannot follow the soul. Only Naam — the divine Name — accompanies the seeker beyond death. The Guru’s word is compared to a boat that carries the soul across the ocean of existence.',
      'Guru Nanak, Guru Amar Das, Guru Ram Das, Guru Arjan, and the Bhagats all contribute compositions in this Raag. In one famous verse, Guru Nanak declares: “If I had a hundred thousand tongues and multiplied them twenty times over, I would still repeat only Your Name.” Human words fall short of the divine reality — only love can meet it.',
    ],
  },
  {
    order: 10,
    title: 'Raag Majh — The Melody of Yearning',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Raag Majh is unique to Sikh scripture — it was not part of the classical Indian Raag tradition before the Gurus adopted it. It expresses profound yearning of the soul for the divine beloved, mixed with longing for one’s homeland (majh being a term related to the central region of Punjab).',
      'Compositions in Majh are marked by tender emotion. The soul cries out: “My beloved is far away, and I cannot bear the separation.” But the Guru gently redirects: the beloved is not far — He is within. The yearning itself is the beginning of the return.',
      'The famous Anand Sahib, composed by Guru Amar Das Ji, appears in this Raag. It celebrates the state of bliss (anand) that arises when the soul meets its true source. This composition is sung at Sikh weddings, births, and moments of communal celebration — a hymn of pure joy in the divine.',
    ],
  },
  {
    order: 11,
    title: 'Raag Gauri — The Melody of Deep Thought',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Raag Gauri is one of the most prominent Raags in the Guru Granth Sahib, containing more compositions than most others. Its mood is one of serious reflection — the melody of deep contemplation and self-examination.',
      'Many of the most philosophically dense passages of the scripture appear in this Raag. The famous Sukhmani Sahib — “The Prayer of Peace” — composed by Guru Arjan Dev Ji, is set in Raag Gauri. Consisting of 24 sections, Sukhmani is one of the most beloved compositions of Sikhism, recited by millions daily for peace, healing, and spiritual strength.',
      'Sukhmani teaches that all peace flows from the remembrance of God. It celebrates the state of the brahmgyani — the one who has known Brahm, the divine — describing them as free from ego, filled with compassion, seeing the divine in every being. Raag Gauri’s compositions consistently invite the reader inward, past the noise of the surface mind, to the deep still center where the divine dwells.',
    ],
  },
  {
    order: 12,
    title: 'Raag Asa — The Melody of Hope',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Asa literally means “hope,” and this Raag captures the buoyant, aspirational spirit of the seeker whose gaze is fixed on the divine. It is the Raag of the famous Asa di Var — a composition of Guru Nanak sung every morning in gurdwaras around the world.',
      'Asa di Var is a rich mixture of shaloks and pauris that address the whole of life: caste, gender equality, ritual versus reality, honest livelihood, and the presence of the divine in daily existence. In one famous passage, Guru Nanak defends women against those who would consider them impure or less than men: “From woman we are born, from woman we are shaped. To woman we are engaged, and to woman we are married. Woman becomes our friend; through woman come future generations. Why should we call her inferior, when great kings are born of her?”',
      'The tone of Asa is expansive and free — hope carried on the wings of morning.',
    ],
  },
  {
    order: 13,
    title: 'Raag Gujri — The Melody of Sweetness',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Gujri carries a mood of gentle sweetness and devotional tenderness. Compositions in this Raag often use the imagery of the bride longing for her beloved — a metaphor for the soul’s yearning for God.',
      'The famous So Dar section of Rehras Sahib begins with a shabad set in Raag Gujri, in which Guru Nanak asks the great question about the divine court and receives the answer that music and song are the natural response of every being to the Creator.',
      'Guru Amar Das and Guru Arjan contribute major compositions here. The Bhakti saint Kabir also has poetry in this Raag — his sharp, unadorned voice cutting through pretense to the direct experience of the divine.',
    ],
  },
  {
    order: 14,
    title: 'Raag Devgandhari — The Divine Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Devgandhari — literally “the melody of the divine musicians” — has a devotional, elevated character. It contains compositions primarily by Guru Ram Das and Guru Arjan.',
      'The tone here is celebratory devotion. The soul, having found the Guru, sings the praises of the divine with a full heart. The metaphors are drawn from music itself — the vibration of the tanpura, the resonance of the tabla, the melody that arises when the tuning is right. So the soul, when properly tuned to the divine, produces the music of anand — spontaneous bliss.',
    ],
  },
  {
    order: 15,
    title: 'Raag Bihagra — The Melody of Joy',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Bihagra carries a joyful, expansive mood — the melody of the soul that has tasted the sweetness of the divine. It is a Raag traditionally associated with union, and much of its imagery involves the meeting of the seeker with the beloved.',
      'Compositions in Bihagra celebrate the moment when yearning is fulfilled. The Guru is described as the boat that carried the soul across; the divine Name is described as the treasure discovered within. The tone is one of gratitude — the joy of one who has been given what they longed for.',
    ],
  },
  {
    order: 16,
    title: 'Raag Wadhans — The Melody of Praise',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Wadhans has a mixed emotional character. It is used both for celebration and for mourning — for weddings and for funerals. This dual character reflects a deep Sikh insight: birth and death are moments in a single continuous journey. The same melody accompanies both the beginning and the end.',
      'The compositions here address the impermanence of the body and the eternity of the soul. When death comes, it is not the end but a return. When new life begins, it is not truly new but a continuation. The Alahaniyan — funeral hymns — set in Wadhans, remind mourners that grief itself must eventually give way to the acceptance of the divine order.',
    ],
  },
  {
    order: 17,
    title: 'Raag Sorath — The Melody of Beauty',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Sorath is one of the more prominent Raags in the scripture, associated with beauty, attraction, and the delight of divine remembrance. Its name comes from the Saurashtra region, and it carries a folk-melodic warmth.',
      'Sorath contains many compositions by the Bhakti saints, particularly Kabir — whose blunt, powerful voice speaks against hypocrisy and points relentlessly to direct spiritual experience. The Raag also carries deeply personal compositions of the Gurus in moments of intense devotion. The overall mood is that of a soul irresistibly drawn to the divine — beauty calling to beauty.',
    ],
  },
  {
    order: 18,
    title: 'Raag Dhanasari — The Melody of Wealth',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Dhanasari addresses true wealth. The world defines wealth as gold, land, and status. The scripture defines it as the divine Name held in a loving heart. The compositions in Dhanasari repeatedly contrast these two visions of riches.',
      'The famous Aarti — the cosmic worship composition — is set in this Raag: “In the platter of the sky, the sun and moon are the lamps...” Nature itself becomes the temple, and the offering is the seeker’s continuous remembrance. This is the true wealth: to see the sacred everywhere, and to walk with a heart full of gratitude.',
    ],
  },
  {
    order: 19,
    title: 'Raag Jaitsri — The Melody of Victory',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Jaitsri carries a mood of confident spiritual triumph — the melody of the soul that has overcome its inner enemies. The five great “thieves” — lust, anger, greed, attachment, and ego — are the true enemies the Sikh scripture teaches its readers to conquer. When these are overcome through the Guru’s teaching, the soul experiences true victory.',
      'Compositions in Jaitsri celebrate this inner conquest. External victories over enemies pass and fade. The victory over the ego endures forever. The Guru is the one who leads the disciple to this triumph, and the shabad — the sacred word — is the weapon.',
    ],
  },
  {
    order: 20,
    title: 'Raag Todi — The Morning Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Todi is traditionally associated with the late morning — a Raag of longing and devotional tenderness. Its compositions are relatively few in the Guru Granth Sahib but carry a distinct emotional depth.',
      'The mood is one of the seeker who has awakened to their spiritual need. Ordinary life has been going on, but suddenly the soul has recognized what is missing. The compositions in Todi are the songs of this awakening — sometimes tinged with regret at time already lost, but always turning toward the possibility of finding what was always here.',
    ],
  },
  {
    order: 21,
    title: 'Raag Bairari — The Melody of Detachment',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Bairari carries the mood of quiet detachment. Not the detachment of coldness or withdrawal, but the peace of one who has released the grip of desire and settled into the deeper reality of the divine.',
      'Compositions in this Raag speak of the futility of possessive love, the anxiety that clinging brings, and the freedom that comes from placing all attachments in the divine hand. The seeker who has learned this detachment can enjoy the world without being enslaved by it, love people without being tormented by fear of loss, and work in the world while remaining at peace within.',
    ],
  },
  {
    order: 22,
    title: 'Raag Tilang — The Melody of Rhythm',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Tilang is one of the Raags that shows the Guru Granth Sahib’s linguistic openness — it contains compositions in Persian and Arabic-influenced Punjabi, some using distinctly Muslim vocabulary for God (Sahib, Khuda, Karim, Rahim). This Raag testifies to the scripture’s universal reach.',
      'Guru Nanak’s compositions here speak directly to Muslim readers. He affirms the oneness of God and gently critiques rituals divorced from inner reality — while never dismissing the sincere devotion of any tradition. Sheikh Farid, the Sufi saint, also contributes deeply moving verses in this Raag on death, humility, and the fleeting nature of youth.',
    ],
  },
  {
    order: 23,
    title: 'Raag Suhi — The Beloved’s Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Suhi is one of the most emotionally rich Raags in the scripture. Its very name means “crimson” or “the color of the beloved’s dress.” The mood is one of the bride waiting for her divine bridegroom — the soul yearning for union with the divine.',
      'Guru Nanak’s famous Suhi Chhant opens this Raag with tender verses about the human being lost in worldly distraction while the true beloved waits within. Sheikh Farid’s compositions here are among the most piercing in the scripture — meditations on how quickly life passes, how death approaches unseen, and how the wise begin the spiritual journey before the shadow of old age falls.',
    ],
  },
  {
    order: 24,
    title: 'Raag Bilaval — The Melody of Happiness',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Bilaval is a Raag of joy and celebration. Its compositions consistently express the delight of the soul that has found its true home in the divine. This is not the shallow happiness of worldly pleasure but the deep contentment that comes from union with the source of all.',
      'Many of the wedding hymns and celebratory compositions of the Gurus appear here. The Raag also contains compositions by Bhagats. The overall mood is expansive and free — the joy of a heart that no longer needs to grasp for anything, because it has found what it was always looking for.',
    ],
  },
  {
    order: 25,
    title: 'Raag Gaund — The Melody of Seriousness',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Gaund carries a mood of solemn depth. Its compositions address the great questions of existence with a certain gravity — the reality of death, the impermanence of the world, the urgency of spiritual awakening before time runs out.',
      'Kabir’s compositions in Gaund are particularly striking. His voice, blunt and uncompromising, challenges the reader to look past the illusions that comfort the mind: caste distinctions, ritual purities, philosophical constructions. Only the direct experience of the divine matters. Everything else is decoration on a house destined to fall.',
    ],
  },
  {
    order: 26,
    title: 'Raag Ramkali — The Divine Play',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Ramkali carries associations with the yogis and the Nath tradition of ascetic practice. Many of the compositions here engage directly with yogic imagery and terminology — but always turning it back toward Sikh understanding. The Guru does not reject the yogic path but reframes it: the true yoga is remembering God’s name while living an honest household life.',
      'The famous Anand Sahib by Guru Amar Das is set in this Raag. So is a portion of the daily Rehras Sahib. The mood is exploratory, philosophical — the mind engaging with deep questions and being led toward simple, direct answers.',
    ],
  },
  {
    order: 27,
    title: 'Raag Nat Narayan — The Dance of the Divine',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Nat Narayan combines two elements — Nat, the dance or performance, and Narayan, one of the names of God. Together they suggest the divine performance — the cosmic play in which the divine dances through all of creation.',
      'Compositions in this Raag celebrate this vision: the world as the divine’s own performance, in which the wise learn to see the dancer through the dance. What seem like separate events, separate beings, separate stories are all one continuous expression of the divine creativity. The seeker learns to see this — and to participate in it as a devotee rather than as a distracted spectator.',
    ],
  },
  {
    order: 28,
    title: 'Raag Mali Gaura — The Garland Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Mali Gaura — literally “the fair garland-maker’s melody” — carries a devotional, service-oriented tone. Its compositions often center on the act of offering — the giving of one’s whole life as a garland to the divine.',
      'The tone is quiet and dignified. Devotion is not shown as ecstatic effusion but as the steady offering of ordinary life. The gardener strings flowers one at a time, patiently. So the devotee strings days of remembrance, one at a time, into a life of offering.',
    ],
  },
  {
    order: 29,
    title: 'Raag Maru — The Melody of Desert',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Maru — the melody of the desert — is a Raag of stark spiritual intensity. Its compositions address the harshness of existence, the difficulty of the spiritual path, and the courage required of the seeker who would not turn back.',
      'The desert is a metaphor for the soul’s journey through hardship and testing. Yet even in the desert, water is found — the water of the divine Name. The compositions here strengthen the seeker for endurance. They also contain many verses about spiritual valor — the courage of the seeker who stands firm in remembrance despite opposition, temptation, and doubt.',
    ],
  },
  {
    order: 30,
    title: 'Raag Tukhari — The Melody of Longing',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Tukhari is a Raag of deep longing, associated with the seasons — particularly the twelve months. The famous Baramaha — “the twelve months” — compositions of the Gurus are set here, depicting the seeker’s spiritual journey through the changing seasons of the year and the soul’s longing for the divine beloved in each.',
      'Every month brings its own image. Chet (March–April) brings the blossoming of nature but reminds the seeker that without the beloved, all beauty is hollow. Vaisakh (April–May) brings the harvest but returns the seeker to inner cultivation. And so through every month — each season becoming a mirror of the soul’s condition and a call to deeper devotion.',
    ],
  },
  {
    order: 31,
    title: 'Raag Kedara — The Mountain Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Kedara carries associations with the mountain heights and the elevation of the spirit. Its compositions celebrate the ascent of the soul from the ordinary consciousness of worldly concern to the elevated awareness of the divine presence.',
      'The mountain is a natural symbol of spiritual endeavor: the climb is difficult, the air grows thin, but at the summit the view opens onto vastness. So the compositions in Kedara encourage the seeker to keep climbing — through the trials of practice, through the doubt, through the fatigue — toward the summit of divine realization.',
    ],
  },
  {
    order: 32,
    title: 'Raag Bhairav — The Fearsome Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Bhairav is one of the great classical Raags, traditionally sung at dawn. Its mood is intense, even fierce — the melody of awe before the divine mystery.',
      'Compositions here address the seriousness of the human condition and the urgency of turning to the divine. The name Bhairav itself is associated with a fearsome form of the divine in Hindu tradition — but the compositions here transform this fierceness into the intensity of devotion. The seeker who has understood the stakes of human life — that this precious birth is passing, that the moment is now — sings with the same intensity.',
    ],
  },
  {
    order: 33,
    title: 'Raag Basant — The Spring Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Basant is a Raag of spring, of new beginnings, of the flowering of the heart. Its compositions celebrate the renewal that comes when the soul turns toward the divine — the winter of forgetfulness giving way to the spring of remembrance.',
      'The famous Basant ki Var is set in this Raag. Its imagery is of blossoms, birds, and fragrance — but always pointing beyond the natural spring to the spiritual spring in which the soul flowers with divine love. This is one of the most joyful and vibrant Raags in the scripture.',
    ],
  },
  {
    order: 34,
    title: 'Raag Sarang — The Peacock Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Sarang is a midday Raag with a bright, warm quality. In Indian classical tradition, its melody evokes the peacock’s dance in the moment when the sun is at its height and the earth is bathed in intense light.',
      'Compositions in Sarang celebrate the fullness of divine remembrance. The Name of God, present in the heart, is like the sun at midday — its radiance so complete that darkness cannot hide anywhere. The soul that dwells in this remembrance moves through the world with quiet joy, seeing the divine light in every place and every being.',
    ],
  },
  {
    order: 35,
    title: 'Raag Malhar — The Rain Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Malhar is the classic monsoon Raag — associated with rain, thunder, and the relief that comes when parched earth finally receives water. Its compositions carry this same relief on a spiritual level: the soul, parched by long forgetfulness, finally receives the rain of divine grace.',
      'The imagery here is rich with agricultural life. Just as the farmer’s crops depend on rain, so the soul depends on the divine grace that falls when the heart has been prepared. The compositions in Malhar celebrate the arrival of this grace — the sudden coolness, the fragrance of rain-soaked earth, the joy of new growth.',
    ],
  },
  {
    order: 36,
    title: 'Raag Kanra — The Melody of Devotion',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Kanra carries a devotional depth and richness. Its compositions are relatively fewer in number but are marked by intense sincerity — the melody of the heart that has committed itself entirely to the path.',
      'The mood is that of the mature devotee — no longer a beginner, no longer distracted by the surface excitement of spiritual life, but settled into the long, deep practice of remembrance. The compositions in Kanra speak of the steady heart, the deep root, the quiet strength that comes from years of walking the path.',
    ],
  },
  {
    order: 37,
    title: 'Raag Kalyan — The Auspicious Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Kalyan — literally “the auspicious melody” — is traditionally sung in the early evening. Its very name suggests wellbeing, blessing, and the good that arises when life is aligned with truth.',
      'Compositions in Kalyan bless the practice of devotion and celebrate the divine grace that arrives when the seeker is sincere. The mood is one of settled contentment — the joy of an ordinary evening in which the day’s work is done and the heart returns to its true home.',
    ],
  },
  {
    order: 38,
    title: 'Raag Parbhati — The Dawn Melody',
    readingTimeMins: 2,
    isFree: false,
    content: [
      'Raag Parbhati — “the dawn melody” — is sung in the early hours before sunrise. This is the amrit vela — the ambrosial hour — traditionally considered the best time for spiritual practice.',
      'The compositions in Parbhati speak of awakening: the physical awakening of the body, but also the deeper awakening of the soul. Just as the world emerges from the darkness of night into the light of morning, so the seeker’s mind emerges from the sleep of forgetfulness into the light of divine remembrance. Every morning is an opportunity to begin again.',
    ],
  },
  {
    order: 39,
    title: 'Raag Jaijavanti — The Victory Melody',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Raag Jaijavanti is one of the last Raags in the sequence. Its compositions were added by Guru Gobind Singh, the tenth Guru, when he included the writings of his father Guru Tegh Bahadur. It is a Raag of quiet victory — the settled triumph of a soul that has completed its passage through the great themes of the scripture.',
      'The compositions here are drawn primarily from Guru Tegh Bahadur, whose spiritual poetry combines profound detachment with tender devotion. His voice speaks of a person who has understood the world’s fleeting nature and settled deep into the eternal Name. His life, culminating in martyrdom for religious freedom in 1675, gave weight to his every word.',
    ],
  },
  {
    order: 40,
    title: 'Salok Mahalla 9 & Mundavani — The Final Word',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'The scripture closes with two short but powerful sections. Salok Mahalla 9 consists of 57 short verses by Guru Tegh Bahadur — quiet, penetrating meditations on the fleeting nature of worldly life and the urgency of remembrance. These verses are among the most beloved in Sikh daily practice, recited by countless devotees for their piercing simplicity.',
      '“O mind, whom will you laugh at? None is a stranger; the entire world is your relative.” “That which you consider yours is not yours. Everything belongs to Him alone.” “Youth has passed; old age has come; the body has weakened. Kabir says, the mind still has not turned to the divine Name.”',
      'Then comes the Mundavani — literally “the seal” — composed by Guru Arjan Dev Ji as the closing statement of the entire scripture. It uses a striking image: the Guru Granth Sahib is like a thal — a platter — on which three things have been placed: truth, contentment, and reflection. The ambrosial Name is placed alongside them. This is the food of the soul. Whoever eats it, whoever receives this offering, is liberated.',
      'The final Salok — a moment of extraordinary humility — has Guru Arjan asking the divine to be gracious to a lowly servant who has done nothing to deserve such compassion. It is an offering of the entire scripture back to its source — the great work of the Gurus laid at the feet of the One who inspired it.',
    ],
  },
  {
    order: 41,
    title: 'Ik Onkar — The One',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'The first symbol on the first page of the Guru Granth Sahib is Ik Onkar — combining the numeral “one” with the sacred syllable Onkar. This is not merely a theological statement but the seed from which the entire scripture grows.',
      'The divine is One — not one among many, not one type of being, but the single reality underlying all appearances. This One has no form, no gender, no birth, no death. Yet the One is not distant. He (or She, or beyond both) is the very consciousness that reads these words, the breath that fills the lungs, the awareness in every heart.',
      'To realize this One is the aim of Sikh spiritual practice. Not to argue about it. Not to theorize about it. But to know it directly, through the loving remembrance of the Name.',
    ],
  },
  {
    order: 42,
    title: 'The Three Pillars',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Sikh spirituality rests on three practical pillars, first articulated by Guru Nanak and confirmed throughout the scripture.',
      'Naam Japna — the loving remembrance of the divine Name. This is the inner practice: keeping the heart tuned to the divine even during ordinary activities. The Name is not a specific word but the reality of the divine as it can be held in awareness.',
      'Kirat Karni — earning an honest living through one’s own labor. Sikh spirituality rejects begging, mendicancy, and dependence on others. The householder who works honestly and shares the fruits is superior to the ascetic who has withdrawn from the world.',
      'Vand Chakna — sharing with others. What one earns is not truly one’s own until it has been shared. The Sikh institution of langar — the community kitchen where all eat together regardless of caste, class, or creed — is the living embodiment of this teaching.',
    ],
  },
  {
    order: 43,
    title: 'Sewa — Selfless Service',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Sewa means selfless service — the offering of one’s time, labor, and skill for the benefit of others without any expectation of return. It is one of the most distinctive practices of the Sikh path.',
      'In every gurdwara, sewa is performed continuously: preparing food, cleaning floors, serving meals to strangers, tending to the shrine. But sewa is not limited to religious settings. Any work done with love, without ego, and for the benefit of others is sewa.',
      'The scripture teaches that sewa transforms the doer. The ego that clings to reward and recognition dissolves as one serves without concern for return. The heart softens. The mind quiets. Eventually the servant realizes that the true server is the divine itself — working through their hands.',
    ],
  },
  {
    order: 44,
    title: 'Sangat and Langar',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Sangat means “holy company” — the gathering of seekers who support one another on the path. The Guru Granth Sahib repeatedly celebrates the transformative power of sangat. Alone, the mind wanders. In the company of sincere seekers, it becomes still. Alone, the ego reasserts itself. In sangat, humility takes root.',
      'Langar is the community kitchen present at every gurdwara, where food is served free to all — regardless of religion, caste, wealth, or nationality. The langar was instituted by Guru Nanak and expanded by his successors as a living rejection of caste hierarchy. All sit together on the floor at the same level. All eat the same food. The message is unmistakable: no human is higher or lower than another before the divine.',
      'Today, Sikh langars around the world serve hundreds of thousands of meals daily. During natural disasters, they often become the first responders — feeding people of every faith without question.',
    ],
  },
  {
    order: 45,
    title: 'Legacy and Global Influence',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'Since its final compilation in 1704 and its formal installation as the eternal Guru in 1708, the Guru Granth Sahib has been the spiritual center of the Sikh community. It travels wherever Sikhs go — to farms in Punjab, to gurdwaras in Kenya, Canada, England, Australia, and the United States. Wherever Sikhs settle, they build a home for their Guru.',
      'The scripture has profoundly shaped Punjabi language, music, art, and social organization. Its principles have inspired movements for justice, its institutions have fed the hungry across centuries, and its poetry has moved hearts across every barrier of language and creed.',
      'Beyond the Sikh world, the Guru Granth Sahib has increasingly drawn the attention of scholars, interfaith practitioners, and seekers from other traditions. Its universal inclusivity — the presence of Hindu and Muslim voices alongside the Sikh Gurus — makes it a model of interfaith respect long before the concept was named in the modern West. Its teachings on gender equality, caste rejection, and the sanctity of honest labor have made it a source of inspiration for social reformers of every background.',
    ],
  },
  {
    order: 46,
    title: 'Modern Relevance',
    readingTimeMins: 3,
    isFree: false,
    content: [
      'The Guru Granth Sahib speaks to modern life with striking directness. In an age of religious conflict, it insists that God is One, called by many names. In an age of consumer excess, it teaches contentment and simple living. In an age of loneliness, it celebrates sangat — the community of seekers.',
      'For the working person, it affirms the sacredness of honest labor — no need to renounce the world to be spiritual. For the parent, it teaches that family life, done with love and awareness, is a path to the divine. For the anxious mind, it offers the practice of Naam — a steady remembrance that anchors the heart amid every storm.',
      'Its social vision remains radical. Its rejection of caste and gender hierarchy speaks directly to modern movements for equality. Its institution of langar — free food for all — is a living answer to hunger and division. Its spirit of sewa offers a model of service that many modern secular movements are only beginning to rediscover.',
      'At its heart, the scripture teaches something both simple and profound: that the divine is present in every moment, every breath, every encounter — and that the whole human task is to remember this, to live from it, and to serve out of it.',
    ],
  },
];
