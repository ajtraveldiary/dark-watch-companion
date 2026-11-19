// Dark companion data. Every item carries `ep` = "S.E" — the episode that unlocks it.
// `until` = episode at which the item is superseded (shown struck through with `later`).
// Rule: when unsure whether something is a spoiler, it is gated later or left out.

const EPISODES = [
  // Season 1
  ["1.1","Secrets"],["1.2","Lies"],["1.3","Past and Present"],["1.4","Double Lives"],["1.5","Truths"],
  ["1.6","Sic Mundus Creatus Est"],["1.7","Crossroads"],["1.8","As You Sow, so You Shall Reap"],
  ["1.9","Everything Is Now"],["1.10","Alpha and Omega"],
  // Season 2
  ["2.1","Beginnings and Endings"],["2.2","Dark Matter"],["2.3","Ghosts"],["2.4","The Travelers"],
  ["2.5","Lost and Found"],["2.6","An Endless Cycle"],["2.7","The White Devil"],["2.8","Endings and Beginnings"],
  // Season 3
  ["3.1","Deja-vu"],["3.2","The Survivors"],["3.3","Adam and Eva"],["3.4","The Origin"],
  ["3.5","Life and Death"],["3.6","Light and Shadow"],["3.7","Between the Time"],["3.8","The Paradise"]
];

const FAMILIES = {
  kahnwald:  {name:"Kahnwald",  color:"#E3B43C"},
  nielsen:   {name:"Nielsen",   color:"#5E93C4"},
  tiedemann: {name:"Tiedemann", color:"#A585D6"},
  doppler:   {name:"Doppler",   color:"#6FAF7A"},
  tannhaus:  {name:"Tannhaus",  color:"#C98A55"},
  albers:    {name:"Albers",    color:"#4FB3AE"},
  obendorf:  {name:"Obendorf",  color:"#9AA3AB"},
  others:    {name:"Others",    color:"#8C949C"},
  unknown:   {name:"Unidentified", color:"#D9D9D9"},
  otherworld:{name:"Other world", color:"#E07A9A"}
};

// pos: [column, generation row 0-3]  posFrom: [{ep, pos}] to move a node once its truth is revealed.
const CHARACTERS = [
  // ---------- Unidentified / mystery personas (placed apart so position never hints) ----------
  {id:"kidnapper", name:"The hooded figure", fam:"unknown", ep:"1.1", role:[{ep:"1.1", t:"Unidentified figure holding Erik captive"}], pos:[0,1],
    bio:[
      {ep:"1.1", t:"A hooded figure holds Erik Obendorf in a strange room with an electric-chair-like device."},
      {ep:"1.4", t:"A hooded man stops Yasin on his way to school: \"Noah sent me.\""}
    ]},
  {id:"stranger", name:"The Stranger", fam:"unknown", ep:"1.2", role:[{ep:"1.2", t:"Mysterious guest at the Waldhotel"},{ep:"1.10", t:"Jonas, grown up, from the future"}], pos:[0,2],
    bio:[
      {ep:"1.2", t:"A scarred man with a briefcase and a brass device. Checks into Regina's hotel (room 8) and covers the walls with notes about time, black holes and myth."},
      {ep:"1.4", t:"Watches Jonas slip past the cave barrier."},
      {ep:"1.5", t:"Asks Regina to pass a package to Jonas. Visits clockmaker Tannhaus in 1986."},
      {ep:"1.8", t:"Tells Tannhaus he came from the future through a wormhole in Winden and wants to destroy it."},
      {ep:"1.10", t:"Loads Cesium-137 into his device in the caves to destroy the wormhole.", until:"2.1", later:"It didn't work: the passage was only closed, and he is stranded."},
      {ep:"2.1", t:"Stops Hannah's suicide attempt and shows her who he is."},
      {ep:"2.8", t:"Locks Martha in the bunker on apocalypse day, saying her death is his fault."},
      {ep:"3.1", t:"In 1888, working on a machine with Bartosz, Magnus and Franziska."},
      {ep:"3.7", t:"Burned by the God particle in 1890. The scars begin."}
    ]},
  {id:"oldclaudia", name:"The old woman", fam:"unknown", ep:"1.10", role:[{ep:"1.10", t:"White-haired woman giving orders in the bunker"},{ep:"2.2", t:"Claudia Tiedemann, older; a time traveller"}], pos:[1,0],
    bio:[
      {ep:"1.10", t:"A white-haired woman called Claudia directs Peter and Tronte in the bunker. Noah tells Bartosz she is his enemy."},
      {ep:"2.2", t:"Reveals herself to young Claudia Tiedemann as her older self."},
      {ep:"2.3", t:"Shot by Noah in the Doppler cabin in 1954."},
      {ep:"2.7", t:"Helge calls her \"the White Devil\"."}
    ]},
  {id:"soldier", name:"The masked soldier", fam:"unknown", ep:"1.10", job:[{ep:"1.10", t:"Soldier"}], role:[{ep:"1.10", t:"Soldier in the ruins of 2052"},{ep:"2.1", t:"Elisabeth Doppler, grown up, in 2052"}], pos:[1,3],
    bio:[{ep:"1.10", t:"A soldier in 2052 who knocks Jonas out: \"Welcome to the future.\""}]},
  {id:"adam", name:"Adam", fam:"unknown", ep:"2.1", job:[{ep:"2.1", t:"Leader of Sic Mundus"}], role:[{ep:"2.1", t:"Scarred leader of Sic Mundus (1921)"},{ep:"2.4", t:"Jonas, very old; leader of Sic Mundus"}], pos:[0,0],
    bio:[
      {ep:"2.1", t:"Heavily scarred leader of Sic Mundus. Says the apocalypse must happen, like burning a forest so new trees can grow."},
      {ep:"2.4", t:"Opens his collar to show Jonas the scar: \"I am you.\""},
      {ep:"2.5", t:"Says the God particle can send Jonas back to stop Michael's suicide.", until:"2.6", later:"Claudia: Adam lied. Jonas's visit is what causes the suicide."},
      {ep:"2.8", t:"Shoots Martha on apocalypse day."},
      {ep:"3.4", t:"Tells the time-travelling Martha her unborn son is \"the Origin\"."},
      {ep:"3.6", t:"Believes both apocalypses together can destroy the Origin and end the knot.", until:"3.7", later:"It fails: nothing changes."},
      {ep:"3.8", t:"Learns the truth from Claudia and gives Jonas the way out. Fades with Eva."}
    ]},
  {id:"unknown", name:"The Unknown", fam:"unknown", ep:"3.1", role:[{ep:"3.1", t:"Scarred man, seen at three ages"},{ep:"3.8", t:"Jonas and Martha's son: the Origin"}], pos:[0,3],
    bio:[
      {ep:"3.1", t:"Three men with the same cleft-lip scar, at three ages. They kill Bernd Doppler for the plant's master key."},
      {ep:"3.2", t:"Kills Claudia's secretary Jasmin."},
      {ep:"3.4", t:"In 1954 gives young Tronte his missing mother's bracelet, and grants the plant's building permit."},
      {ep:"3.6", t:"Triggers the June 21, 1986 incident at the plants in both worlds."},
      {ep:"3.8", t:"Jonas and Martha's son: the Origin. The youngest hugs Martha."}
    ]},
  {id:"silja", name:"Silja", fam:"unknown", ep:"2.1", role:[{ep:"2.1", t:"Teen sign-language interpreter for Elisabeth (2052)"},{ep:"3.7", t:"Hannah and Egon's daughter"}], pos:[1,2], posFrom:[{ep:"3.7", pos:[9.25,3]}],
    bio:[
      {ep:"2.1", t:"A teenage girl among the survivors in 2052 who interprets sign language for Elisabeth."},
      {ep:"2.2", t:"Secretly frees Jonas after he's caught in the forbidden zone."},
      {ep:"3.4", t:"In 2053 she hugs Agnes goodbye before Agnes enters the God particle."},
      {ep:"3.6", t:"One of Adam's followers in 2053."},
      {ep:"3.7", t:"Hannah's daughter by Egon. Travels to 1890, meets Bartosz, and has Hanno (Noah) and later Agnes. Dies giving birth to Agnes."}
    ]},

  // ---------- Tannhaus ----------
  {id:"tannhaus", name:"H.G. Tannhaus", fam:"tannhaus", ep:"1.3", job:[{ep:"1.3", t:"Clockmaker"}], role:[{ep:"1.3", t:"Clockmaker; author of a book on time travel"}], pos:[3,0],
    bio:[
      {ep:"1.3", t:"An old clockmaker in 1986. Finishes a brass device identical to the Stranger's."},
      {ep:"1.8", t:"Explains wormholes, the triquetra and the 33-year cycle to the Stranger. Builds a second machine."},
      {ep:"1.9", t:"In 1953, an elderly woman asks the young Tannhaus to build a time machine."},
      {ep:"2.1", t:"Charlotte's grandfather.", until:"2.5", later:"Not her biological grandfather: he raised her."},
      {ep:"2.3", t:"His book existed before he wrote it: he got it from an old woman."},
      {ep:"3.5", t:"His son, daughter-in-law and granddaughter died in a car crash; the granddaughter's body was never found."},
      {ep:"3.8", t:"His son Marek, daughter-in-law Sonja and granddaughter died in 1971. Trying to undo their deaths, he split the origin world into two."}
    ]},
  {id:"marek", name:"Marek Tannhaus", fam:"tannhaus", ep:"3.8", role:[{ep:"3.8", t:"Tannhaus's son (origin world)"}], pos:[2.5,1],
    bio:[{ep:"3.8", t:"Tannhaus's son in the origin world. Jonas and Martha stop his car on the night of the crash."}]},
  {id:"sonja", name:"Sonja Tannhaus", fam:"tannhaus", ep:"3.8", role:[{ep:"3.8", t:"Marek's wife (origin world)"}], pos:[3.5,1],
    bio:[{ep:"3.8", t:"Marek's wife, origin world."}]},
  {id:"charlotte_o", name:"Charlotte Tannhaus", fam:"tannhaus", ep:"3.8", role:[{ep:"3.8", t:"Marek and Sonja's baby (origin world)"}], pos:[3,2],
    bio:[{ep:"3.8", t:"Marek and Sonja's baby daughter in the origin world."}]},

  // ---------- Doppler ----------
  {id:"bernd", name:"Bernd Doppler", fam:"doppler", ep:"1.3", job:[{ep:"1.3", t:"Plant director"}], role:[{ep:"1.3", t:"Retiring director of the Winden power plant (1986)"}], pos:[5,0],
    bio:[
      {ep:"1.3", t:"Retiring plant director in 1986. Hid yellow barrels of waste in the caves after a summer incident."},
      {ep:"1.8", t:"In 1953, Helge's father: pushing the new plant as \"The Energy of the Future\"."},
      {ep:"2.5", t:"Shows Claudia data: the 1986 incident matches the Higgs mechanism."},
      {ep:"3.1", t:"Strangled in 1987 by the scarred man, who takes his master key."}
    ]},
  {id:"greta", name:"Greta Doppler", fam:"doppler", ep:"1.8", role:[{ep:"1.8", t:"Helge's strict mother (1953)"}], pos:[6,0],
    bio:[{ep:"1.8", t:"Helge's strict mother in 1953."},{ep:"1.9", t:"Confesses to the pastor that she prayed for Helge to be taken, unsure he was her husband's child."},{ep:"3.2", t:"Helge's real father was Anatol Veliev."}]},
  {id:"helge", name:"Helge Doppler", fam:"doppler", ep:"1.1", job:[{ep:"1.3", t:"Plant security guard"}], role:[{ep:"1.1", t:"Peter's father; old man in a care home"},{ep:"1.3", t:"Peter's father; plant security guard in 1986"}], pos:[5.5,1],
    bio:[
      {ep:"1.1", t:"Peter's father, in a nursing home with dementia and a damaged ear. Warns: \"It's going to happen again.\""},
      {ep:"1.3", t:"A security guard at the plant in 1986; Claudia's old friend."},
      {ep:"1.7", t:"In 1986 he is the hooded kidnapper, working with Noah. Old Helge says he remembers everything."},
      {ep:"1.8", t:"As a boy in 1953, beaten with a rock by Ulrich and left in the bunker."},
      {ep:"1.10", t:"Old Helge travels to 1986 and dies in a car crash with his younger self. Young Helge (1953) is swept to 1986."},
      {ep:"2.3", t:"Returns home in 1954 after seven months, silent."},
      {ep:"2.7", t:"Calls the dead old woman \"the White Devil\"."},
      {ep:"3.3", t:"In the other world, confesses to killing Mads."}
    ]},
  {id:"peter", name:"Peter Doppler", fam:"doppler", ep:"1.1", job:[{ep:"1.1", t:"Therapist"}], role:[{ep:"1.1", t:"Therapist; Charlotte's husband"}], pos:[5,2],
    bio:[
      {ep:"1.1", t:"Jonas's therapist, Charlotte's husband, Helge's son."},
      {ep:"1.4", t:"Sleeps apart from Charlotte since she learned he'd visited Bernadette. Lies about where he was the night Mikkel vanished.", until:"1.10", later:"He was in the bunker when a dead boy (Mads) fell through a flash of light."},
      {ep:"1.10", t:"Secretly visits Benni. Works with Tronte on Claudia's instructions."},
      {ep:"2.4", t:"Says he and Tronte planned for these events with Claudia."},
      {ep:"3.1", t:"In the other world, he's a priest."},
      {ep:"3.5", t:"Met teen Charlotte in 1987 when he came to Winden to find his father. Killed by an attacker in 2020."}
    ]},
  {id:"charlotte", name:"Charlotte Doppler", fam:"doppler", ep:"1.1", job:[{ep:"1.1", t:"Police chief"}], role:[{ep:"1.1", t:"Winden's police chief"}], pos:[6,2],
    bio:[
      {ep:"1.1", t:"Winden's police chief. Peter's wife."},
      {ep:"1.3", t:"As a teen in 1986, sketches dead birds in the forest."},
      {ep:"2.5", t:"Noah tells her he is her father."},
      {ep:"2.8", t:"Elisabeth's daughter, and also her mother."},
      {ep:"3.2", t:"Survived the apocalypse by crossing to 2053."},
      {ep:"3.7", t:"Taken as a newborn from 2041 by Elisabeth and left with Tannhaus."}
    ]},
  {id:"franziska", name:"Franziska Doppler", fam:"doppler", ep:"1.1", role:[{ep:"1.1", t:"Peter and Charlotte's elder daughter"}], pos:[5,3],
    bio:[
      {ep:"1.1", t:"Peter and Charlotte's elder daughter; steals the teens' drug stash."},
      {ep:"1.4", t:"Keeps a hidden cash stash; sleeps with Magnus."},
      {ep:"2.2", t:"Has been supplying hormones to Benni."},
      {ep:"2.8", t:"An older Franziska serves Sic Mundus."},
      {ep:"3.1", t:"In the other world she is deaf."}
    ]},
  {id:"elisabeth", name:"Elisabeth Doppler", fam:"doppler", ep:"1.4", job:[{ep:"2.1", t:"Survivors' leader (2052)"}], role:[{ep:"1.4", t:"Peter and Charlotte's deaf younger daughter"},{ep:"2.1", t:"Deaf Doppler daughter; leads the survivors in 2052"}], pos:[6,3],
    bio:[
      {ep:"1.4", t:"Charlotte and Peter's deaf younger daughter. Meets a man named Noah who gives her a pocket watch."},
      {ep:"2.1", t:"In 2052 she leads the survivors near the forbidden zone."},
      {ep:"2.8", t:"Finds polaroids of herself, Noah and their baby, Charlotte."},
      {ep:"3.5", t:"Kills the man who killed Peter."},
      {ep:"3.7", t:"Pregnant by Noah; later takes newborn Charlotte to Tannhaus."}
    ]},

  // ---------- Tiedemann ----------
  {id:"egon", name:"Egon Tiedemann", fam:"tiedemann", ep:"1.3", job:[{ep:"1.3", t:"Police inspector"}], role:[{ep:"1.3", t:"Police inspector (1986); Claudia's father"}], pos:[7.75,0],
    bio:[
      {ep:"1.3", t:"Chief investigator in 1986, Claudia's father. Despises teen Ulrich."},
      {ep:"1.8", t:"A young officer in 1953."},
      {ep:"2.2", t:"Has cancer in 1987; still haunted by Mads's case."},
      {ep:"2.7", t:"Dies on June 26, 1987 after a struggle with Claudia: \"You are the White Devil.\""},
      {ep:"3.4", t:"Has an affair with Hannah in 1954."}
    ]},
  {id:"doris", name:"Doris Tiedemann", fam:"tiedemann", ep:"1.8", role:[{ep:"1.8", t:"Egon's wife (1953)"}], pos:[8.75,0],
    bio:[{ep:"1.8", t:"Egon's wife in 1953."},{ep:"2.3", t:"Grows close to Agnes."},{ep:"3.4", t:"Asks Egon for a divorce."}]},
  {id:"claudia", name:"Claudia Tiedemann", fam:"tiedemann", ep:"1.3", job:[{ep:"1.3", t:"Plant director"}], role:[{ep:"1.3", t:"New director of the Winden power plant (1986)"}], pos:[8.25,1],
    bio:[
      {ep:"1.3", t:"In 1986, the plant's new director. Regina's mother. Tronte's lover."},
      {ep:"1.8", t:"A girl in 1953, tutoring Helge."},
      {ep:"1.9", t:"Hires Aleksander to seal the cave door."},
      {ep:"2.2", t:"Meets her older self and digs up a time machine."},
      {ep:"2.3", t:"Travels from 1987 to 2020 and finds Regina sick."},
      {ep:"2.6", t:"Her older self tells Jonas that Adam lied and must be fought."},
      {ep:"2.7", t:"Lets Egon die to keep the secret. Leaves with Jonas \"to the future\"."},
      {ep:"3.2", t:"After the apocalypse, she cares for Regina and starts the string wall."},
      {ep:"3.8", t:"Her real goal all along: a world where Regina can live."}
    ]},
  {id:"regina", name:"Regina Tiedemann", fam:"tiedemann", ep:"1.1", job:[{ep:"1.1", t:"Hotel owner"}], role:[{ep:"1.1", t:"Owner of the Waldhotel; Bartosz's mother"}], pos:[7.75,2],
    bio:[
      {ep:"1.1", t:"Runs the Waldhotel. Bartosz's mother, Aleksander's wife."},
      {ep:"1.3", t:"A bullied, unhappy teen in 1986."},
      {ep:"1.6", t:"Was the last to see Mads alive. Her cancer has spread."},
      {ep:"1.9", t:"Raised by Claudia alone; she doesn't know who her father is."},
      {ep:"3.2", t:"Smothered by Tronte after the apocalypse."},
      {ep:"3.8", t:"Claudia tells Tronte he was never Regina's father."}
    ]},
  {id:"aleksander", name:"Aleksander Tiedemann", fam:"tiedemann", ep:"1.1", job:[{ep:"1.1", t:"Plant director"}], role:[{ep:"1.1", t:"Director of the Winden power plant"}], pos:[8.75,2],
    bio:[
      {ep:"1.1", t:"Director of the Winden nuclear plant; in Winden 33 years."},
      {ep:"1.9", t:"Arrived in 1986 wounded, carrying a gun and passports for \"Boris Niewald\" and \"Aleksander Köhler\". Hannah blackmails him."},
      {ep:"2.7", t:"Arrested by Clausen: the real Aleksander Köhler was Clausen's brother."},
      {ep:"3.6", t:"In the other world, confesses his name is Boris Niewald."}
    ]},
  {id:"bartosz", name:"Bartosz Tiedemann", fam:"tiedemann", ep:"1.1", role:[{ep:"1.1", t:"Jonas's best friend; Martha's boyfriend"}], pos:[8.25,3],
    bio:[
      {ep:"1.1", t:"Jonas's best friend; Martha's boyfriend."},
      {ep:"1.5", t:"Gets into Noah's car."},
      {ep:"1.10", t:"Recruited by Noah, who gives him a notebook."},
      {ep:"3.2", t:"Stranded in 1888 with Magnus and Franziska."},
      {ep:"3.7", t:"With Silja, becomes the father of Hanno (Noah) and Agnes."}
    ]},

  // ---------- Kahnwald ----------
  {id:"daniel", name:"Daniel Kahnwald", fam:"kahnwald", ep:"1.8", job:[{ep:"1.8", t:"Police chief"}], role:[{ep:"1.8", t:"Winden's police chief (1953)"}], pos:[10.5,0],
    bio:[{ep:"1.8", t:"Winden's police chief in 1953, and Ines's father."}]},
  {id:"ines", name:"Ines Kahnwald", fam:"kahnwald", ep:"1.1", job:[{ep:"1.3", t:"Nurse"}], role:[{ep:"1.1", t:"Michael's mother; Jonas's grandmother"},{ep:"1.3", t:"Nurse (1986); Jonas's grandmother"}], pos:[10.5,1],
    bio:[
      {ep:"1.1", t:"Michael's mother, Jonas's grandmother. Reads Michael's letter and cries."},
      {ep:"1.3", t:"A nurse in 1986 who cares for the boy from the future."},
      {ep:"1.5", t:"Once had a son who died at birth."},
      {ep:"1.10", t:"Adopts Mikkel and names him Michael."},
      {ep:"2.5", t:"Drugs old Ulrich to protect Mikkel."}
    ]},
  {id:"michael", name:"Michael Kahnwald", fam:"kahnwald", ep:"1.1", job:[{ep:"1.1", t:"Painter"}], role:[{ep:"1.1", t:"Jonas's late father, a painter"}], pos:[10.5,2],
    bio:[
      {ep:"1.1", t:"Jonas's father, a painter. Hanged himself on June 21, 2019, leaving a letter not to be opened before Nov 4, 22:13. No one knows why.", until:"2.6", later:"Jonas's visit from 1921 made him remember who he was."},
      {ep:"1.5", t:"His letter: he was Mikkel Nielsen, who fell from 2019 into 1986."},
      {ep:"2.6", t:"Writes the letter on June 20, 2019 after meeting Jonas."}
    ]},
  {id:"hannah", name:"Hannah Kahnwald", fam:"kahnwald", ep:"1.1", role:[{ep:"1.1", t:"Jonas's mother; Michael's widow"}], pos:[11.5,2],
    bio:[
      {ep:"1.1", t:"Jonas's mother, Michael's widow. Secretly sleeping with Ulrich."},
      {ep:"1.5", t:"As a teen in 1986, reports Ulrich for raping Katharina."},
      {ep:"1.9", t:"Maiden name Krüger. Blackmails Aleksander into ruining Ulrich."},
      {ep:"2.2", t:"Travels to 1987 with the Stranger and sees Mikkel with Ines."},
      {ep:"2.7", t:"Goes to 1954 posing as \"Katharina Nielsen\" and stays."},
      {ep:"3.4", t:"Affair with Egon; pregnant. Gives her St. Christopher medal to a girl named Helene."},
      {ep:"3.7", t:"Gives birth to Egon's daughter, Silja, and later takes her to 1911 to find Jonas. Hannah dies there."},
      {ep:"3.8", t:"In the origin world, pregnant and thinking of the name Jonas."}
    ]},
  {id:"jonas", name:"Jonas Kahnwald", fam:"kahnwald", ep:"1.1", role:[{ep:"1.1", t:"Teenager; Hannah and Michael's son"}], pos:[11,3],
    bio:[
      {ep:"1.1", t:"Teen returning to school after his father's suicide; in therapy with Peter. In love with Martha."},
      {ep:"1.5", t:"Learns from his father's letter that Michael was Mikkel."},
      {ep:"1.6", t:"Passes through the cave door into 1986."},
      {ep:"1.10", t:"Swept by a wormhole to 2052."},
      {ep:"2.2", t:"Steps into the God particle in 2053 and wakes in 1921."},
      {ep:"2.6", t:"Visits Michael on June 20, 2019. The visit is what drives Michael to it."},
      {ep:"2.7", t:"Trained for a year by old Claudia; leaves 1987 with young Claudia."},
      {ep:"2.8", t:"Watches Adam shoot Martha. Another Martha takes him away."},
      {ep:"3.1", t:"Lands in a Winden where he was never born."},
      {ep:"3.5", t:"Shot dead in the other world by an older Martha."},
      {ep:"3.6", t:"In another branch he survived the apocalypse in his own world."},
      {ep:"3.8", t:"Goes with the other Martha to the origin world to prevent the split. Both fade away."}
    ]},

  // ---------- Nielsen ----------
  {id:"agnes", name:"Agnes Nielsen", fam:"nielsen", ep:"1.8", role:[{ep:"1.8", t:"Tronte's mother, new in Winden (1953)"}], pos:[13,0],
    bio:[
      {ep:"1.8", t:"Arrives in Winden in 1953 with her son Tronte. Ulrich's grandmother."},
      {ep:"1.9", t:"Says her late husband was not a good man."},
      {ep:"2.3", t:"Works with Noah and the old woman. Wants to return to Adam."},
      {ep:"2.3", t:"Noah's sister."},
      {ep:"2.8", t:"Shoots older Noah in 1921."},
      {ep:"3.4", t:"Enters the God particle in 2053."},
      {ep:"3.7", t:"Daughter of Bartosz and Silja."}
    ]},
  {id:"tronte", name:"Tronte Nielsen", fam:"nielsen", ep:"1.2", job:[{ep:"1.3", t:"Journalist"}], role:[{ep:"1.2", t:"Ulrich's father; Jana's husband"},{ep:"1.3", t:"Ulrich's father; a journalist in 1986"}], pos:[13,1],
    bio:[
      {ep:"1.2", t:"Jana's husband. Can't explain where he was the night Mikkel vanished.", until:"1.10", later:"He was helping Peter with Mads's body on Claudia's orders."},
      {ep:"1.3", t:"A journalist in 1986, Claudia's lover."},
      {ep:"1.8", t:"A boy in 1953 with cigarette burns, son of Agnes."},
      {ep:"3.2", t:"Smothers Regina after the apocalypse."}
    ]},
  {id:"jana", name:"Jana Nielsen", fam:"nielsen", ep:"1.1", role:[{ep:"1.1", t:"Ulrich's mother"}], pos:[14,1],
    bio:[
      {ep:"1.1", t:"Ulrich's mother. Saw a large-headed figure in the forest. \"History is repeating itself.\""},
      {ep:"1.3", t:"In 1986, mistakes Mikkel for her missing son Mads."},
      {ep:"1.6", t:"Admits she lied about Tronte's whereabouts in 1986."},
      {ep:"1.8", t:"A young woman in 1953."}
    ]},
  {id:"ulrich", name:"Ulrich Nielsen", fam:"nielsen", ep:"1.1", job:[{ep:"1.1", t:"Police officer"}], role:[{ep:"1.1", t:"Police officer; Katharina's husband"}], pos:[12.5,2],
    bio:[
      {ep:"1.1", t:"Police officer. Katharina's husband, father of Magnus, Martha and Mikkel. Brother of Mads, who vanished in 1986. Sleeping with Hannah."},
      {ep:"1.3", t:"A rebellious teen in 1986."},
      {ep:"1.5", t:"Ends the affair with Hannah."},
      {ep:"1.7", t:"Works out Helge took the boys; suspended."},
      {ep:"1.8", t:"Lands in 1953 and beats young Helge, hoping to stop the future."},
      {ep:"1.9", t:"Arrested by Egon in 1953."},
      {ep:"2.2", t:"Still locked in an asylum in 1987, now old: \"the Inspector\"."},
      {ep:"2.5", t:"Escapes, finds Mikkel, is recaptured."},
      {ep:"3.1", t:"In the other world: police chief, married to Hannah."}
    ]},
  {id:"mads", name:"Mads Nielsen", fam:"nielsen", ep:"1.1", role:[{ep:"1.1", t:"Ulrich's little brother, missing since 1986"}], pos:[14.5,2],
    bio:[
      {ep:"1.1", t:"Ulrich's little brother. Vanished in 1986 and was never found."},
      {ep:"1.6", t:"The dead boy found in 2019 is Mads."},
      {ep:"1.10", t:"His body fell through a flash of light in the bunker on Nov 4, 2019."}
    ]},
  {id:"magnus", name:"Magnus Nielsen", fam:"nielsen", ep:"1.1", role:[{ep:"1.1", t:"Eldest Nielsen child"}], pos:[12,3],
    bio:[
      {ep:"1.1", t:"Eldest Nielsen child."},
      {ep:"1.4", t:"Sleeps with Franziska."},
      {ep:"2.6", t:"An older Magnus is with Adam in 1921."},
      {ep:"3.2", t:"Stranded in 1888."}
    ]},
  {id:"martha", name:"Martha Nielsen", fam:"nielsen", ep:"1.1", role:[{ep:"1.1", t:"Ulrich and Katharina's daughter"}], pos:[13,3],
    bio:[
      {ep:"1.1", t:"Ulrich and Katharina's daughter. Dating Bartosz. Plays Ariadne in the school play."},
      {ep:"1.5", t:"Kisses Jonas."},
      {ep:"1.5", t:"If Michael was Mikkel, she is Jonas's aunt."},
      {ep:"2.6", t:"Sleeps with Jonas on June 20, 2019."},
      {ep:"2.7", t:"Ends things with Bartosz; learns the Stranger is Jonas."},
      {ep:"2.8", t:"Shot by Adam on apocalypse day."}
    ]},
  {id:"mikkel", name:"Mikkel Nielsen", fam:"nielsen", ep:"1.1", role:[{ep:"1.1", t:"Youngest Nielsen child; loves magic tricks"}], pos:[14,3],
    bio:[
      {ep:"1.1", t:"Youngest Nielsen, a boy who loves magic tricks: \"The question isn't how, it's when.\" Vanishes near the caves.", until:"1.2", later:"He came out of the caves in 1986."},
      {ep:"1.2", t:"Walks out of the caves into 1986."},
      {ep:"1.3", t:"In hospital in 1986, cared for by Ines."},
      {ep:"1.10", t:"Adopted by Ines and renamed Michael Kahnwald."}
    ]},

  // ---------- Albers ----------
  {id:"katharina", name:"Katharina Nielsen", fam:"albers", ep:"1.1", job:[{ep:"1.1", t:"School principal"}], role:[{ep:"1.1", t:"School principal; Ulrich's wife"}], pos:[13.5,2],
    bio:[
      {ep:"1.1", t:"School principal, Ulrich's wife. Finds a long hair on his hoodie."},
      {ep:"1.3", t:"Teen Katharina Albers, Ulrich's girlfriend in 1986."},
      {ep:"2.4", t:"Learns Mikkel went to the 1980s."},
      {ep:"2.8", t:"Takes the time machine into the caves."},
      {ep:"3.2", t:"In 1987, finds her mother Helene working as a nurse."},
      {ep:"3.5", t:"Killed by Helene, who doesn't know who she is."}
    ]},
  {id:"helene", name:"Helene Albers", fam:"albers", ep:"3.2", job:[{ep:"3.2", t:"Nurse"}], role:[{ep:"3.2", t:"Nurse (1987); Katharina's mother"}], pos:[16.5,1],
    bio:[
      {ep:"3.2", t:"A nurse in 1987. Katharina's violent mother."},
      {ep:"3.4", t:"As a girl in 1954, receives a St. Christopher medal from Hannah."},
      {ep:"3.5", t:"Kills adult Katharina by the lake."}
    ]},

  // ---------- Others ----------
  {id:"jurgen", name:"Jürgen Obendorf", fam:"obendorf", ep:"1.1", role:[{ep:"1.1", t:"Erik's father"}], pos:[16.5,2],
    bio:[{ep:"1.1", t:"Erik's father."},{ep:"1.2", t:"Drives for the plant; Aleksander orders him to \"get rid of them\"."}]},
  {id:"ulla", name:"Ulla Obendorf", fam:"obendorf", ep:"1.1", role:[{ep:"1.1", t:"Erik's mother"}], pos:[17.5,2],
    bio:[{ep:"1.1", t:"Erik's mother. Spits on Charlotte."}]},
  {id:"erik", name:"Erik Obendorf", fam:"obendorf", ep:"1.1", role:[{ep:"1.1", t:"Teen dealer, missing since October"}], pos:[17,3],
    bio:[{ep:"1.1", t:"Teen dealer, missing since Oct 22, 2019."},{ep:"1.8", t:"Two dead boys found in 1953 are implied to be Erik and Yasin."}]},
  {id:"yasin", name:"Yasin Friese", fam:"others", ep:"1.4", role:[{ep:"1.4", t:"Elisabeth's friend"}], pos:[18,3],
    bio:[{ep:"1.4", t:"Elisabeth's friend."},{ep:"1.5", t:"Goes missing."}]},
  {id:"torben", name:"Torben Wöller", fam:"others", ep:"1.2", job:[{ep:"1.2", t:"Police officer"}], role:[{ep:"1.2", t:"Police officer"}], pos:[19,2],
    bio:[{ep:"1.2", t:"Police officer with an eyepatch."},{ep:"2.8", t:"Admits he helped hide radioactive waste."},{ep:"3.1", t:"In the other world, missing an arm."}]},
  {id:"benni", name:"Benni (Bernadette)", fam:"others", ep:"1.4", role:[{ep:"1.4", t:"Sex worker living in a caravan at the truck stop"}], pos:[20,2],
    bio:[{ep:"1.4", t:"Works out of a caravan in the truck-stop car park. Charlotte knows Peter has visited her."},{ep:"1.10", t:"On the night Mikkel vanished, Peter drove to her but changed his mind."},{ep:"2.1", t:"Torben Wöller is her sibling; he visits for coffee, and hides the plant's yellow barrels where she lives."},{ep:"2.2", t:"Gets hormones from Franziska."},{ep:"3.8", t:"Full name: Bernadette Wöller."}]},
  {id:"jasmin", name:"Jasmin Trewen", fam:"others", ep:"1.3", job:[{ep:"1.3", t:"Plant secretary"}], role:[{ep:"1.3", t:"Claudia's secretary at the plant"}], pos:[20,1],
    bio:[{ep:"1.3", t:"Claudia's secretary."},{ep:"3.2", t:"Murdered in 1987 by the scarred man."}]},
  {id:"clausen", name:"Clausen", fam:"others", ep:"2.1", job:[{ep:"2.1", t:"Federal investigator"}], role:[{ep:"2.1", t:"Federal police investigator"}], pos:[19,1],
    bio:[{ep:"2.1", t:"Federal investigator sent to Winden in 2020."},{ep:"2.7", t:"Brother of the real Aleksander Köhler."}]},
  {id:"noah", name:"Noah", fam:"unknown", ep:"1.4", job:[{ep:"1.5", t:"Priest"},{ep:"2.1", t:"Sic Mundus"}], role:[{ep:"1.4", t:"Tall man in a hat who meets Elisabeth"},{ep:"1.5", t:"Poses as a priest; recruits Bartosz"},{ep:"2.1", t:"Sic Mundus member; travels through time"}], pos:[1,1],
    bio:[
      {ep:"1.4", t:"A tall man with a hat who gives Elisabeth a pocket watch. Old Helge keeps naming him."},
      {ep:"1.5", t:"Appears as a priest in 1986 and debates God with Mikkel. Picks up Bartosz in 2019. Carries a black notebook."},
      {ep:"1.7", t:"Bare-chested in the bunker, an Emerald Tablet tattoo on his back."},
      {ep:"1.9", t:"In the 1950s he's Winden's pastor, Hanno Tauber. Unchanged in 1986 and 2019, he and Helge are behind the kidnapped boys."},
      {ep:"1.10", t:"Tells Bartosz Claudia is his enemy in a war of light and shadow."},
      {ep:"2.1", t:"A young Noah kills a man in the caves in 1921. Works for Adam."},
      {ep:"2.3", t:"Shoots the old woman; reads the missing pages and lies to Adam."},
      {ep:"2.5", t:"Charlotte's father."},
      {ep:"2.8", t:"Shot by Agnes in 1921 after turning a gun on Adam."},
      {ep:"3.7", t:"Son of Bartosz and Silja, who named him Hanno; Adam renamed him Noah. The man he killed in 1921 was his own father, Bartosz."}
    ]},

  // ---------- Added from the official Netflix guide's family tree ----------
  {id:"heinrich", name:"Heinrich Tannhaus", fam:"tannhaus", ep:"3.3", role:[{ep:"3.3", t:"Gustav Tannhaus's father"}], pos:[3,-3],
    bio:[{ep:"3.3", t:"Gustav's father. The family's old pocket watch starts with him, as a gift to his wife Charlotte."}]},
  {id:"gustav", name:"Gustav Tannhaus", fam:"tannhaus", ep:"3.2", job:[{ep:"3.2", t:"Factory owner"}], role:[{ep:"3.2", t:"Blind factory owner; Sic Mundus member (1888)"}], pos:[3,-2],
    bio:[{ep:"3.2", t:"Blind owner of the Tannhaus factory in 1888, an early Sic Mundus member and an ancestor of the clockmaker."},
         {ep:"3.3", t:"Killed by the Unknown on his way to tell the world about the time travellers."}]},
  {id:"leopold", name:"Leopold Tannhaus", fam:"tannhaus", ep:"3.2", role:[{ep:"3.2", t:"H.G. Tannhaus's father"}], pos:[3,-1],
    bio:[{ep:"3.2", t:"Gustav's son and H.G. Tannhaus's father."}]},
  {id:"anatol", name:"Anatol Veliev", fam:"doppler", ep:"3.2", role:[{ep:"3.2", t:"Helge's biological father"}], pos:[6.9,0],
    bio:[{ep:"3.2", t:"Helge's biological father, per the official family tree. Greta had doubted Bernd was."}]},
  {id:"ulla_s", name:"Ulla Schmidt", fam:"doppler", ep:"3.2", role:[{ep:"3.2", t:"Peter's mother"}], pos:[6.5,1],
    bio:[{ep:"3.2", t:"Helge's partner and Peter's mother."}]},
  {id:"hermann", name:"Hermann Albers", fam:"albers", ep:"1.3", job:[{ep:"1.3", t:"Farmer"}], role:[{ep:"1.3", t:"Katharina's father"}], pos:[15.5,1],
    bio:[{ep:"1.3", t:"Katharina's father. In 1986, 33 sheep die on his farm."}]},
  {id:"sebastian", name:"Sebastian Krüger", fam:"kahnwald", ep:"1.5", role:[{ep:"1.5", t:"Hannah's father"}], pos:[11.75,1],
    bio:[{ep:"1.5", t:"Teenage Hannah's father in 1986."},{ep:"1.6", t:"With Hannah, gives a stranded Jonas a lift in 1986."}]},

  // ---------- Other world ----------
  {id:"martha_alt", name:"Martha (other world)", fam:"otherworld", ep:"2.8", role:[{ep:"2.8", t:"A Martha from somewhere else"},{ep:"3.1", t:"Martha from another world"}], pos:[21.5,3],
    bio:[
      {ep:"2.8", t:"A Martha appears after Martha's death, with a strange device: \"The question isn't when, but what world.\""},
      {ep:"3.1", t:"From a Winden where Jonas never existed. A scarred, older version of her reaches the Stranger in 1888."},
      {ep:"3.2", t:"Tells the 1888 group that Jonas is Adam."},
      {ep:"3.3", t:"Escapes 1888 to Adam in 2053: she gave \"it\" to Jonas."},
      {ep:"3.4", t:"Pregnant. Young Martha and Jonas sleep together in 2019."},
      {ep:"3.5", t:"An older Martha shoots Jonas; the young one promises to make things right."},
      {ep:"3.6", t:"Engulfed by the God particle in 2053."},
      {ep:"3.8", t:"Goes with Jonas to the origin world. Both fade away."}
    ]},
  {id:"eva", name:"Eva", fam:"otherworld", ep:"3.1", role:[{ep:"3.1", t:"Old woman with a scar under her eye"},{ep:"3.2", t:"Eva: an older Martha from the other world"}], pos:[21.5,1],
    bio:[
      {ep:"3.1", t:"An old woman with a scar under her eye. Tells Jonas his presence will make this world fall apart."},
      {ep:"3.2", t:"Calls herself Eva: an older Martha from the other world. Says the ends are fixed."},
      {ep:"3.3", t:"\"We are Adam and Eva.\" Says Martha must die so others can live."},
      {ep:"3.5", t:"\"So it begins anew\": her side kills Jonas."},
      {ep:"3.8", t:"Accepts she and Adam are the mistake. Fades with him."}
    ]}
];

// Relationship types: parent, married, partner, affair, sibling, adoptive, same, counterpart, raised
const LINKS = [
  // Kahnwald
  {a:"hannah", b:"michael", type:"married", ep:"1.1"},
  {a:"michael", b:"jonas", type:"parent", ep:"1.1"},
  {a:"hannah", b:"jonas", type:"parent", ep:"1.1"},
  {a:"ines", b:"michael", type:"parent", ep:"1.1", until:"1.10", later:"Adoptive mother"},
  {a:"ines", b:"michael", type:"adoptive", ep:"1.10"},
  {a:"mikkel", b:"michael", type:"same", ep:"1.5"},
  // Nielsen
  {a:"ulrich", b:"katharina", type:"married", ep:"1.1"},
  {a:"ulrich", b:"magnus", type:"parent", ep:"1.1"},{a:"katharina", b:"magnus", type:"parent", ep:"1.1"},
  {a:"ulrich", b:"martha", type:"parent", ep:"1.1"},{a:"katharina", b:"martha", type:"parent", ep:"1.1"},
  {a:"ulrich", b:"mikkel", type:"parent", ep:"1.1"},{a:"katharina", b:"mikkel", type:"parent", ep:"1.1"},
  {a:"jana", b:"ulrich", type:"parent", ep:"1.1"},{a:"jana", b:"mads", type:"parent", ep:"1.1"},
  {a:"tronte", b:"jana", type:"married", ep:"1.2"},
  {a:"tronte", b:"ulrich", type:"parent", ep:"1.2"},{a:"tronte", b:"mads", type:"parent", ep:"1.2"},
  {a:"agnes", b:"tronte", type:"parent", ep:"1.8"},
  {a:"ulrich", b:"hannah", type:"affair", ep:"1.1"},
  {a:"helene", b:"katharina", type:"parent", ep:"3.2"},
  // Doppler
  {a:"peter", b:"charlotte", type:"married", ep:"1.1"},
  {a:"peter", b:"franziska", type:"parent", ep:"1.1"},{a:"charlotte", b:"franziska", type:"parent", ep:"1.1"},
  {a:"peter", b:"elisabeth", type:"parent", ep:"1.4"},{a:"charlotte", b:"elisabeth", type:"parent", ep:"1.4"},
  {a:"helge", b:"peter", type:"parent", ep:"1.1"},
  {a:"bernd", b:"greta", type:"married", ep:"1.8"},
  {a:"bernd", b:"helge", type:"parent", ep:"1.8", until:"1.9", later:"Greta isn't sure Bernd is Helge's father"},{a:"greta", b:"helge", type:"parent", ep:"1.8"},
  {a:"peter", b:"benni", type:"affair", ep:"1.4"},{a:"torben", b:"benni", type:"sibling", ep:"2.1"},
  {a:"kidnapper", b:"helge", type:"same", ep:"1.7"},
  {a:"soldier", b:"elisabeth", type:"same", ep:"2.1"},
  {a:"tannhaus", b:"charlotte", type:"raised", ep:"2.1", label:"grandfather", until:"2.5", later:"Raised her; not related by blood"},
  {a:"tannhaus", b:"charlotte", type:"adoptive", ep:"2.5", label:"raised her"},
  {a:"noah", b:"charlotte", type:"parent", ep:"2.5"},
  {a:"elisabeth", b:"charlotte", type:"parent", ep:"2.8"},
  {a:"noah", b:"elisabeth", type:"partner", ep:"2.8"},
  // Tiedemann
  {a:"egon", b:"claudia", type:"parent", ep:"1.3"},
  {a:"egon", b:"doris", type:"married", ep:"1.8"},
  {a:"doris", b:"claudia", type:"parent", ep:"1.8"},
  {a:"claudia", b:"regina", type:"parent", ep:"1.3"},
  {a:"regina", b:"aleksander", type:"married", ep:"1.1"},
  {a:"regina", b:"bartosz", type:"parent", ep:"1.1"},{a:"aleksander", b:"bartosz", type:"parent", ep:"1.1"},
  {a:"tronte", b:"claudia", type:"affair", ep:"1.3"},
  {a:"agnes", b:"doris", type:"affair", ep:"2.3"},
  {a:"oldclaudia", b:"claudia", type:"same", ep:"2.2"},
  // Couples among the teens
  {a:"martha", b:"bartosz", type:"partner", ep:"1.1", until:"2.7", later:"Martha ends it"},
  {a:"magnus", b:"franziska", type:"partner", ep:"1.4"},
  {a:"jonas", b:"martha", type:"partner", ep:"1.5"},
  // Obendorf
  {a:"jurgen", b:"ulla", type:"married", ep:"1.1"},
  {a:"jurgen", b:"erik", type:"parent", ep:"1.1"},{a:"ulla", b:"erik", type:"parent", ep:"1.1"},
  // Identities
  {a:"stranger", b:"jonas", type:"same", ep:"1.10"},
  {a:"adam", b:"jonas", type:"same", ep:"2.4"},
  {a:"adam", b:"stranger", type:"same", ep:"2.4"},
  // Sic Mundus family knot
  {a:"agnes", b:"noah", type:"sibling", ep:"2.3"},
  {a:"hannah", b:"egon", type:"affair", ep:"3.4"},
  {a:"hannah", b:"silja", type:"parent", ep:"3.7"},{a:"egon", b:"silja", type:"parent", ep:"3.7"},
  {a:"bartosz", b:"silja", type:"partner", ep:"3.7"},
  {a:"bartosz", b:"noah", type:"parent", ep:"3.7"},{a:"silja", b:"noah", type:"parent", ep:"3.7"},
  {a:"bartosz", b:"agnes", type:"parent", ep:"3.7"},{a:"silja", b:"agnes", type:"parent", ep:"3.7"},
  // Other world
  {a:"martha", b:"martha_alt", type:"counterpart", ep:"3.1"},
  {a:"eva", b:"martha_alt", type:"same", ep:"3.2"},
  {a:"jonas", b:"martha_alt", type:"partner", ep:"3.4"},
  {a:"jonas", b:"unknown", type:"parent", ep:"3.8"},{a:"martha_alt", b:"unknown", type:"parent", ep:"3.8"},
  {a:"unknown", b:"tronte", type:"parent", ep:"3.8"},
  {a:"agnes", b:"unknown", type:"partner", ep:"3.8"},
  // From the official family tree
  {a:"anatol", b:"helge", type:"parent", ep:"3.2"},
  {a:"greta", b:"anatol", type:"affair", ep:"3.2"},
  {a:"helge", b:"ulla_s", type:"partner", ep:"3.2"},
  {a:"ulla_s", b:"peter", type:"parent", ep:"3.2"},
  {a:"hermann", b:"katharina", type:"parent", ep:"1.3"},
  {a:"hermann", b:"helene", type:"married", ep:"3.2"},
  {a:"sebastian", b:"hannah", type:"parent", ep:"1.5"},
  {a:"heinrich", b:"gustav", type:"parent", ep:"3.3"},
  {a:"gustav", b:"leopold", type:"parent", ep:"3.2"},
  {a:"leopold", b:"tannhaus", type:"parent", ep:"3.2"},
  {a:"tronte", b:"regina", type:"parent", ep:"3.2", until:"3.8", later:"Claudia tells Tronte he isn't Regina's father"},
  // Origin world
  {a:"tannhaus", b:"marek", type:"parent", ep:"3.8"},
  {a:"daniel", b:"ines", type:"parent", ep:"1.8"},
  {a:"marek", b:"sonja", type:"married", ep:"3.8"},
  {a:"marek", b:"charlotte_o", type:"parent", ep:"3.8"},{a:"sonja", b:"charlotte_o", type:"parent", ep:"3.8"},
  {a:"charlotte", b:"charlotte_o", type:"counterpart", ep:"3.8"}
];

// World: A = Jonas's world, B = Martha's other world, O = origin world.
// date: "YYYY", "YYYY-MM" or "YYYY-MM-DD"; null = time unknown.
const EVENTS = [
  // ---- S1E1 ----
  {ep:"1.1", w:"A", d:"2019-06-21", t:"Michael Kahnwald hangs himself in his attic. He leaves a sealed letter: not to be opened before November 4, 22:13.", who:["michael"]},
  {ep:"1.1", w:"A", d:"2019-10-22", t:"Erik Obendorf goes missing.", who:["erik"]},
  {ep:"1.1", w:"A", d:"2019-11-04", t:"Jonas returns to school after two months away. Martha is now with Bartosz.", who:["jonas","martha","bartosz"]},
  {ep:"1.1", w:"A", d:"2019-11-04", t:"Jana tells Ulrich she saw a dark figure in the forest and found a Raider wrapper, Mads's favourite: \"It's happening again.\"", who:["jana","ulrich","mads"]},
  {ep:"1.1", w:"A", d:"2019-11-04", t:"At night the teens look for Erik's stash at the caves. A roar, flickering lights, and Mikkel is gone.", who:["jonas","martha","magnus","bartosz","franziska","mikkel"]},
  {ep:"1.1", w:"A", d:"2019-11-04", t:"After 22:13 Ines reads Michael's letter, and cries.", who:["ines"]},
  {ep:"1.1", w:"A", d:"2019-11-05", t:"Police fear Mikkel was taken by whoever took Erik.", who:["mikkel","ulrich","charlotte"], until:"1.2", later:"Mikkel walked out of the caves in 1986."},
  {ep:"1.1", w:"A", d:"2019-11-05", t:"A boy's body is found in the forest: burned eyes, ruptured ears, 1980s clothes and a Walkman. It isn't Mikkel.", who:["ulrich","charlotte"]},
  {ep:"1.1", w:"A", d:"1986", t:"Ulrich's brother Mads disappears. He is never found.", who:["mads","ulrich"]},
  {ep:"1.1", w:"A", d:null, t:"Somewhere, a hooded figure straps Erik into a chair; a coin on a red cord goes around his neck.", who:["erik","kidnapper"], until:"1.7", later:"This is 1986: Helge Doppler's bunker room."},

  // ---- S1E2 ----
  {ep:"1.2", w:"A", d:"2019-11-05", t:"A stranger checks into the Waldhotel, room 8, and covers the walls with notes on time and black holes.", who:["stranger","regina"]},
  {ep:"1.2", w:"A", d:"2019-11-05", t:"Ulrich finds a sealed steel door in the caves with a radiation sign. Aleksander blocks a search of the plant.", who:["ulrich","aleksander"]},
  {ep:"1.2", w:"A", d:"2019-11-05", t:"Jonas finds his father's cave map in the attic: \"Where is the crossing?\"", who:["jonas","michael"]},
  {ep:"1.2", w:"A", d:"2019-11-05", t:"Tronte can't account for where he was on the night Mikkel vanished.", who:["tronte","jana"], until:"1.10", later:"He was helping Peter with Mads's body, on Claudia's orders."},
  {ep:"1.2", w:"A", d:"2019-11-05", t:"The Stranger changes a newspaper headline from \"Where\" to \"When\".", who:["stranger"]},
  {ep:"1.2", w:"A", d:"1986-11-05", t:"Mikkel walks out of the caves into 1986. Teen Ulrich slams the door on him. The paper's lead story is Chernobyl.", who:["mikkel","ulrich"]},

  // ---- S1E3 ----
  {ep:"1.3", w:"A", d:"1986-06", t:"A summer incident at the plant is covered up.", who:["bernd"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Mikkel visits his grandmother Jana, who is grieving Mads, and meets teen Hannah and Katharina.", who:["mikkel","jana","hannah","katharina"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Claudia Tiedemann becomes plant director. Bernd Doppler hands her a key to yellow barrels hidden in the caves.", who:["claudia","bernd"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Tronte, a journalist, begs Claudia to keep their affair going. She refuses.", who:["tronte","claudia"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Egon Tiedemann suspects teen Ulrich hurt the boy. Nurse Ines cares for Mikkel.", who:["egon","ulrich","ines","mikkel"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Dead birds fall and 33 sheep die on Hermann Albers's farm. Through the passage, Mikkel (1986) and Ulrich (2019) hear each other.", who:["mikkel","ulrich","hermann"]},
  {ep:"1.3", w:"A", d:"1986-11-05", t:"Old clockmaker H.G. Tannhaus finishes a brass device identical to the Stranger's.", who:["tannhaus"]},

  // ---- S1E4 ----
  {ep:"1.4", w:"A", d:"2019-11-06", t:"Charlotte finds a wildlife-camera shot of Peter's car near the caves the night Mikkel vanished. Peter lied.", who:["charlotte","peter"], until:"1.10", later:"Peter was at the bunker, where Mads's body fell through a flash of light."},
  {ep:"1.4", w:"A", d:"2019-11-06", t:"A man called Noah gives Elisabeth a pocket watch engraved \"For Charlotte\".", who:["elisabeth","noah","charlotte"]},
  {ep:"1.4", w:"A", d:"2019-11-06", t:"Magnus finds Franziska's secret cash; they sleep together.", who:["magnus","franziska"]},
  {ep:"1.4", w:"A", d:"2019-11-07", t:"A hooded man stops Yasin: \"Noah sent me.\"", who:["yasin","kidnapper"]},

  // ---- S1E5 ----
  {ep:"1.5", w:"A", d:"2019-11-07", t:"Yasin Friese is reported missing.", who:["yasin"]},
  {ep:"1.5", w:"A", d:"1986-11-07", t:"A priest named Noah visits Mikkel in hospital.", who:["noah","mikkel"]},
  {ep:"1.5", w:"A", d:"1986-11-07", t:"Teen Hannah tells police Ulrich raped Katharina. Egon arrests him.", who:["hannah","ulrich","egon","katharina"]},
  {ep:"1.5", w:"A", d:"2019-11-07", t:"Ulrich ends his affair with Hannah.", who:["ulrich","hannah"]},
  {ep:"1.5", w:"A", d:"2019-11-07", t:"Bartosz gets into Noah's car. Jonas and Martha kiss.", who:["bartosz","noah","jonas","martha"]},
  {ep:"1.5", w:"A", d:"2019-11-07", t:"Via Regina, the Stranger gives Jonas a package with Michael's letter: Michael was Mikkel, who fell from 2019 into 1986.", who:["stranger","jonas","michael","mikkel"]},
  {ep:"1.5", w:"A", d:"1986-11-07", t:"The Stranger visits Tannhaus to talk about time.", who:["stranger","tannhaus"]},

  // ---- S1E6 ----
  {ep:"1.6", w:"A", d:"1986", t:"Teen Ulrich and Katharina tie Regina to a tree by the caves and leave her. She screams at something.", who:["ulrich","katharina","regina"]},
  {ep:"1.6", w:"A", d:"2019-11-08", t:"Ulrich learns Tronte was with Claudia the night Mads vanished, and that Regina was the last to see Mads.", who:["ulrich","tronte","claudia","regina","jana"]},
  {ep:"1.6", w:"A", d:"2019-11-08", t:"Regina's cancer has spread.", who:["regina","aleksander"]},
  {ep:"1.6", w:"A", d:"2019-11-08", t:"Jonas follows a red thread to a door marked \"Sic Mundus Creatus Est\" and goes through.", who:["jonas"]},
  {ep:"1.6", w:"A", d:"1986-11-08", t:"Jonas arrives in 1986. Teen Hannah and her father give him a lift.", who:["jonas","hannah","sebastian"]},
  {ep:"1.6", w:"A", d:"2019-11-08", t:"Ulrich identifies the dead boy as his brother Mads.", who:["ulrich","mads"]},

  // ---- S1E7 ----
  {ep:"1.7", w:"A", d:"1986-11-09", t:"In 1986 Jonas finds Mikkel in hospital. The Stranger warns him: take Mikkel back and you erase yourself.", who:["jonas","mikkel","stranger","regina"]},
  {ep:"1.7", w:"A", d:"1986-11", t:"Helge Doppler is the kidnapper. Working with Noah, he takes boys through the bunker and drags Mads's body into the forest.", who:["helge","noah","mads","kidnapper"]},
  {ep:"1.7", w:"A", d:"2019-11-09", t:"Ulrich is suspended after confronting old Helge. Charlotte finds the tunnels run under the Doppler cabin.", who:["ulrich","helge","charlotte"]},
  {ep:"1.7", w:"A", d:"2019-11-09", t:"Noah chalks two dates on the bunker wall: 5.11.1953 and 9.11.1953. Ulrich chases Helge into the caves.", who:["noah","ulrich","helge"]},

  // ---- S1E8 ----
  {ep:"1.8", w:"A", d:"1953-11-10", t:"Two dead boys found at the future plant site: burned eyes, 1986 coins on red cords, clothes made in China.", who:["egon","daniel"]},
  {ep:"1.8", w:"A", d:"1953-11-10", t:"Ulrich lands in 1953. He meets Agnes and her boy Tronte, his father, and young Jana, his mother.", who:["ulrich","agnes","tronte","jana"]},
  {ep:"1.8", w:"A", d:"1953-11-10", t:"Egon's dog Gretchen runs into the caves.", who:["claudia","tronte","egon"]},
  {ep:"1.8", w:"A", d:"1953-11-10", t:"Ulrich beats young Helge with a rock and leaves him in the bunker, hoping to stop the killings.", who:["ulrich","helge"]},
  {ep:"1.8", w:"A", d:"1953-11-10", t:"Tannhaus finds Ulrich's forgotten jacket. In it is a smartphone with a 2019 photo.", who:["tannhaus","ulrich"]},
  {ep:"1.8", w:"A", d:"1986-11-10", t:"The Stranger tells Tannhaus he came from the future and wants to destroy the wormhole. He shows a broken device with Tannhaus's initials.", who:["stranger","tannhaus"]},

  // ---- S1E9 ----
  {ep:"1.9", w:"A", d:"1953-11-11", t:"Egon arrests Ulrich. Greta confesses to Pastor Noah that she never wanted Helge.", who:["egon","ulrich","noah","greta"]},
  {ep:"1.9", w:"A", d:"1986-11-11", t:"A wounded man buries a gun and passports for \"Boris Niewald\" and \"Aleksander Köhler\". Hannah watches. Regina tends to him.", who:["aleksander","hannah","regina"]},
  {ep:"1.9", w:"A", d:"1986-11-11", t:"Bernd tells Claudia the summer incident leaked radiation. She hires Aleksander, who seals the cave door.", who:["bernd","claudia","aleksander"]},
  {ep:"1.9", w:"A", d:"2019-11-11", t:"Hannah blackmails Aleksander into destroying Ulrich.", who:["hannah","aleksander"]},
  {ep:"1.9", w:"A", d:"2019-11-11", t:"Jonas ends things with Martha. The Stranger opens a yellow barrel.", who:["jonas","martha","stranger"]},
  {ep:"1.9", w:"A", d:"1953", t:"An elderly woman asks young Tannhaus to build a time machine.", who:["tannhaus"]},

  // ---- S1E10 ----
  {ep:"1.10", w:"A", d:"2019-11-04", t:"That night, in the bunker, Peter sees a flash and a boy's body falls through: Mads. Tronte and an old woman named Claudia have him place it where it \"must be found\".", who:["peter","tronte","oldclaudia","mads"]},
  {ep:"1.10", w:"A", d:"2019-11-09", t:"Jonas burns Michael's letter.", who:["jonas"]},
  {ep:"1.10", w:"A", d:"2019-11-12", t:"Charlotte finds a 1953 newspaper: Ulrich's photo, as a suspected child murderer.", who:["charlotte","ulrich"]},
  {ep:"1.10", w:"A", d:"1953-11-12", t:"Egon interrogates and beats Ulrich.", who:["egon","ulrich"]},
  {ep:"1.10", w:"A", d:"1986-11-12", t:"Old Helge, from 2019, tries to stop his younger self. Their cars collide and old Helge dies.", who:["helge"]},
  {ep:"1.10", w:"A", d:"1986-11-12", t:"Helge straps Jonas into the chair. The Stranger reveals he is Jonas, from the future.", who:["jonas","helge","noah","stranger"]},
  {ep:"1.10", w:"A", d:"2019-11-12", t:"The Stranger loads Cesium-137 into his device in the caves to destroy the wormhole.", who:["stranger"], until:"2.1", later:"It only closed the passage. He's stuck."},
  {ep:"1.10", w:"A", d:"2019-11-12", t:"Noah tells Bartosz that Claudia is his enemy and recruits him.", who:["noah","bartosz","oldclaudia"]},
  {ep:"1.10", w:"A", d:"1986-11-12", t:"Ines adopts Mikkel and names him Michael Kahnwald.", who:["ines","mikkel","michael"]},
  {ep:"1.10", w:"A", d:"1986-11-12", t:"A wormhole opens. Jonas (1986) and young Helge (1953) reach for each other: Helge lands in 1986, Jonas in 2052.", who:["jonas","helge"]},
  {ep:"1.10", w:"A", d:"2052", t:"Jonas finds a ruined, radioactive Winden. A masked soldier knocks him out: \"Welcome to the future.\"", who:["jonas","soldier"]},

  // ---- S2E1 ----
  {ep:"2.1", w:"A", d:"1921-06-21", t:"In the caves, young Noah kills an older Sic Mundus man with a pickaxe.", who:["noah"]},
  {ep:"2.1", w:"A", d:"2020-06-21", t:"Six months on, a task force under Clausen comes to Winden. Regina is refusing hospital care.", who:["clausen","charlotte","regina"]},
  {ep:"2.1", w:"A", d:"2020-06-21", t:"The Stranger stops Hannah's suicide attempt and shows her he is Jonas.", who:["stranger","hannah"]},
  {ep:"2.1", w:"A", d:"2020-06", t:"Elisabeth spots Noah in an old photo; Charlotte sees it's dated January 8, 1921. He hasn't aged.", who:["charlotte","elisabeth","noah"]},
  {ep:"2.1", w:"A", d:"2020-06", t:"Adam tells Noah the apocalypse must happen.", who:["adam","noah"]},
  {ep:"2.1", w:"A", d:"2020-06-27", t:"The notebook marks June 27, 2020: \"the beginning of the last cycle\", the apocalypse.", who:[], until:"2.8", later:"It happens."},
  {ep:"2.1", w:"A", d:"2052", t:"Jonas hears Claudia's tapes about the God particle. Elisabeth Doppler leads the survivors.", who:["jonas","elisabeth","claudia"]},

  // ---- S2E2 ----
  {ep:"2.2", w:"A", d:"2053-06-21", t:"Jonas tries to stabilize the God particle; the diesel runs out.", who:["jonas"]},
  {ep:"2.2", w:"A", d:"1987-06-22", t:"An old woman reclaims Gretchen and tells young Claudia she is her future self. Stop Adam.", who:["claudia","oldclaudia"]},
  {ep:"2.2", w:"A", d:"1987-06-22", t:"Egon, dying of cancer, visits \"the Inspector\": the man who attacked Helge in 1953, now old in an asylum.", who:["egon","ulrich"]},
  {ep:"2.2", w:"A", d:"1987-06-22", t:"Hannah and the Stranger go to 1987 and watch Mikkel at dinner with Ines.", who:["hannah","stranger","mikkel","ines"]},
  {ep:"2.2", w:"A", d:"1987-06-22", t:"Regina is engaged to Aleksander.", who:["regina","aleksander"]},
  {ep:"2.2", w:"A", d:"2053-06-22", t:"Elisabeth's people catch Jonas in the forbidden zone. A girl, Silja, secretly frees him. He refuels the particle and steps in.", who:["jonas","elisabeth","silja"]},
  {ep:"2.2", w:"A", d:"1987-06-22", t:"Claudia digs up a time machine her older self buried in 1954.", who:["claudia"]},

  // ---- S2E3 ----
  {ep:"2.3", w:"A", d:"1954-06-23", t:"Helge, missing seven months, walks home and won't speak.", who:["helge","greta"]},
  {ep:"2.3", w:"A", d:"1954-06-23", t:"Agnes and Doris share an intimate moment.", who:["agnes","doris"]},
  {ep:"2.3", w:"A", d:"1987-06-23", t:"Old Ulrich tells Egon who he is. Egon reads a 1986 interview where the boy named Ulrich as his father.", who:["ulrich","egon","michael"]},
  {ep:"2.3", w:"A", d:"1987-06-23", t:"Tannhaus tells Claudia he's been waiting for her. His book existed before he wrote it.", who:["tannhaus","claudia"]},
  {ep:"2.3", w:"A", d:"1954-06-23", t:"The old woman gives Tannhaus his book.", who:["oldclaudia","tannhaus"]},
  {ep:"2.3", w:"A", d:"1954-06-23", t:"Noah shoots the old woman at the Doppler cabin. Her missing notebook pages mention Charlotte. He lies to Adam.", who:["noah","oldclaudia","agnes","adam"]},
  {ep:"2.3", w:"A", d:"2020-06-23", t:"Claudia (from 1987) sees Regina in 2020, losing her hair.", who:["claudia","regina"]},

  // ---- S2E4 ----
  {ep:"2.4", w:"A", d:"1921-06-23", t:"Jonas collapses in 1921, taken in by young Noah and his sister Agnes.", who:["jonas","noah","agnes"]},
  {ep:"2.4", w:"A", d:"2020-06-24", t:"Clausen confronts Aleksander about his old name, Köhler.", who:["clausen","aleksander"]},
  {ep:"2.4", w:"A", d:"2020-06-24", t:"Claudia (from 1987) learns Egon died on June 26, 1987.", who:["claudia","egon"]},
  {ep:"2.4", w:"A", d:"2020-06-24", t:"Katharina learns Mikkel is alive in another time. A 1987 class photo proves it.", who:["katharina","mikkel","stranger"]},
  {ep:"2.4", w:"A", d:"2020-06-24", t:"Martha, Magnus and Franziska take Bartosz's time machine.", who:["martha","magnus","franziska","bartosz"]},
  {ep:"2.4", w:"A", d:"1921-06-24", t:"Beneath the church, Adam shows Jonas his scar: \"I am you.\"", who:["adam","jonas"]},

  // ---- S2E5 ----
  {ep:"2.5", w:"A", d:"1921-06-25", t:"Adam offers Jonas a way to stop Michael's suicide.", who:["adam","jonas"], until:"2.6", later:"A lie. Jonas's visit causes the suicide."},
  {ep:"2.5", w:"A", d:"1987-06-25", t:"Old Ulrich escapes and finds Mikkel. Ines drugs him and he's caught.", who:["ulrich","mikkel","ines","egon"]},
  {ep:"2.5", w:"A", d:"1987-06-25", t:"Bernd's data shows the 1986 incident matches the Higgs mechanism.", who:["bernd","claudia"]},
  {ep:"2.5", w:"A", d:"2020-06-25", t:"The Stranger tells Charlotte Tannhaus isn't her real grandfather. Noah tells her he is her father.", who:["stranger","charlotte","noah","tannhaus"]},
  {ep:"2.5", w:"A", d:"1987-06-25", t:"Martha, Magnus, Franziska and Bartosz arrive in 1987.", who:["martha","magnus","franziska","bartosz"]},

  // ---- S2E6 ----
  {ep:"2.6", w:"A", d:"2019-06-20", t:"The day before Michael's death. Jonas, from 1921, tells Michael he knows he is Mikkel.", who:["jonas","michael"]},
  {ep:"2.6", w:"A", d:"2019-06-20", t:"Michael says that on Nov 4, 2019 an older Jonas led him through the passage.", who:["michael","jonas"]},
  {ep:"2.6", w:"A", d:"2019-06-20", t:"Claudia, now old, tells Jonas that Adam lied. She has seen a world without Jonas.", who:["claudia","jonas"]},
  {ep:"2.6", w:"A", d:"2019-06-20", t:"Young Jonas and Martha sleep together. On a swing, Ulrich and Hannah's affair begins.", who:["jonas","martha","ulrich","hannah"]},
  {ep:"2.6", w:"A", d:"2019-06-20", t:"Michael writes his letter.", who:["michael"]},
  {ep:"2.6", w:"A", d:"1921-06-25", t:"Adam holds Martha's St. Christopher medal. An older Magnus is with him.", who:["adam","magnus"]},

  // ---- S2E7 ----
  {ep:"2.7", w:"A", d:"1954-06-26", t:"Egon recognizes the dead old woman. Helge calls her \"the White Devil\".", who:["egon","oldclaudia","helge"]},
  {ep:"2.7", w:"A", d:"1954-06-26", t:"Hannah arrives posing as Katharina, visits Ulrich in the asylum, and decides to stay.", who:["hannah","ulrich","egon"]},
  {ep:"2.7", w:"A", d:"1987-06-26", t:"Egon dies after struggling with Claudia over a phone: \"You are the White Devil.\"", who:["egon","claudia"]},
  {ep:"2.7", w:"A", d:"1987-06-26", t:"Jonas, a year older, finds Claudia. \"To the future.\"", who:["jonas","claudia"]},
  {ep:"2.7", w:"A", d:"2020-06-26", t:"Clausen arrests Aleksander: the real Aleksander Köhler was his brother.", who:["clausen","aleksander"]},
  {ep:"2.7", w:"A", d:"2020-06-26", t:"Martha learns the Stranger is Jonas. Katharina: Jonas is her nephew.", who:["martha","stranger","katharina"]},

  // ---- S2E8 ----
  {ep:"2.8", w:"A", d:"1921-06-27", t:"Noah turns a gun on Adam. Adam: Charlotte is Elisabeth's daughter and her mother. Agnes shoots Noah.", who:["noah","adam","agnes","elisabeth","charlotte"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"Elisabeth finds polaroids of herself, Noah and baby Charlotte.", who:["elisabeth","noah","charlotte"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"The Stranger locks Martha in the bunker. Claudia reunites with Regina and takes her away.", who:["stranger","martha","claudia","regina"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"Katharina enters the caves with the time machine.", who:["katharina"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"Adam shoots Martha in front of young Jonas.", who:["adam","martha","jonas"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"Another Martha appears: \"The question isn't when, but what world.\" She takes Jonas.", who:["martha_alt","jonas"]},
  {ep:"2.8", w:"A", d:"2020-06-27", t:"The apocalypse. Elisabeth (2053) and Charlotte (2020) face each other through a portal.", who:["elisabeth","charlotte"]},

  // ---- S3E1 ----
  {ep:"3.1", w:"A", d:"1987-09-21", t:"Three men with the same scar, at three ages, kill Bernd Doppler for the plant's master key.", who:["unknown","bernd"]},
  {ep:"3.1", w:"B", d:"2019-11-04", t:"In the other Winden, Jonas was never born. Ulrich is married to a pregnant Hannah; Martha dates Kilian; Mikkel never vanished.", who:["jonas","martha_alt","ulrich","hannah","katharina"]},
  {ep:"3.1", w:"B", d:"2019-11-04", t:"A dead boy, Mads, falls into the bunker in this world too.", who:["mads"]},
  {ep:"3.1", w:"B", d:"2019-11-04", t:"An old woman with a scar tells Jonas this world will fall apart because of him and Martha.", who:["eva","jonas"]},
  {ep:"3.1", w:"A", d:"1888-09-21", t:"An older, scarred Martha finds the Stranger in a building marked \"Tannhaus\".", who:["martha_alt","stranger"]},

  // ---- S3E2 ----
  {ep:"3.2", w:"A", d:"1888-09-22", t:"Bartosz, Magnus and Franziska are stranded in 1888 with the Stranger. The visiting Martha says Jonas is Adam.", who:["bartosz","magnus","franziska","stranger","martha_alt"]},
  {ep:"3.2", w:"A", d:"1987-09-22", t:"Katharina finds her mother, Helene Albers, working as a nurse, and promises old Ulrich she'll free him.", who:["katharina","helene","ulrich"]},
  {ep:"3.2", w:"A", d:"1987-09-22", t:"The scarred man kills Claudia's secretary Jasmin.", who:["unknown","jasmin"]},
  {ep:"3.2", w:"A", d:"2020-09-22", t:"After the apocalypse, Claudia cares for Regina and starts the string wall. Tronte smothers Regina.", who:["claudia","regina","tronte"]},
  {ep:"3.2", w:"A", d:"2020-09-22", t:"Teen Noah approaches Elisabeth among the survivors.", who:["noah","elisabeth","peter"]},
  {ep:"3.2", w:"A", d:"2053-09-22", t:"Charlotte lives in 2053 with adult Elisabeth.", who:["charlotte","elisabeth"]},
  {ep:"3.2", w:"B", d:"2019-11-05", t:"Eva tells Jonas the ends are fixed. Her world's apocalypse comes in three days.", who:["eva","jonas"]},

  // ---- S3E3 ----
  {ep:"3.3", w:"A", d:"1888", t:"Blind factory owner Gustav Tannhaus sets off to tell the world about the time travellers. The Unknown stops his carriage and kills him.", who:["unknown","gustav"]},
  {ep:"3.3", w:"B", d:"2019-11-05", t:"Old Helge confesses to killing Mads.", who:["helge","ulrich","charlotte"]},
  {ep:"3.3", w:"B", d:"2019-11-05", t:"Jonas takes Martha through a cave door marked \"Erit Lux\" into the future, where an older Martha greets them.", who:["jonas","martha_alt"]},
  {ep:"3.3", w:"A", d:"2053-09-23", t:"The scarred Martha reports to Adam: she gave \"it\" to Jonas.", who:["martha_alt","adam"]},

  // ---- S3E4 ----
  {ep:"3.4", w:"A", d:"1954-09-24", t:"Hannah and Egon have an affair. She's pregnant.", who:["hannah","egon"]},
  {ep:"3.4", w:"A", d:"1954-09-24", t:"At a clinic, Hannah (as \"Katharina\") gives her St. Christopher medal to a girl, Helene Albers.", who:["hannah","helene"]},
  {ep:"3.4", w:"A", d:"1954-09-24", t:"The scarred man gives young Tronte his missing mother Agnes's bracelet, and grants the plant's building permit.", who:["unknown","tronte","agnes"]},
  {ep:"3.4", w:"A", d:"2053-09-24", t:"Adam tells Martha her unborn son is \"the Origin\". Agnes enters the God particle; Silja hugs her goodbye.", who:["adam","martha_alt","agnes","silja"]},
  {ep:"3.4", w:"B", d:"2052-11-06", t:"An older Martha admits she lied about saving both worlds. Noah draws a family line that loops.", who:["martha_alt","noah"]},
  {ep:"3.4", w:"B", d:"2019-11-06", t:"Jonas and the other Martha sleep together.", who:["jonas","martha_alt"]},

  // ---- S3E5 ----
  {ep:"3.5", w:"A", d:"2020-09-25", t:"Claudia meets her other-world self, who urges her to Eva's side.", who:["claudia"]},
  {ep:"3.5", w:"A", d:"2020-09-25", t:"A man kills Peter; Elisabeth kills him.", who:["peter","elisabeth"]},
  {ep:"3.5", w:"A", d:"1987-09-25", t:"Tannhaus gives teen Charlotte the watch \"For Charlotte\". She meets Peter, new in town.", who:["tannhaus","charlotte","peter"]},
  {ep:"3.5", w:"A", d:"1987-09-25", t:"Helene kills Katharina by the lake, not knowing who she is. The medal stays on the shore.", who:["helene","katharina"]},
  {ep:"3.5", w:"B", d:"2019-11-07", t:"Jonas realizes Eva lied. An older Martha shoots him; dying, he gives young Martha the medal.", who:["jonas","martha_alt","eva"]},
  {ep:"3.5", w:"A", d:"2053-09-25", t:"Adam stabilizes the God particle as Elisabeth and Charlotte walk toward it.", who:["adam","elisabeth","charlotte"]},

  // ---- S3E6 ----
  {ep:"3.6", w:"A", d:"1986-06-21", t:"The three scarred men flip switches at the plant, in both worlds, triggering the incident.", who:["unknown"]},
  {ep:"3.6", w:"A", d:"1888-09-24", t:"The Stranger burns Martha's letter: sacrifices must be made.", who:["stranger"]},
  {ep:"3.6", w:"B", d:"2019-11-08", t:"Aleksander confesses his name is Boris Niewald. The apocalypse hits; Martha leaves with an older Magnus and Franziska.", who:["aleksander","martha_alt","magnus","franziska","bartosz"]},
  {ep:"3.6", w:"A", d:"2020-09-24", t:"In this branch Jonas survived: Claudia finds him at the ruined plant.", who:["claudia","jonas"]},
  {ep:"3.6", w:"A", d:"2053-09-24", t:"Adam takes Martha's medal and pulls the lever. The God particle swallows her.", who:["adam","martha_alt"]},

  // ---- S3E7 ----
  {ep:"3.7", w:"A", d:"1890", t:"The Stranger is burned by the God particle. Silja, from 2053, meets Bartosz.", who:["stranger","silja","bartosz"]},
  {ep:"3.7", w:"A", d:"1910", t:"Silja dies giving birth to Agnes. Her son Hanno grows up to be Noah.", who:["silja","agnes","noah","bartosz"]},
  {ep:"3.7", w:"A", d:"2020", t:"Jonas tries to hang himself; Noah cuts him down. The gun won't fire.", who:["jonas","noah"]},
  {ep:"3.7", w:"A", d:"2041", t:"Elisabeth takes newborn Charlotte and leaves her with Tannhaus in the past.", who:["elisabeth","charlotte","tannhaus"]},
  {ep:"3.7", w:"A", d:"2053-09-26", t:"Adam realizes destroying Martha changed nothing. Old Claudia walks in.", who:["adam","claudia"]},

  // ---- S3E8 ----
  {ep:"3.8", w:"A", d:"2053-09-26", t:"Claudia: there is a third world, the origin. Tannhaus split it trying to undo his family's death. Adam's efforts only keep the knot alive.", who:["claudia","adam","tannhaus"]},
  {ep:"3.8", w:"O", d:"1971", t:"Jonas and the other Martha stop Marek Tannhaus's car on the night of the crash. They, and everything of the knot, fade away.", who:["jonas","martha_alt","marek","sonja","charlotte_o","tannhaus"]},
  {ep:"3.8", w:"O", d:null, t:"At a dinner at the Kahnwald house, Hannah says she's pregnant and likes the name Jonas.", who:["hannah","regina","peter","benni","torben"]}
];

const JOURNEYS = [
  {ep:"1.2", who:"mikkel",  from:"2019", to:"1986", how:"Caves"},
  {ep:"1.5", who:"stranger",from:"2019", to:"1986", how:"Caves"},
  {ep:"1.6", who:"jonas",   from:"2019", to:"1986", how:"Caves"},
  {ep:"1.7", who:"helge",   from:"1986", to:"2019", how:"Bunker passage", note:"to take boys"},
  {ep:"1.8", who:"ulrich",  from:"2019", to:"1953", how:"Caves"},
  
  {ep:"1.9", who:"noah",    from:"1953", to:"2019", how:"Unknown", note:"seen unaged in 1953, 1986, 2019"},
  {ep:"1.10",who:"helge",   from:"2019", to:"1986", how:"Caves", note:"old Helge"},
  {ep:"1.10",who:"jonas",   from:"1986", to:"2052", how:"Wormhole"},
  {ep:"1.10",who:"helge",   from:"1953", to:"1986", how:"Wormhole", note:"young Helge"},
  {ep:"2.2", who:"jonas",   from:"2053", to:"1921", how:"God particle"},
  {ep:"2.2", who:"hannah",  from:"2020", to:"1987", how:"Caves", note:"with the Stranger"},
  {ep:"2.2", who:"oldclaudia",from:"?", to:"1987 · 1954", how:"Device"},
  {ep:"2.3", who:"claudia", from:"1987", to:"2020", how:"Device"},
  {ep:"2.5", who:"martha",  from:"2020", to:"1987", how:"Caves", note:"with Magnus, Franziska, Bartosz"},
  {ep:"2.5", who:"jonas",   from:"1921", to:"2019", how:"God particle", note:"to June 20, 2019"},
  {ep:"2.7", who:"hannah",  from:"2020", to:"1954", how:"Device"},
  {ep:"2.7", who:"jonas",   from:"1987", to:"2020", how:"Device", note:"with young Claudia"},
  {ep:"2.8", who:"katharina",from:"2020", to:"?", how:"Caves"},
  {ep:"2.8", who:"jonas",   from:"2020 (A)", to:"Other world", how:"Orb", note:"taken by the other Martha"},
  {ep:"3.1", who:"martha_alt",from:"Other world", to:"1888", how:"Orb"},
  {ep:"3.2", who:"katharina",from:"2020", to:"1987", how:"Caves"},
  {ep:"3.2", who:"charlotte",from:"2020", to:"2053", how:"Portal"},
  {ep:"3.2", who:"bartosz", from:"2020", to:"1888", how:"?", note:"with Magnus and Franziska; the Stranger is there too"},
  {ep:"3.3", who:"martha_alt",from:"1888", to:"2053", how:"Orb"},
  {ep:"3.3", who:"jonas",   from:"2019 (B)", to:"2052 (B)", how:"Erit Lux door"},
  {ep:"3.4", who:"agnes",   from:"2053", to:"?", how:"God particle"},
  {ep:"3.7", who:"silja",   from:"2053", to:"1890", how:"God particle"},
  {ep:"3.7", who:"elisabeth",from:"2053", to:"2041", how:"Device", note:"takes baby Charlotte"},
  {ep:"3.8", who:"jonas",   from:"2020 (A)", to:"Origin world", how:"Orb", note:"with the other Martha"}
];

const MYSTERIES = [
  {q:"Where is Erik Obendorf?", ep:"1.1", a:[{ep:"1.7", t:"Taken by Helge Doppler to his bunker room."},{ep:"1.8", t:"Two dead boys turn up in 1953; the show implies Erik and Yasin."}]},
  {q:"What happened to Mikkel?", ep:"1.1", a:[{ep:"1.2", t:"He walked out of the caves in 1986."},{ep:"1.5", t:"He grew up as Michael Kahnwald, Jonas's father."}]},
  {q:"Who is the dead boy with burned eyes?", ep:"1.1", a:[{ep:"1.6", t:"Mads Nielsen, missing since 1986."}]},
  {q:"What did Michael's letter say?", ep:"1.1", a:[{ep:"1.5", t:"That he was Mikkel, the boy from 2019."}]},
  {q:"Why did Michael kill himself?", ep:"1.1", a:[{ep:"2.6", t:"Jonas's visit on June 20, 2019 made him face who he was."}]},
  {q:"Who is the hooded kidnapper?", ep:"1.1", a:[{ep:"1.7", t:"Helge Doppler, in 1986, working with Noah."}]},
  {q:"What does Helge mean, \"It's going to happen again\"?", ep:"1.1", a:[{ep:"1.7", t:"He remembers what he did in 1986."}]},
  {q:"Who is the Stranger?", ep:"1.2", a:[{ep:"1.8", t:"He says he came from the future."},{ep:"1.10", t:"He is Jonas, grown up."}]},
  {q:"What's behind the steel door in the caves?", ep:"1.2", a:[{ep:"1.3", t:"Yellow barrels of nuclear waste hidden after a 1986 incident."},{ep:"1.9", t:"Aleksander sealed it for Claudia."}]},
  {q:"Where was Tronte the night Mikkel vanished?", ep:"1.2", a:[{ep:"1.10", t:"In the bunker with Peter and Mads's body."}]},
  {q:"Who is Noah?", ep:"1.4", a:[{ep:"1.5", t:"Poses as a priest."},{ep:"1.9", t:"A time traveller, unchanged across 1953, 1986 and 2019."},{ep:"2.5", t:"Charlotte's father."},{ep:"3.7", t:"Hanno, son of Bartosz and Silja."}]},
  {q:"Where was Peter that night?", ep:"1.4", a:[{ep:"1.10", t:"At the bunker, where Mads's body fell through a flash of light."}]},
  {q:"Why every 33 years?", ep:"1.5", a:[{ep:"1.8", t:"Tannhaus: the lunar and solar calendars realign every 33 years."}]},
  {q:"Who gave the Stranger his device?", ep:"1.3", a:[{ep:"1.8", t:"It bears Tannhaus's initials."},{ep:"1.9", t:"An old woman brought Tannhaus the plans."}]},
  {q:"Who is the old woman giving orders?", ep:"1.10", a:[{ep:"2.2", t:"Claudia Tiedemann, from the future."},{ep:"3.8", t:"She wanted a world where Regina could live."}]},
  {q:"Who is the soldier in 2052?", ep:"1.10", a:[{ep:"2.1", t:"Elisabeth Doppler, grown up."}]},
  {q:"Who is Adam?", ep:"2.1", a:[{ep:"2.4", t:"Jonas, very old."}]},
  {q:"What happens on June 27, 2020?", ep:"2.1", a:[{ep:"2.8", t:"The apocalypse."}]},
  {q:"Who is the \"Inspector\" in the asylum?", ep:"2.2", a:[{ep:"2.3", t:"Ulrich Nielsen, still locked up since 1953."}]},
  {q:"What do the missing pages say about Charlotte?", ep:"2.3", a:[{ep:"2.5", t:"Noah is her father."},{ep:"2.8", t:"Elisabeth is her mother, and her daughter."}]},
  {q:"Who is the White Devil?", ep:"2.2", a:[{ep:"2.7", t:"Egon's last words name Claudia."}]},
  {q:"Who is the other Martha?", ep:"2.8", a:[{ep:"3.1", t:"Martha from another world, one where Jonas was never born."}]},
  {q:"Who are the men with the scar?", ep:"3.1", a:[{ep:"3.8", t:"One man at three ages: Jonas and Martha's son, the Origin."}]},
  {q:"Who is Eva?", ep:"3.1", a:[{ep:"3.2", t:"An older Martha from the other world."}]},
  {q:"Who killed Regina?", ep:"3.2", a:[{ep:"3.2", t:"Tronte."}]},
  {q:"What happened to Katharina?", ep:"2.8", a:[{ep:"3.2", t:"She reached 1987."},{ep:"3.5", t:"Killed by her own mother, Helene."}]},
  {q:"What is \"the Origin\"?", ep:"3.4", a:[{ep:"3.8", t:"Jonas and Martha's son, and the knot's source: a third world split by Tannhaus."}]},
  {q:"Why can't the Stranger remember Martha's world?", ep:"3.2", a:[{ep:"3.6", t:"In his branch, the other Martha never took him."}]},
  {q:"Who is Silja?", ep:"3.4", a:[{ep:"3.7", t:"Hannah and Egon's daughter; mother of Noah and Agnes."}]},
  {q:"How does it end?", ep:"3.8", a:[{ep:"3.8", t:"Jonas and Martha stop the origin crash. The knot never happens."}]}
];

const GLOSSARY = [
  {term:"The caves", ep:"1.1", t:"Winden's caves, near the plant. Kids go there for drugs."},
  {term:"The passage", ep:"1.3", t:"A route through the caves that links 1986 and 2019, 33 years apart."},
  {term:"The bunker", ep:"1.4", t:"A hidden room near the Doppler cabin in the forest."},
  {term:"Sic Mundus Creatus Est", ep:"1.6", t:"\"Thus the world was created\": Latin words from the Emerald Tablet, carved on the cave door."},
  {term:"Sic Mundus", ep:"2.1", t:"A secret society led by Adam, headquartered under the church in 1921."},
  {term:"Triquetra", ep:"1.8", t:"Three interlinked arcs: past, present and future, per Tannhaus."},
  {term:"The 33-year cycle", ep:"1.8", t:"Lunar and solar years realign every 33 years. The passage spans exactly that."},
  {term:"The chair", ep:"1.7", t:"Helge and Noah's device in the bunker. Noah calls it an ark."},
  {term:"The apparatus", ep:"1.10", t:"Tannhaus's portable time machine, powered by Cesium-137."},
  {term:"God particle", ep:"2.1", t:"A sphere of dark matter at the plant that can send people through time."},
  {term:"The White Devil", ep:"2.2", t:"Helge's name for someone he fears."},
  {term:"St. Christopher medal", ep:"2.5", t:"Martha's pendant, patron saint of travellers. It keeps turning up."},
  {term:"The knot", ep:"2.8", t:"Adam's word for the loop of families tied across time."},
  {term:"Erit Lux", ep:"3.3", t:"\"Let there be light\": the cave door in the other world."},
  {term:"The Origin", ep:"3.4", t:"Adam's name for Martha's unborn son, the bridge between worlds."},
  {term:"The origin world", ep:"3.8", t:"A third world, before the split, where none of this happens."}
];

const RECAPS = {
  "1.1":"Michael Kahnwald's suicide still hangs over Winden. Erik Obendorf is missing, and on a night trip to the caves young Mikkel Nielsen vanishes too. The next morning a boy's body turns up, with burned eyes and 1980s clothes. It's not Mikkel.",
  "1.2":"The police search the caves and the plant. A stranger checks into the hotel with a wall of notes about time. Jonas finds his father's cave map. Mikkel steps out of the caves and into 1986.",
  "1.3":"In 1986, Mikkel meets younger versions of his family. Claudia Tiedemann takes over the plant and learns about the hidden barrels. Through the caves, father and son almost reach each other across 33 years.",
  "1.4":"Charlotte catches Peter in a lie. A man named Noah gives Elisabeth a pocket watch. Old Helge keeps escaping, insisting he has to stop someone. A hooded man says \"Noah sent me\" to Yasin.",
  "1.5":"Yasin is gone. In 1986 a priest called Noah visits Mikkel. Ulrich ends things with Hannah. A package from the Stranger reveals what Michael's letter said.",
  "1.6":"Ulrich digs into the 1986 investigation and his parents' secrets. Jonas follows the red thread to a door marked Sic Mundus Creatus Est and comes out in 1986. Ulrich identifies the dead boy.",
  "1.7":"Jonas explores 1986, and the Stranger warns him about changing the past. Ulrich realizes the question isn't how the boys were taken, but when, and chases old Helge into the caves.",
  "1.8":"Ulrich lands in 1953 and meets his family as children, and Helge as a boy. In 1986, the Stranger tells Tannhaus where he really comes from.",
  "1.9":"In 1953 Ulrich is arrested. In 1986 a stranger with two passports arrives. In 2019 Hannah turns blackmailer, and the Stranger opens a barrel.",
  "1.10":"Peter's night is explained. The Stranger reveals himself to Jonas. A wormhole tears through 1953, 1986 and 2019. Jonas wakes in a ruined 2052.",
  "2.1":"Six months later, it's June 2020. Jonas is in a wasted 2052. Sic Mundus works from 1921 under a scarred leader named Adam. The Stranger makes himself known to Hannah. The notebook names June 27 as the end.",
  "2.2":"In 1987, an old woman tells young Claudia who she is, and Egon meets an inmate called the Inspector. Hannah sees where her husband grew up. Jonas steps into the God particle.",
  "2.3":"In 1954 Helge returns silent, and old Claudia meets Tannhaus. In 1987 Egon learns who the Inspector is. Noah finds the notebook's missing pages and lies to Adam.",
  "2.4":"Jonas wakes in 1921. Clausen closes in on Aleksander. Katharina learns where Mikkel is. Beneath the church, Adam tells Jonas who he is.",
  "2.5":"Adam offers Jonas a way to save his father. Old Ulrich escapes in 1987 and finds Mikkel. Charlotte learns who her father is. The teens reach 1987.",
  "2.6":"June 20, 2019: the day before Michael's suicide. Jonas tries to stop it. Old Claudia tells Jonas the truth about Adam.",
  "2.7":"In 1954 the old woman's body is identified. In 1987 Egon dies, and Claudia leaves with Jonas. In 2020 Clausen arrests Aleksander, and Martha learns who the Stranger is.",
  "2.8":"Apocalypse day. Noah confronts Adam about Charlotte. The Stranger hides Martha, but Adam finds her. As the end hits, another Martha appears for Jonas.",
  "3.1":"Jonas is in a Winden where he was never born, and everything is slightly different. Three scarred men kill Bernd in 1987. An older Martha finds the Stranger in 1888.",
  "3.2":"The teens are stuck in 1888. Katharina reaches 1987 and finds her mother. After the apocalypse, Claudia cares for Regina. Jonas meets Eva.",
  "3.3":"Eva calls Jonas and Martha Adam and Eva. In the other world Helge confesses. The scarred Martha leaves 1888 and reports to Adam.",
  "3.4":"In 1954, Hannah and Egon. The scarred man meets young Tronte. In 2053, Adam tells Martha her son is the Origin, and Agnes walks into the God particle.",
  "3.5":"Claudia meets her other self. Katharina's escape plan ends at the lake. In the other world, Jonas sees Eva's lie too late.",
  "3.6":"The other world's apocalypse arrives. In another branch Jonas lived. The June 1986 incident is triggered. Adam makes his move against the Origin.",
  "3.7":"The loop, shown from the inside: how the Stranger becomes Adam, where Noah and Agnes come from, how Charlotte got to Tannhaus. Adam's plan fails.",
  "3.8":"Claudia shows Adam the way out: a third, origin world. Jonas and Martha go back to stop the crash that started it all."
};

// Details to notice. src = where the observation is recorded.
const NOTES = {
  "1.1":[{k:"Detail", t:"Michael's letter says not to open it before 10:13 pm on 4 November, the same time Mikkel goes missing that night.", src:"Dark Wiki"},{k:"Detail", t:"The Waldhotel's key board has 21 room keys, and only room 8's is in use.", src:"Dark Wiki"},{k:"Detail", t:"Mikkel's magic trick comes with the line \"The question isn't how, it's when\".", src:"Dark Wiki"},{k:"Colour", t:"Yellow keeps turning up: Jonas's raincoat, Mikkel's trick props, the cassette in the boy's Walkman. Red marks others: Erik's jacket, the hotel wallpaper.", src:"Dark Wiki"},{k:"Real world", t:"Raider, the chocolate bar Jana says Mads loved, was the German name for Twix until 1991.", src:"Dark Wiki"},{k:"Real world", t:"Jonas calls déjà vu \"a glitch in the matrix\", and Bartosz compares the kidnapper to the witch in the Grimms' Hansel and Gretel.", src:"Dark Wiki"},{k:"Music", t:"The opening theme is \"Goodbye\" by Apparat with Soap & Skin. The TV in Erik's room plays Nena's \"Irgendwie, irgendwo, irgendwann\".", src:"Dark Wiki"}],
  "1.2":[{k:"Detail", t:"The Stranger turns the newspaper headline's \"Wo\" (where) into \"Wann\" (when).", src:"Dark Wiki"},{k:"Detail", t:"This is the first episode with scenes set in 1986, and the coin found with the boy is a 1986 pfennig.", src:"Dark Wiki"},{k:"Echo", t:"Teen Katharina smacks Ulrich on the back of the head, just as Magnus does to Mikkel in 2019.", src:"Dark Wiki"},{k:"Detail", t:"The Stranger covers his hotel room wall with pictures from myths.", src:"Dark Wiki"},{k:"Music", t:"\"Industry\" by Mire Kay plays over the grieving Nielsen family.", src:"Dark Wiki"}],
  "1.3":[{k:"Detail", t:"This is the first episode to use split screens. Agnes Obel's \"Familiar\" plays over them.", src:"Dark Wiki"},{k:"Echo", t:"In both 1986 and 2019 a Nielsen boy is missing, the lights flicker and animals die: sheep then, birds now.", src:"Dark Wiki"},{k:"Detail", t:"Teen Ulrich's \"NO FUTURE\" scrawl matches the graffiti in the power plant car park.", src:"Dark Wiki"},{k:"Detail", t:"Teen Ulrich wishes for \"a world without Winden\".", src:"Dark Wiki"},{k:"Real world", t:"The 1986 news about a chemical fire is real: the Sandoz warehouse fire near Basel poisoned the Rhine that November.", src:"Dark Wiki"},{k:"Real world", t:"1986 details: Hannah picks Nino D'Angelo over Falco, Mikkel solves a Rubik's Cube on Egon's desk, and Bernd quotes Isaac Newton.", src:"Dark Wiki"},{k:"Music", t:"Tears for Fears' \"Shout\" plays as Mikkel walks into the 1986 school.", src:"Dark Wiki"}],
  "1.4":[{k:"Detail", t:"The opening montage gives the first look at the Emerald Tablet.", src:"r/DarK rewatch notes"},{k:"Detail", t:"A red thread is tied to a bike.", src:"r/DarK rewatch notes"},{k:"Detail", t:"Peter anxiously cleans grains of red soil off his car mat.", src:"Dark Wiki"}],
  "1.5":[{k:"Detail", t:"The episode cuts between 2019 and 1986 without showing the year on screen. A loud tick marks each jump.", src:"Dark Wiki"},{k:"Echo", t:"Ulrich says everything is the same as it was 33 years ago, and Charlotte notices the same 33-year pattern.", src:"Dark Wiki"},{k:"Words", t:"Martha rehearses \"Ariadne\": in the myth, Ariadne's thread guides Theseus out of the Minotaur's labyrinth. The Stranger's wall shows the same labyrinth.", src:"Dark Wiki"},{k:"Real world", t:"Teen Hannah quotes \"The Breakfast Club\" (1985) to Ulrich.", src:"Dark Wiki"},{k:"Detail", t:"The Kahnwald house address is Felding 8.", src:"Dark Wiki"},{k:"Music", t:"Soap & Skin's \"Me and the Devil\" plays as teen Ulrich is arrested.", src:"Dark Wiki"}],
  "1.6":[{k:"Words", t:"The title is Latin for \"Thus the world was created\".", src:"Dark Wiki"},{k:"Detail", t:"The cave door carries the title words and a triquetra.", src:"TV Tropes"}],
  "1.8":[{k:"Real world", t:"The 1953 news Ulrich hears is real: Elizabeth II's coronation, the first ascent of Nanga Parbat and Stalin's death.", src:"Dark Wiki"},{k:"Real world", t:"The Nielsens arrive in a Lloyd 300, a car built from 1950 to 1953, and Ines jokes about the 1953 film \"Invaders from Mars\".", src:"Dark Wiki"},{k:"Words", t:"The Einstein-Rosen bridge mentioned here is the scientific name for a wormhole. Tannhaus draws the triquetra: past, present, future.", src:"Dark Wiki"},{k:"Echo", t:"Ulrich drags the beaten young Helge into the bunker, mirroring Helge dragging a body in S1E7.", src:"Dark Wiki"},{k:"Echo", t:"Young Helge collects dead birds, just as Charlotte finds them in 2019.", src:"Dark Wiki"},{k:"Detail", t:"Bernd walks with a cane in 1953 and uses a wheelchair in 1986.", src:"Dark Wiki"},{k:"Music", t:"\"Es wird ja alles wieder gut\" by Detlev Lais plays as Helge comes home in 1953.", src:"Dark Wiki"}],
  "1.9":[{k:"Real world", t:"Claudia says Tronte's haircut makes him look like James Dean, the 1950s film star.", src:"Dark Wiki"},{k:"Words", t:"Noah calls the chair his \"ark\", a nod to Noah's Ark in Genesis.", src:"Dark Wiki"},{k:"Echo", t:"Egon and Ulrich clash in 1953 just as they do in 1986.", src:"Dark Wiki"}],
  "1.10":[{k:"Words", t:"Alpha and omega are the first and last letters of the Greek alphabet; in Revelation the phrase means \"the beginning and the end\".", src:"Dark Wiki"},{k:"Echo", t:"Jonas and Helge reaching toward each other through the wormhole echoes Michelangelo's \"The Creation of Adam\".", src:"Dark Wiki"},{k:"Echo", t:"Young Helge wakes in the same forest watchtower where Jonas woke in S1E7.", src:"Dark Wiki"},{k:"Detail", t:"Ines's copy of the letter looks new; the Stranger's is worn from being carried for 33 years.", src:"Dark Wiki"}],
  "2.1":[{k:"Detail", t:"At the end, Clausen is reading a letter.", src:"r/DarK episode discussion"}],
  "2.6":[{k:"Detail", t:"Jonas finds the St. Christopher medal on the lake beach.", src:"Dark Wiki"}],
  "2.7":[{k:"Detail", t:"Adam: \"Pain is their ship, desire their compass.\"", src:"Dark Wiki"}],
  "3.1":[{k:"Detail", t:"The other world is mirrored. Viewers noticed watches, scars and even the door hinge flipped.", src:"r/DarK"}],
  "3.3":[{k:"Detail", t:"The other world's door reads \"Erit Lux\". The bunker is shot from the opposite side of the 180° line.", src:"r/DarK episode discussion"}]
};

// ---------- The three worlds (from the official Netflix guide's per-episode family trees) ----------
// A = Jonas's world (later called Adam's world), B = Martha's world (later Eva's world), C = the origin world.
// Every person belongs to one world; "twin" names their counterpart in Jonas's world.
const WORLD_OF = {martha_alt:"B", eva:"B", marek:"C", sonja:"C", charlotte_o:"C"};
const WORLD_POS = {martha_alt:[13,3], eva:[1,0]};
const WORLD_TWIN = {martha_alt:"martha"};
CHARACTERS.forEach(c => { if (c.id === "martha_alt" || c.id === "eva") c.fam = "nielsen"; c.world = WORLD_OF[c.id] || "A"; if (WORLD_POS[c.id]) c.pos = WORLD_POS[c.id]; if (WORLD_TWIN[c.id]) c.twin = WORLD_TWIN[c.id]; });
const WORLD_CHARS = [{"id": "magnus_b", "name": "Magnus Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "magnus", "code": "C43", "pos": [12, 3], "role": [{"ep": "3.1", "t": "Magnus Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Magnus Nielsen as they exist in the other world."}]}, {"id": "mikkel_b", "name": "Mikkel Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "mikkel", "code": "C44", "pos": [14, 3], "role": [{"ep": "3.1", "t": "Mikkel Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Mikkel Nielsen as they exist in the other world."}, {"ep": "3.1", "t": "Never went missing: he grew up in his own time."}]}, {"id": "ulrich_b", "name": "Ulrich Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "ulrich", "code": "C45", "pos": [12.5, 2], "role": [{"ep": "3.1", "t": "Ulrich Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Ulrich Nielsen as they exist in the other world."}, {"ep": "3.1", "t": "Police chief. Married to Hannah, who is pregnant with his child."}]}, {"id": "katharina_b", "name": "Katharina Nielsen", "fam": "albers", "world": "B", "ep": "3.1", "twin": "katharina", "code": "C46", "pos": [13.5, 2], "role": [{"ep": "3.1", "t": "Katharina Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Katharina Nielsen as they exist in the other world."}]}, {"id": "mads_b", "name": "Mads Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "mads", "code": "C47", "pos": [14.5, 2], "role": [{"ep": "3.1", "t": "Mads Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Mads Nielsen as they exist in the other world."}]}, {"id": "franziska_b", "name": "Franziska Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "franziska", "code": "C48", "pos": [5, 3], "role": [{"ep": "3.1", "t": "Franziska Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Franziska Doppler as they exist in the other world."}, {"ep": "3.1", "t": "Deaf in this world."}]}, {"id": "elisabeth_b", "name": "Elisabeth Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "elisabeth", "code": "C49", "pos": [6, 3], "role": [{"ep": "3.1", "t": "Elisabeth Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Elisabeth Doppler as they exist in the other world."}]}, {"id": "peter_b", "name": "Peter Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "peter", "code": "C50", "pos": [5, 2], "role": [{"ep": "3.1", "t": "Peter Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Peter Doppler as they exist in the other world."}, {"ep": "3.1", "t": "A priest in this world."}]}, {"id": "charlotte_b", "name": "Charlotte Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "charlotte", "code": "C51", "pos": [6, 2], "role": [{"ep": "3.1", "t": "Charlotte Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Charlotte Doppler as they exist in the other world."}]}, {"id": "helge_b", "name": "Helge Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "helge", "code": "C52", "pos": [5.5, 1], "role": [{"ep": "3.1", "t": "Helge Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Helge Doppler as they exist in the other world."}, {"ep": "3.3", "t": "Confesses to killing Mads."}]}, {"id": "bartosz_b", "name": "Bartosz Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.1", "twin": "bartosz", "code": "C53", "pos": [8.25, 3], "role": [{"ep": "3.1", "t": "Bartosz Tiedemann in the other world"}], "bio": [{"ep": "3.1", "t": "Bartosz Tiedemann as they exist in the other world."}]}, {"id": "aleksander_b", "name": "Aleksander Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.1", "twin": "aleksander", "code": "C54", "pos": [8.75, 2], "role": [{"ep": "3.1", "t": "Aleksander Tiedemann in the other world"}], "bio": [{"ep": "3.1", "t": "Aleksander Tiedemann as they exist in the other world."}, {"ep": "3.6", "t": "Confesses his real name is Boris Niewald."}]}, {"id": "regina_b", "name": "Regina Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.1", "twin": "regina", "code": "C55", "pos": [7.75, 2], "role": [{"ep": "3.1", "t": "Regina Tiedemann in the other world"}], "bio": [{"ep": "3.1", "t": "Regina Tiedemann as they exist in the other world."}]}, {"id": "claudia_b", "name": "Claudia Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.5", "twin": "claudia", "code": "C56", "pos": [8.25, 1], "role": [{"ep": "3.5", "t": "Claudia Tiedemann in the other world"}], "bio": [{"ep": "3.5", "t": "Claudia Tiedemann as they exist in the other world."}]}, {"id": "egon_b", "name": "Egon Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.6", "twin": "egon", "code": "C57", "pos": [7.75, 0], "role": [{"ep": "3.6", "t": "Egon Tiedemann in the other world"}], "bio": [{"ep": "3.6", "t": "Egon Tiedemann as they exist in the other world."}]}, {"id": "hannah_b", "name": "Hannah Nielsen", "fam": "kahnwald", "world": "B", "ep": "3.1", "twin": "hannah", "code": "C58", "pos": [11.5, 2], "role": [{"ep": "3.1", "t": "Hannah Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Hannah Nielsen as they exist in the other world."}, {"ep": "3.1", "t": "Married to Ulrich and pregnant. She has never had a son called Jonas."}]}, {"id": "kilian_b", "name": "Kilian Obendorf", "fam": "obendorf", "world": "B", "ep": "3.1", "twin": null, "code": "C59", "pos": [18, 3], "role": [{"ep": "3.1", "t": "Kilian Obendorf in the other world"}], "bio": [{"ep": "3.1", "t": "Kilian Obendorf as they exist in the other world."}, {"ep": "3.1", "t": "Erik's brother, and Martha's boyfriend in this world."}]}, {"id": "jurgen_b", "name": "Jürgen Obendorf", "fam": "obendorf", "world": "B", "ep": "3.1", "twin": "jurgen", "code": "C60", "pos": [16.5, 2], "role": [{"ep": "3.1", "t": "Jürgen Obendorf in the other world"}], "bio": [{"ep": "3.1", "t": "Jürgen Obendorf as they exist in the other world."}]}, {"id": "noah_b", "name": "Noah", "fam": "unknown", "world": "B", "ep": "3.4", "twin": "noah", "code": "C62", "pos": [1, 1], "role": [{"ep": "3.4", "t": "Noah in the other world"}], "bio": [{"ep": "3.4", "t": "Noah as they exist in the other world."}]}, {"id": "torben_b", "name": "Torben Wöller", "fam": "others", "world": "B", "ep": "3.1", "twin": "torben", "code": "C63", "pos": [19, 2], "role": [{"ep": "3.1", "t": "Torben Wöller in the other world"}], "bio": [{"ep": "3.1", "t": "Torben Wöller as they exist in the other world."}, {"ep": "3.1", "t": "Missing an arm in this world."}]}, {"id": "benjamin_b", "name": "Benjamin Wöller", "fam": "others", "world": "B", "ep": "3.1", "twin": "benni", "code": "C64", "pos": [20, 2], "role": [{"ep": "3.1", "t": "Benjamin Wöller in the other world"}], "bio": [{"ep": "3.1", "t": "Benjamin Wöller as they exist in the other world."}]}, {"id": "tannhaus_c", "name": "H.G. Tannhaus", "fam": "tannhaus", "world": "C", "ep": "3.8", "twin": "tannhaus", "code": "C65", "pos": [3, 0], "role": [{"ep": "3.8", "t": "H.G. Tannhaus in the origin world"}], "bio": [{"ep": "3.8", "t": "H.G. Tannhaus as they exist in the origin world."}]}, {"id": "katharina_c", "name": "Katharina Albers", "fam": "albers", "world": "C", "ep": "3.8", "twin": "katharina", "code": "C69", "pos": [13.5, 2], "role": [{"ep": "3.8", "t": "Katharina Albers in the origin world"}], "bio": [{"ep": "3.8", "t": "Katharina Albers as they exist in the origin world."}]}, {"id": "regina_c", "name": "Regina Doppler", "fam": "tiedemann", "world": "C", "ep": "3.8", "twin": "regina", "code": "C70", "pos": [7.75, 2], "role": [{"ep": "3.8", "t": "Regina Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Regina Doppler as they exist in the origin world."}, {"ep": "3.8", "t": "Claudia's daughter in the origin world."}]}, {"id": "peter_c", "name": "Peter Doppler", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "peter", "code": "C71", "pos": [5, 2], "role": [{"ep": "3.8", "t": "Peter Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Peter Doppler as they exist in the origin world."}, {"ep": "3.8", "t": "With Bernadette in the origin world."}]}, {"id": "bernadette_c", "name": "Bernadette Wöller", "fam": "others", "world": "C", "ep": "3.8", "twin": "benni", "code": "C72", "pos": [6, 2], "role": [{"ep": "3.8", "t": "Bernadette Wöller in the origin world"}], "bio": [{"ep": "3.8", "t": "Bernadette Wöller as they exist in the origin world."}]}, {"id": "hannah_c", "name": "Hannah Wöller", "fam": "kahnwald", "world": "C", "ep": "3.8", "twin": "hannah", "code": "C73", "pos": [11.5, 2], "role": [{"ep": "3.8", "t": "Hannah Wöller in the origin world"}], "bio": [{"ep": "3.8", "t": "Hannah Wöller as they exist in the origin world."}, {"ep": "3.8", "t": "Married to Torben. At a dinner party she says she's pregnant and likes the name Jonas."}]}, {"id": "torben_c", "name": "Torben Wöller", "fam": "others", "world": "C", "ep": "3.8", "twin": "torben", "code": "C74", "pos": [12.5, 2], "role": [{"ep": "3.8", "t": "Torben Wöller in the origin world"}], "bio": [{"ep": "3.8", "t": "Torben Wöller as they exist in the origin world."}]}, {"id": "erik_b", "name": "Erik Obendorf", "fam": "obendorf", "world": "B", "ep": "3.1", "twin": "erik", "code": "C75", "pos": [17, 3], "role": [{"ep": "3.1", "t": "Erik Obendorf in the other world"}], "bio": [{"ep": "3.1", "t": "Erik Obendorf as they exist in the other world."}]}, {"id": "tronte_b", "name": "Tronte Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "tronte", "code": "C82", "pos": [13, 1], "role": [{"ep": "3.1", "t": "Tronte Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Tronte Nielsen as they exist in the other world."}]}, {"id": "jana_b", "name": "Jana Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "jana", "code": "C83", "pos": [14, 1], "role": [{"ep": "3.1", "t": "Jana Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Jana Nielsen as they exist in the other world."}]}, {"id": "hermann_b", "name": "Hermann Albers", "fam": "albers", "world": "B", "ep": "3.1", "twin": "hermann", "code": "C84", "pos": [15.5, 1], "role": [{"ep": "3.1", "t": "Hermann Albers in the other world"}], "bio": [{"ep": "3.1", "t": "Hermann Albers as they exist in the other world."}]}, {"id": "agnes_b", "name": "Agnes Nielsen", "fam": "nielsen", "world": "B", "ep": "3.1", "twin": "agnes", "code": "C85", "pos": [13, 0], "role": [{"ep": "3.1", "t": "Agnes Nielsen in the other world"}], "bio": [{"ep": "3.1", "t": "Agnes Nielsen as they exist in the other world."}]}, {"id": "ines_b", "name": "Ines Kahnwald", "fam": "kahnwald", "world": "B", "ep": "3.1", "twin": "ines", "code": "C86", "pos": [10.5, 1], "role": [{"ep": "3.1", "t": "Ines Kahnwald in the other world"}], "bio": [{"ep": "3.1", "t": "Ines Kahnwald as they exist in the other world."}]}, {"id": "daniel_b", "name": "Daniel Kahnwald", "fam": "kahnwald", "world": "B", "ep": "3.1", "twin": "daniel", "code": "C87", "pos": [10.5, 0], "role": [{"ep": "3.1", "t": "Daniel Kahnwald in the other world"}], "bio": [{"ep": "3.1", "t": "Daniel Kahnwald as they exist in the other world."}]}, {"id": "sebastian_b", "name": "Sebastian Kruger", "fam": "kahnwald", "world": "B", "ep": "3.1", "twin": "sebastian", "code": "C88", "pos": [11.75, 1], "role": [{"ep": "3.1", "t": "Sebastian Kruger in the other world"}], "bio": [{"ep": "3.1", "t": "Sebastian Kruger as they exist in the other world."}]}, {"id": "tannhaus_b", "name": "H.G. Tannhaus", "fam": "tannhaus", "world": "B", "ep": "3.1", "twin": "tannhaus", "code": "C89", "pos": [3, 0], "role": [{"ep": "3.1", "t": "H.G. Tannhaus in the other world"}], "bio": [{"ep": "3.1", "t": "H.G. Tannhaus as they exist in the other world."}]}, {"id": "doris_b", "name": "Doris Tiedemann", "fam": "tiedemann", "world": "B", "ep": "3.1", "twin": "doris", "code": "C90", "pos": [8.75, 0], "role": [{"ep": "3.1", "t": "Doris Tiedemann in the other world"}], "bio": [{"ep": "3.1", "t": "Doris Tiedemann as they exist in the other world."}]}, {"id": "anatol_b", "name": "Anatol Veliev", "fam": "doppler", "world": "B", "ep": "3.2", "twin": "anatol", "code": "C91", "pos": [6.9, 0], "role": [{"ep": "3.2", "t": "Anatol Veliev in the other world"}], "bio": [{"ep": "3.2", "t": "Anatol Veliev as they exist in the other world."}]}, {"id": "greta_b", "name": "Greta Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "greta", "code": "C92", "pos": [6, 0], "role": [{"ep": "3.1", "t": "Greta Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Greta Doppler as they exist in the other world."}]}, {"id": "bernd_b", "name": "Bernd Doppler", "fam": "doppler", "world": "B", "ep": "3.1", "twin": "bernd", "code": "C93", "pos": [5, 0], "role": [{"ep": "3.1", "t": "Bernd Doppler in the other world"}], "bio": [{"ep": "3.1", "t": "Bernd Doppler as they exist in the other world."}]}, {"id": "helene_b", "name": "Helene Albers", "fam": "albers", "world": "B", "ep": "3.2", "twin": "helene", "code": "C94", "pos": [16.5, 1], "role": [{"ep": "3.2", "t": "Helene Albers in the other world"}], "bio": [{"ep": "3.2", "t": "Helene Albers as they exist in the other world."}]}, {"id": "leopold_b", "name": "Leopold Tannhaus", "fam": "tannhaus", "world": "B", "ep": "3.2", "twin": "leopold", "code": "C95", "pos": [3, -1], "role": [{"ep": "3.2", "t": "Leopold Tannhaus in the other world"}], "bio": [{"ep": "3.2", "t": "Leopold Tannhaus as they exist in the other world."}]}, {"id": "gustav_b", "name": "Gustav Tannhaus", "fam": "tannhaus", "world": "B", "ep": "3.2", "twin": "gustav", "code": "C96", "pos": [3, -2], "role": [{"ep": "3.2", "t": "Gustav Tannhaus in the other world"}], "bio": [{"ep": "3.2", "t": "Gustav Tannhaus as they exist in the other world."}]}, {"id": "heinrich_b", "name": "Heinrich Tannhaus", "fam": "tannhaus", "world": "B", "ep": "3.3", "twin": "heinrich", "code": "C97", "pos": [3, -3], "role": [{"ep": "3.3", "t": "Heinrich Tannhaus in the other world"}], "bio": [{"ep": "3.3", "t": "Heinrich Tannhaus as they exist in the other world."}]}, {"id": "silja_b", "name": "Silja", "fam": "unknown", "world": "B", "ep": "3.7", "twin": "silja", "code": "C98", "pos": [1, 2], "posFrom": [{"ep": "3.7", "pos": [9.25, 3]}], "role": [{"ep": "3.7", "t": "Silja in the other world"}], "bio": [{"ep": "3.7", "t": "Silja as they exist in the other world."}]}, {"id": "heinrich_c", "name": "Heinrich Tannhaus", "fam": "tannhaus", "world": "C", "ep": "3.8", "twin": "heinrich", "code": "C99", "pos": [3, -3], "role": [{"ep": "3.8", "t": "Heinrich Tannhaus in the origin world"}], "bio": [{"ep": "3.8", "t": "Heinrich Tannhaus as they exist in the origin world."}]}, {"id": "gustav_c", "name": "Gustav Tannhaus", "fam": "tannhaus", "world": "C", "ep": "3.8", "twin": "gustav", "code": "C100", "pos": [3, -2], "role": [{"ep": "3.8", "t": "Gustav Tannhaus in the origin world"}], "bio": [{"ep": "3.8", "t": "Gustav Tannhaus as they exist in the origin world."}]}, {"id": "leopold_c", "name": "Leopold Tannhaus", "fam": "tannhaus", "world": "C", "ep": "3.8", "twin": "leopold", "code": "C101", "pos": [3, -1], "role": [{"ep": "3.8", "t": "Leopold Tannhaus in the origin world"}], "bio": [{"ep": "3.8", "t": "Leopold Tannhaus as they exist in the origin world."}]}, {"id": "bernd_c", "name": "Bernd Doppler", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "bernd", "code": "C102", "pos": [7.25, 1], "role": [{"ep": "3.8", "t": "Bernd Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Bernd Doppler as they exist in the origin world."}]}, {"id": "greta_c", "name": "Greta Doppler", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "greta", "code": "C103", "pos": [6, 0], "role": [{"ep": "3.8", "t": "Greta Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Greta Doppler as they exist in the origin world."}]}, {"id": "anatol_c", "name": "Anatol Veliev", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "anatol", "code": "C104", "pos": [6.9, 0], "role": [{"ep": "3.8", "t": "Anatol Veliev in the origin world"}], "bio": [{"ep": "3.8", "t": "Anatol Veliev as they exist in the origin world."}]}, {"id": "helge_c", "name": "Helge Doppler", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "helge", "code": "C105", "pos": [5.5, 1], "role": [{"ep": "3.8", "t": "Helge Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Helge Doppler as they exist in the origin world."}]}, {"id": "ulla_s_c", "name": "Ulla Schmidt", "fam": "doppler", "world": "C", "ep": "3.8", "twin": "ulla_s", "code": "C106", "pos": [6.5, 1], "role": [{"ep": "3.8", "t": "Ulla Schmidt in the origin world"}], "bio": [{"ep": "3.8", "t": "Ulla Schmidt as they exist in the origin world."}]}, {"id": "jana_c", "name": "Jana", "fam": "nielsen", "world": "C", "ep": "3.8", "twin": "jana", "code": "C107", "pos": [14, 1], "role": [{"ep": "3.8", "t": "Jana in the origin world"}], "bio": [{"ep": "3.8", "t": "Jana as they exist in the origin world."}]}, {"id": "hermann_c", "name": "Hermann Albers", "fam": "albers", "world": "C", "ep": "3.8", "twin": "hermann", "code": "C108", "pos": [15.5, 1], "role": [{"ep": "3.8", "t": "Hermann Albers in the origin world"}], "bio": [{"ep": "3.8", "t": "Hermann Albers as they exist in the origin world."}]}, {"id": "helene_c", "name": "Helene Albers", "fam": "albers", "world": "C", "ep": "3.8", "twin": "helene", "code": "C109", "pos": [16.5, 1], "role": [{"ep": "3.8", "t": "Helene Albers in the origin world"}], "bio": [{"ep": "3.8", "t": "Helene Albers as they exist in the origin world."}]}, {"id": "daniel_c", "name": "Daniel Kahnwald", "fam": "kahnwald", "world": "C", "ep": "3.8", "twin": "daniel", "code": "C110", "pos": [10.5, 0], "role": [{"ep": "3.8", "t": "Daniel Kahnwald in the origin world"}], "bio": [{"ep": "3.8", "t": "Daniel Kahnwald as they exist in the origin world."}]}, {"id": "ines_c", "name": "Ines Kahnwald", "fam": "kahnwald", "world": "C", "ep": "3.8", "twin": "ines", "code": "C111", "pos": [10.5, 1], "role": [{"ep": "3.8", "t": "Ines Kahnwald in the origin world"}], "bio": [{"ep": "3.8", "t": "Ines Kahnwald as they exist in the origin world."}]}, {"id": "sebastian_c", "name": "Sebastian Kruger", "fam": "kahnwald", "world": "C", "ep": "3.8", "twin": "sebastian", "code": "C113", "pos": [11.75, 1], "role": [{"ep": "3.8", "t": "Sebastian Kruger in the origin world"}], "bio": [{"ep": "3.8", "t": "Sebastian Kruger as they exist in the origin world."}]}, {"id": "aleksander_c", "name": "Aleksander Köhler", "fam": "tiedemann", "world": "C", "ep": "3.8", "twin": "aleksander", "code": "C114", "pos": [8.75, 2], "role": [{"ep": "3.8", "t": "Aleksander Köhler / Boris Niewald in the origin world"}], "bio": [{"ep": "3.8", "t": "Aleksander Köhler / Boris Niewald as they exist in the origin world."}]}, {"id": "claudia_c", "name": "Claudia Doppler", "fam": "tiedemann", "world": "C", "ep": "3.8", "twin": "claudia", "code": "C115", "pos": [8.25, 1], "role": [{"ep": "3.8", "t": "Claudia Doppler in the origin world"}], "bio": [{"ep": "3.8", "t": "Claudia Doppler as they exist in the origin world."}]}, {"id": "egon_c", "name": "Egon Tiedemann", "fam": "tiedemann", "world": "C", "ep": "3.8", "twin": "egon", "code": "C116", "pos": [7.75, 0], "role": [{"ep": "3.8", "t": "Egon Tiedemann in the origin world"}], "bio": [{"ep": "3.8", "t": "Egon Tiedemann as they exist in the origin world."}]}, {"id": "doris_c", "name": "Doris Tiedemann", "fam": "tiedemann", "world": "C", "ep": "3.8", "twin": "doris", "code": "C117", "pos": [8.75, 0], "role": [{"ep": "3.8", "t": "Doris Tiedemann in the origin world"}], "bio": [{"ep": "3.8", "t": "Doris Tiedemann as they exist in the origin world."}]}, {"id": "ulla_s_b", "name": "Ulla Schmidt", "fam": "doppler", "world": "B", "ep": "3.2", "twin": "ulla_s", "code": "C118", "pos": [6.5, 1], "role": [{"ep": "3.2", "t": "Ulla Schmidt in the other world"}], "bio": [{"ep": "3.2", "t": "Ulla Schmidt as they exist in the other world."}]}];
const WORLD_LINKS = [{"a": "bernd_b", "b": "greta_b", "type": "married", "ep": "3.1"}, {"a": "greta_b", "b": "helge_b", "type": "parent", "ep": "3.1"}, {"a": "peter_b", "b": "franziska_b", "type": "parent", "ep": "3.1"}, {"a": "peter_b", "b": "elisabeth_b", "type": "parent", "ep": "3.1"}, {"a": "charlotte_b", "b": "elisabeth_b", "type": "parent", "ep": "3.1"}, {"a": "charlotte_b", "b": "franziska_b", "type": "parent", "ep": "3.1"}, {"a": "regina_b", "b": "bartosz_b", "type": "parent", "ep": "3.1"}, {"a": "aleksander_b", "b": "bartosz_b", "type": "parent", "ep": "3.1"}, {"a": "regina_b", "b": "aleksander_b", "type": "married", "ep": "3.1"}, {"a": "helge_b", "b": "peter_b", "type": "parent", "ep": "3.1"}, {"a": "daniel_b", "b": "ines_b", "type": "parent", "ep": "3.1"}, {"a": "ulrich_b", "b": "hannah_b", "type": "married", "ep": "3.1"}, {"a": "ulrich_b", "b": "martha_alt", "type": "parent", "ep": "3.1"}, {"a": "ulrich_b", "b": "magnus_b", "type": "parent", "ep": "3.1"}, {"a": "ulrich_b", "b": "mikkel_b", "type": "parent", "ep": "3.1"}, {"a": "katharina_b", "b": "martha_alt", "type": "parent", "ep": "3.1"}, {"a": "katharina_b", "b": "magnus_b", "type": "parent", "ep": "3.1"}, {"a": "katharina_b", "b": "mikkel_b", "type": "parent", "ep": "3.1"}, {"a": "ulrich_b", "b": "katharina_b", "type": "married", "ep": "3.1"}, {"a": "tronte_b", "b": "mads_b", "type": "parent", "ep": "3.1"}, {"a": "tronte_b", "b": "ulrich_b", "type": "parent", "ep": "3.1"}, {"a": "jana_b", "b": "ulrich_b", "type": "parent", "ep": "3.1"}, {"a": "jana_b", "b": "mads_b", "type": "parent", "ep": "3.1"}, {"a": "tronte_b", "b": "jana_b", "type": "married", "ep": "3.1"}, {"a": "agnes_b", "b": "tronte_b", "type": "parent", "ep": "3.1"}, {"a": "hermann_b", "b": "katharina_b", "type": "parent", "ep": "3.1"}, {"a": "sebastian_b", "b": "hannah_b", "type": "parent", "ep": "3.1"}, {"a": "leopold_b", "b": "tannhaus_b", "type": "parent", "ep": "3.2"}, {"a": "gustav_b", "b": "leopold_b", "type": "parent", "ep": "3.2"}, {"a": "anatol_b", "b": "helge_b", "type": "parent", "ep": "3.2"}, {"a": "tronte_b", "b": "regina_b", "type": "parent", "ep": "3.2", "until": "3.8", "later": "Claudia tells Tronte he isn't Regina's father"}, {"a": "ulla_s_b", "b": "peter_b", "type": "parent", "ep": "3.2"}, {"a": "helge_b", "b": "ulla_s_b", "type": "partner", "ep": "3.2"}, {"a": "helene_b", "b": "katharina_b", "type": "parent", "ep": "3.2"}, {"a": "hermann_b", "b": "helene_b", "type": "married", "ep": "3.2"}, {"a": "heinrich_b", "b": "gustav_b", "type": "parent", "ep": "3.3"}, {"a": "noah_b", "b": "elisabeth_b", "type": "partner", "ep": "3.4"}, {"a": "claudia_b", "b": "regina_b", "type": "parent", "ep": "3.5"}, {"a": "doris_b", "b": "claudia_b", "type": "parent", "ep": "3.5"}, {"a": "egon_b", "b": "claudia_b", "type": "parent", "ep": "3.6"}, {"a": "egon_b", "b": "doris_b", "type": "married", "ep": "3.6"}, {"a": "bartosz_b", "b": "silja_b", "type": "partner", "ep": "3.7"}, {"a": "bartosz_b", "b": "agnes_b", "type": "parent", "ep": "3.7"}, {"a": "silja_b", "b": "agnes_b", "type": "parent", "ep": "3.7"}, {"a": "egon_b", "b": "silja_b", "type": "parent", "ep": "3.7"}, {"a": "hannah_b", "b": "silja_b", "type": "parent", "ep": "3.7"}, {"a": "egon_c", "b": "claudia_c", "type": "parent", "ep": "3.8"}, {"a": "doris_c", "b": "claudia_c", "type": "parent", "ep": "3.8"}, {"a": "egon_c", "b": "doris_c", "type": "married", "ep": "3.8"}, {"a": "claudia_c", "b": "regina_c", "type": "parent", "ep": "3.8"}, {"a": "bernd_c", "b": "regina_c", "type": "parent", "ep": "3.8"}, {"a": "sebastian_c", "b": "hannah_c", "type": "parent", "ep": "3.8"}, {"a": "hannah_c", "b": "torben_c", "type": "married", "ep": "3.8"}, {"a": "daniel_c", "b": "ines_c", "type": "parent", "ep": "3.8"}, {"a": "heinrich_c", "b": "gustav_c", "type": "parent", "ep": "3.8"}, {"a": "gustav_c", "b": "leopold_c", "type": "parent", "ep": "3.8"}, {"a": "greta_c", "b": "helge_c", "type": "parent", "ep": "3.8"}, {"a": "anatol_c", "b": "helge_c", "type": "parent", "ep": "3.8"}, {"a": "helge_c", "b": "ulla_s_c", "type": "partner", "ep": "3.8"}, {"a": "helge_c", "b": "peter_c", "type": "parent", "ep": "3.8"}, {"a": "ulla_s_c", "b": "peter_c", "type": "parent", "ep": "3.8"}, {"a": "leopold_c", "b": "tannhaus_c", "type": "parent", "ep": "3.8"}, {"a": "tannhaus_c", "b": "marek", "type": "parent", "ep": "3.8"}, {"a": "hermann_c", "b": "katharina_c", "type": "parent", "ep": "3.8"}, {"a": "hermann_c", "b": "helene_c", "type": "married", "ep": "3.8"}, {"a": "helene_c", "b": "katharina_c", "type": "parent", "ep": "3.8"}, {"a": "marek", "b": "sonja", "type": "married", "ep": "3.8"}, {"a": "marek", "b": "charlotte_o", "type": "parent", "ep": "3.8"}, {"a": "sonja", "b": "charlotte_o", "type": "parent", "ep": "3.8"}, {"a": "peter_c", "b": "bernadette_c", "type": "partner", "ep": "3.8"}, {"a": "tannhaus_b", "b": "charlotte_b", "type": "adoptive", "label": "raised her", "ep": "3.1"}, {"a": "elisabeth_b", "b": "charlotte_b", "type": "parent", "ep": "3.1"}, {"a": "noah_b", "b": "charlotte_b", "type": "parent", "ep": "3.4"}, {"a": "bernd_c", "b": "claudia_c", "type": "partner", "ep": "3.8"}, {"a": "torben_c", "b": "bernadette_c", "type": "sibling", "ep": "3.8"}, {"a": "martha_alt", "b": "kilian_b", "type": "partner", "ep": "3.1"}, {"a": "erik_b", "b": "kilian_b", "type": "sibling", "ep": "3.1"}, {"a": "jurgen_b", "b": "kilian_b", "type": "parent", "ep": "3.1"}, {"a": "jurgen_b", "b": "erik_b", "type": "parent", "ep": "3.1"}];
CHARACTERS.push(...WORLD_CHARS);
LINKS.push(...WORLD_LINKS);

module.exports = {EPISODES, FAMILIES, CHARACTERS, LINKS, EVENTS, JOURNEYS, MYSTERIES, GLOSSARY, RECAPS, NOTES};

// Story narration, one chapter per episode, in airing order. Each paragraph is only what that episode shows.
const STORY = {
"1.1":[
 "On June 21, 2019, Michael Kahnwald hangs himself in his attic. He leaves behind a sealed letter: not to be opened before November 4, 10:13 p.m.",
 "Months later, his son Jonas goes back to school and finds that Martha Nielsen, the girl he likes, is now with his best friend Bartosz. Winden is on edge: teenager Erik Obendorf has been missing for two weeks. Officer Ulrich Nielsen, whose little brother Mads vanished in 1986, insists the cases aren't linked, but his mother Jana is sure it's happening again. Ulrich is secretly sleeping with Jonas's mother, Hannah. In a care home, old Helge Doppler keeps warning that it will happen again.",
 "That night the teens head to the caves to find Erik's drug stash, dragging along Martha's little brother Mikkel. Something roars inside the cave, their torches flicker, everyone runs, and Mikkel is gone. At 10:13 p.m. Ines Kahnwald finally opens Michael's letter, and weeps.",
 "The next morning a boy's body turns up in the forest. It isn't Mikkel. His eyes are burned, his ears ruptured, and he's dressed in 1980s clothes with a Walkman. Somewhere else, a hooded figure straps Erik into a strange chair."
],
"1.2":[
 "The dead boy's eyes were burned and his ears destroyed by pressure, and nobody knows who he is. Searching the caves, Ulrich finds a steel door with a radiation sign, but plant director Aleksander Tiedemann blocks a warrant. That night Aleksander tells Jürgen Obendorf to \"get rid of them\".",
 "A stranger with a scar and a briefcase checks into Regina Tiedemann's hotel and covers the walls of room 8 with notes about time and black holes. In his father's attic Jonas finds a cave map marked \"Where is the crossing?\" Ulrich's father Tronte can't say where he was the night Mikkel disappeared. Lights flicker all over Winden and dead birds pile up. The stranger crosses out \"where\" in a newspaper headline and writes \"when\".",
 "Mikkel climbs out of the cave and runs home. A teenage boy he doesn't know answers the door and turns him away. Then Mikkel sees a newspaper: it is November 5, 1986."
],
"1.3":[
 "The episode runs in two years at once. In 1986 Mikkel wanders into his grandparents' home, where a younger Jana is grieving her own missing son, Mads. At school he spots the teenage girls who will be his mother Katharina and Hannah, and they laugh him off. Inspector Egon Tiedemann sees the scratches on him and blames teen tearaway Ulrich. Nurse Ines Kahnwald takes the boy in, and he tells her he's from the future.",
 "Egon's daughter Claudia is about to run the power plant. The retiring director, Bernd Doppler, shows her yellow barrels hidden in the caves after a summer incident. Tronte, a journalist, is her lover. Dead birds fall and 33 sheep die on a farm.",
 "In 2019 Ulrich hacks at the cave's steel door while Mikkel, in 1986, tries to get back through the caves. Father and son hear each other's voices, but neither can reach the other. In 1986 an old clockmaker, H.G. Tannhaus, finishes a brass device identical to the stranger's."
],
"1.4":[
 "Charlotte pulls a wildlife-camera card from the forest. It shows her husband Peter's car near the caves on the night Mikkel vanished, and Peter lied about where he was. Old Helge keeps escaping his care home, muttering that he has to stop \"him\". Jonas slips past the police barrier into the caves while the stranger watches.",
 "Magnus discovers Franziska's hidden cash and accuses her of dealing; they end up sleeping together. Her deaf little sister Elisabeth walks home alone in the rain and comes back late with a gold pocket watch from a man who called himself Noah. Charlotte reads the engraving: \"For Charlotte.\"",
 "The next morning a hooded man stops Yasin on his way to school. \"Noah sent me.\""
],
"1.5":[
 "Yasin is now missing too. Elisabeth describes Noah: tall, a hat, blue eyes. Charlotte confronts Peter with the camera photo and he calls her insane.",
 "In 1986 Ines brings Mikkel presents and a priest named Noah comes to debate God and the Big Bang with him. Ines admits she once had a son who died at birth. Teenage Hannah, in love with Ulrich, watches him with Katharina and is crushed. She tells the police Ulrich raped Katharina, and Egon arrests him.",
 "In 2019 Ulrich ends his affair with Hannah. Bartosz gets into Noah's car. Jonas admits to Martha that he wasn't in France this summer but in a clinic, and they kiss. The stranger tells Jonas at his father's grave that life is a labyrinth, then has Regina pass him a package. Inside are a lamp, a Geiger counter and his father's letter. It says Michael was Mikkel: the boy who fell from 2019 into 1986 and grew up to be Jonas's father. In 1986 the stranger knocks on Tannhaus's door."
],
"1.6":[
 "Ulrich digs out the 1986 file on Mads and catches his parents in a lie: on the night Mads vanished, Tronte was with Claudia Tiedemann. The last person to see Mads alive was Regina, which may be why her father Egon never pushed the case. Regina gets a bad mammogram result. Katharina, falling apart, slaps Martha, calls Winden sick on a radio show, and attacks Regina, who tells the children to ask their mother what she did in 1986.",
 "In a flashback, teen Ulrich and Katharina tie Regina to a tree by the caves and leave her, and she screams at something in the dark. Martha plays Ariadne in the school play. Hannah tells Jonas how she met Michael.",
 "Jonas follows a red thread deep into the caves to a door engraved \"Sic Mundus Creatus Est\". He goes through and comes out in 1986, where teenage Hannah and her father give him a lift. In 2019 Ulrich sees the dead boy's chin scar and knows him: it's his brother, Mads."
],
"1.7":[
 "In 1986 Jonas meets teenage Regina, then finds Mikkel in hospital. The stranger stops him: Mikkel is his father, and taking him home would erase Jonas. Jonas hugs a puzzled teenage Hannah.",
 "In 2019 a medical examiner tells Ulrich a body can't be frozen for 33 years. Charlotte raids the plant and finds the caves run under the Doppler family's cabin. Ulrich confronts old Helge and is suspended.",
 "Then the picture snaps into place. The hooded kidnapper is Helge himself, the middle-aged Helge of 1986, working with Noah and taking boys through the bunker. He drags Mads's body into the forest. Ulrich realizes the question isn't how the boys were taken but when, and he chases old Helge into the caves. In the bunker, Noah chalks two dates: 5.11.1953 and 9.11.1953."
],
"1.8":[
 "1953: two boys' bodies are found at the construction site of the future power plant, with burned eyes, coins dated 1986 on red cords and clothes made in China. Young officer Egon Tiedemann works under police chief Daniel Kahnwald. Young Helge Doppler lives with his strict mother Greta and his father Bernd, who is promoting the new plant.",
 "Ulrich arrives in 1953. He rescues Helge from bullies, meets Agnes Nielsen and her boy Tronte (his father and grandmother, just moved to town) and recognizes a young Jana. Egon's dog Gretchen runs off into the caves. Then Ulrich finds Helge with a box of dead birds, tells him he will become a killer, and beats him with a rock. He leaves the boy in the bunker.",
 "In 1986 the stranger keeps visiting Tannhaus to talk about wormholes, the triquetra and the 33-year cycle. Finally he admits he came through Winden's wormhole from the future and wants to destroy it. He shows Tannhaus a broken device bearing Tannhaus's own initials. Tannhaus throws him out, then starts building. In 1953 a young Tannhaus finds Ulrich's forgotten jacket with a smartphone in it."
],
"1.9":[
 "In 1953 Helge is missing. Egon arrests Ulrich at the caves, and Greta confesses to Pastor Noah that she never wanted her son. Young Claudia flirts with Tronte while Agnes befriends Egon's wife Doris.",
 "In 1986 Katharina attacks Regina. A wounded stranger stops it, and Regina takes him home. He buries a bag with a gun and passports for \"Boris Niewald\" and \"Aleksander Köhler\", and Hannah sees him. Claudia hires the newcomer to seal the cave door. Bernd admits the summer incident leaked radiation.",
 "In 2019 Hannah digs up that bag and blackmails Aleksander into destroying Ulrich. Jonas breaks things off with Martha. Bartosz accepts Noah's offer. Regina finds the stranger's room, papered with notes on time travel. The stranger cracks open a yellow barrel. In 1953 an elderly woman asks young Tannhaus to build a time machine."
],
"1.10":[
 "Peter's night is finally explained. He was in the bunker when a flash lit the wall and a boy's body fell through: Mads, with his 1986 school ID. Tronte came, and an old woman named Claudia told them to put the body where it must be found.",
 "Jonas burns his father's letter and confronts Ines, who knew about the boy from the future all along. Bartosz, furious about the kiss, tells Jonas never to come back. In 1953 Egon interrogates Ulrich, and in 2019 Charlotte finds a 1953 newspaper with Ulrich's face on it. Old Helge travels back to stop his younger self; their cars collide in 1986 and old Helge dies. Noah tells Bartosz that Claudia is their enemy in a war between light and shadow.",
 "In 1986 Jonas goes to bring Mikkel home, but Noah is waiting, and Helge straps Jonas into the chair. The stranger, meanwhile, loads Cesium-137 into his device in the caves, meaning to destroy the wormhole, and reveals that he is Jonas, older. Ines adopts Mikkel and names him Michael Kahnwald.",
 "A huge wormhole tears open over the forest. Young Helge in 1953 and Jonas in 1986 reach for each other and swap places. Jonas wakes in a bunker full of weapons and string, steps out into a ruined, radioactive Winden, and a masked soldier knocks him out: \"Welcome to the future.\""
],
"2.1":[
 "1921: in the caves, a young Noah works with an older man who has lost faith in their leader, Adam. Noah kills him with a pickaxe.",
 "June 2020, six months after the disappearances. Federal investigator Clausen arrives in Winden. Regina has cancer and refuses hospital. Bartosz and Martha drift apart. On the anniversary of Michael's death Hannah is about to shoot herself when the stranger walks in, shows her a scar and tells her who he is: her son, grown up, here to end everything.",
 "In 2052 Jonas explores the wasteland, hears Claudia's tapes about a \"God particle\" in the bunker, and finds the survivors ruled by a deaf commander, Elisabeth Doppler, who hangs trespassers. In 2020 Elisabeth spots Noah in an old photo, and Charlotte sees it's dated 1921.",
 "A scarred man called Adam tells Noah the apocalypse must come, like burning a forest so new trees can grow. The notebook names the day: June 27, 2020. Following his Geiger counter into the dead plant, Jonas finds a floating black sphere."
],
"2.2":[
 "In 2053 Jonas keeps the black sphere stable with a generator until the diesel runs out. In 1987 Mikkel lives as Ines's son, is shoved around by teenage Katharina, and is warned off the caves by Noah. Egon, now with cancer, visits Helge, who rambles about \"the man with the stone\" and a \"White Devil\".",
 "An old woman reclaims Claudia's dog at the plant and tells young Claudia she is her older self. She shows her a time machine and warns her about Adam. Egon learns that the man who attacked Helge in 1953 is still locked in an asylum, an old inmate called \"the Inspector\" who taunts him.",
 "In 2020 the stranger shows Hannah his machine and takes her to 1987, where she watches a boy eat dinner with Ines and understands what her husband was. In 2053 Jonas is caught stealing diesel and held prisoner, until a girl named Silja secretly frees him. He refuels the sphere and steps inside. In 1987 Claudia digs up a time machine her older self buried in her garden in 1954."
],
"2.3":[
 "In 1987 Noah sends young Helge back through the chair. In 1954 Helge walks home after seven months missing and won't speak. Agnes and Doris share an intimate moment; young Claudia confides in Tronte.",
 "In 1987 Claudia visits Helge, who warns her never to trust Noah, then meets Tannhaus, who says he's been waiting for her: his book existed before he wrote it. Egon confronts the Inspector, who calmly says he is Ulrich Nielsen. Egon reads an old interview in which the boy found in 1986 named Ulrich Nielsen as his father.",
 "In 1954 the old woman gives Agnes a newspaper clipping and Tannhaus his book, and tells Egon she's sorry. Agnes hands the clipping to Noah, who finds the old woman at the Doppler cabin and shoots her. On her are the notebook's missing pages. He reads them, says \"Charlotte\", and is shaken. In 1987 Claudia uses the machine to visit 2020 and sees Regina losing her hair. In 1921 Noah tells Adam he found nothing."
],
"2.4":[
 "Jonas lands in 1921, wounded, and is taken in by a young Noah and his sister Agnes. He finds the Sic Mundus door in the caves, sealed.",
 "In 2020 Clausen questions Aleksander about the name Köhler. Claudia, visiting from 1987, learns her father Egon died on June 26, 1987. The stranger confirms to Charlotte that the man in the 1921 photo is Noah. Peter admits he and Tronte have been following Claudia's plan. Katharina refuses to believe Mikkel is alive in the past until she finds him in a 1987 class photo. The teens catch Bartosz carrying a time machine into the caves and take it.",
 "Noah leads Jonas beneath the church to meet Adam, a man covered in scars. Adam opens his collar to show the same scar Jonas has: \"I am you.\""
],
"2.5":[
 "Adam explains that Sic Mundus is at war with time itself. He offers Jonas the sphere: go back to June 20, 2019 and stop Michael's suicide.",
 "In 1987 old Ulrich escapes the asylum and finds Mikkel, who calls him Papa. Ines drugs Ulrich and he's caught again. Claudia learns from Bernd that the 1986 incident matches the Higgs mechanism.",
 "In 2020 the stranger slips Martha's lost medal onto her bed and confronts Hannah about Ulrich. Katharina rounds on Hannah too. The stranger tells Charlotte that Tannhaus wasn't her real grandfather. Then Noah finds her and says he is her father, and that he must stop Adam to save everyone. The teens use the machine and arrive in 1987. In 1921 Jonas, in a gas mask, steps into the sphere."
],
"2.6":[
 "June 20, 2019, the day before Michael's death. A younger, unscarred Jonas has breakfast with both his parents. The Nielsens hold an anniversary party. At the lake the teens swim, Jonas finds a St. Christopher medal in the sand, and the Jonas who came from 1921 kisses Martha, tells her they're a perfect match, and leaves.",
 "The Jonas from 1921 tells Michael he knows he is Mikkel, and begs him not to do it. Michael says that on November 4, 2019, an older Jonas led him through the caves and told him to wait. Then old Claudia appears: Adam lied, she says; she has seen a world without Jonas, and he has to fight Adam.",
 "Young Jonas returns the medal to Martha and they sleep together. On a swing in the rain, Ulrich and Hannah kiss for the first time. Michael sits down and writes his letter. In 1921 Adam holds the medal, with an older Magnus at his side."
],
"2.7":[
 "In 1954 Egon examines a dead old woman and recognizes her. Helge calls her the White Devil and says she \"hasn't even started yet\". Hannah turns up claiming to be Katharina Nielsen, visits Ulrich in the asylum, and decides to stay in 1954.",
 "In 1987 Egon works out that time travel is real and reaches for the phone. Claudia stops him; they struggle, he hits his head, and with his last breath he calls her the White Devil. Jonas, a year older, arrives with a key from her older self, and they leave \"for the future\".",
 "In 2020 Clausen arrests Aleksander: the real Aleksander Köhler was Clausen's brother. Martha finds her medal, breaks up with Bartosz, and meets the adult Jonas, who calls her déjà vu \"a glitch in the matrix\". She knows him. Katharina bursts in: Jonas is her nephew. Katharina takes the time machine."
],
"2.8":[
 "June 27, 2020, the day of the apocalypse. Clausen searches the plant. Elisabeth finds polaroids of herself, Noah and a baby named Charlotte. In 1921 Noah throws the missing pages at Adam and pulls a gun, but it jams. Adam tells him Charlotte is Elisabeth's daughter and her mother too. Agnes shoots Noah.",
 "The stranger locks Martha in the bunker, saying her death is his fault. In the caves, young Jonas and Claudia set off the device to reopen the passage. Claudia finds Regina, apologizes, and takes her away. Katharina finds a photo album of Michael and Ines and follows the light into the caves. Martha slips out of the bunker.",
 "Young Jonas comes home and finds Martha. Adam steps in and shoots her. As Jonas holds her, another Martha appears with a strange device: \"The question isn't when, but what world.\" The shock wave hits Winden. In the forest, Elisabeth in 2053 and Charlotte in 2020 stare at each other through a portal."
],
"3.1":[
 "1987: three men with the same scar, at three ages, strangle Bernd Doppler for the plant's master key. On apocalypse day the other Martha takes Jonas away.",
 "Jonas wakes in a Winden almost like his own. It is November 4, 2019 and nothing is quite right. Martha is dating Kilian, Erik's brother. Ulrich is married to Hannah, who is pregnant. Franziska is deaf, Peter is a priest, and there's no Michael Kahnwald in the graveyard. When Jonas calls Hannah \"Mom\", she has no idea who he is.",
 "The same night plays out again: the cave, the flickering lights, and Mads's body falling into the bunker. An old woman with a scar under her eye tells Jonas that Mikkel never went back, so Jonas was never born, and that this world will still fall apart because of him and Martha. In 1888 an older, scarred Martha walks into a workshop marked \"Tannhaus\" and finds the stranger."
],
"3.2":[
 "In 1888 the stranger is stranded with Bartosz, Magnus and Franziska. He refuses to trust this Martha. She tells the others that Jonas is Adam.",
 "In 1987 Katharina, searching for Mikkel, discovers the asylum nurse is her own mother, Helene Albers, and promises old Ulrich she'll get him out. A scarred man murders Claudia's secretary.",
 "In 2020 after the apocalypse, Claudia cares for a dying Regina, records tapes and starts the string wall. Peter and Elisabeth search the ruins, and a teenage Noah approaches Elisabeth. Tronte smothers Regina. In 2053 Charlotte is living with grown-up Elisabeth. In the other world, Jonas meets the old woman again. Her name is Eva, an older Martha, and she tells him the ends are fixed: her world's apocalypse comes in three days."
],
"3.3":[
 "In 1888 the Unknown stops blind Gustav Tannhaus's carriage and kills him before he can tell the world about the time travellers. Bartosz fights the stranger. Martha insists the stranger once came to her world, which he doesn't remember, then slips away using a second orb.",
 "In the other world Ulrich identifies the body as Mads and walks off the case. Old Helge confesses to the murder. Eva tells Jonas that he and Martha are \"Adam and Eva\". Out of his hearing, she says Martha must die so others can live. Jonas takes young Martha through a cave door marked \"Erit Lux\" and out into a future desert, where a middle-aged Martha greets them.",
 "In 2053 the scarred Martha walks into Adam's chamber. Did she give it to Jonas? She nods."
],
"3.4":[
 "In 1954 a scarred man gives young Tronte a bracelet that belonged to his missing mother, Agnes. Hannah, living as \"Katharina\", has an affair with Egon and gets pregnant. At a clinic she gives her St. Christopher medal to a girl named Helene Albers. Doris asks Egon for a divorce. The scarred man signs off the permit for the nuclear plant.",
 "In 2053 Magnus confronts Martha about abandoning them in 1888. Adam tells her that her unborn son is \"the Origin\", the bridge between the two worlds. Agnes walks into the God particle; a young woman, Silja, hugs her goodbye.",
 "In the other world's 2052, the older Martha shows young Martha names crossed off a wall and admits she lied about saving both worlds. Noah draws a family line that loops back on itself. In 2019, Jonas and young Martha sleep together."
],
"3.5":[
 "In 2020 Claudia buries Regina, then meets her other-world self, who urges her to Eva's side. A man kills Peter, and Elisabeth kills him with a fire extinguisher. In 2053, Adam tells Charlotte to wait one more day. Elisabeth and Charlotte suit up and walk toward the God particle.",
 "In 1987 Tannhaus gives teenage Charlotte the watch engraved \"For Charlotte\". His son's family died in a car crash, and his granddaughter's body was never found. Charlotte meets Peter, new in town. Katharina plans to free old Ulrich, but Helene, not knowing who she is, kills her by the lake. The medal stays on the shore.",
 "In the other world, Martha cuts herself on a fence just where the older Martha had a scratch, and Jonas sees that events repeat: Eva lied. He confronts Eva. The older Martha shoots him. Dying, he presses the medal into young Martha's hand."
],
"3.6":[
 "In 1888 the stranger burns a letter from Martha: sacrifices must be made. In the other world it's November 8, 2019. Aleksander confesses his name is Boris Niewald, the barrels are opened, and the apocalypse arrives. Martha leaves with an older Magnus and Franziska, and Bartosz is left behind.",
 "In 2020 Claudia finds teenage Jonas alive at the ruined plant. In this branch, no other Martha ever took him. He wants to save Martha and Mikkel.",
 "On June 21, 1986, the three scarred men throw switches at both plants and cause the incident. In 2053 Adam explains that it will take both apocalypses to destroy the Origin. He takes Martha's medal and pulls the lever, and the God particle swallows her."
],
"3.7":[
 "A young Tannhaus wonders aloud whether two realities could exist at once. Then the knot is shown from the inside. In 1890 the stranger is burned by the God particle, and the scars begin. Silja arrives from 2053 and meets Bartosz. They have a son, Hanno, who grows up to be Noah. Years later Silja dies giving birth to a daughter, Agnes.",
 "In 2020 a despairing young Jonas tries to hang himself. Noah cuts him down and hands him a gun. It won't fire. Time won't let him die, Noah says, and he takes Jonas to the sealed portal. Elisabeth is pregnant. In 2041 she takes newborn Charlotte back in time and leaves her with Tannhaus.",
 "Events loop through once more, each piece falling into place. In 2053, Adam realizes that destroying Martha and the child changed nothing. Then old Claudia walks in."
],
"3.8":[
 "Claudia tells Adam the truth. There is a third world, the origin. In it Tannhaus, broken by the deaths of his son, daughter-in-law and granddaughter in a car crash, built a machine to undo them and split his world in two. Everything Adam did to destroy the knot only kept it alive. Her own aim was simpler: a world where Regina could live.",
 "During each apocalypse there is a loophole, a moment when cause and effect break. Adam gives young Jonas an orb as Martha dies, with new words: not when, but what world. Jonas reaches the other Martha moments before her world ends.",
 "Together they cross into the origin world on the night of the crash and stop the car. Everything that came from the knot fades away: Jonas and Martha, Adam and Eva, Claudia, the stranger. At a dinner party in the Kahnwald house in the origin world, Hannah says she's pregnant and likes the name Jonas."
]
};
module.exports.STORY = STORY;

// Who is seen in which year (and when each birth year is shown), from the official
// episode-gated timelines on dark.netflix.io. Used by the "What year?" tab.
const _seen = require("./sightings.json");
module.exports.SIGHTINGS = _seen.SIGHTINGS;   // [id, year, world A/B/O, episode that shows it]
module.exports.BIRTHS = _seen.BIRTHS;         // id -> [birth year, episode that shows it]

// ---------- Meanwhile in the real world (shown in the "What year?" tab for years the show has visited) ----------
// Historical facts only, written in our own words. "here" notes link a year to things the show has already
// shown on screen (the power plant, the divided Germany of the 20th century), never to plot developments.
module.exports.REALWORLD = {
  // Only real events that tie into Dark's themes: nuclear power and its fears, the physics of time,
  // and how the two world wars shaped the Germany the characters live in.
  "1921": { de: [
      "The First World War had ended less than three years earlier. About two million German soldiers had died, and many who came home were wounded or traumatised.",
      "The Treaty of Versailles blamed Germany for the war, took away land and set a reparations bill of 132 billion gold marks. Anger at it fed the political violence of the next years.",
      "Einstein's tower observatory opened in Potsdam, built to test his theory of relativity, and Albert Einstein won the 1921 Nobel Prize in Physics."],
    here: "Einstein's relativity, the idea that time can stretch and bend, is the science Dark's time travel leans on." },
  "1953": { de: [
      "The Second World War had ended eight years earlier. Towns were still rebuilding, and nearly every adult had lived through the war, many as soldiers.",
      "Millions of Germans had fled or been expelled from the east and had to be housed in towns across the West.",
      "Because of the war, Germany was split in two: the democratic West and the communist East.",
      "Also because of the war, West Germany was still banned by the Allies from nuclear research. The ban was lifted two years later."],
    world: ["In December, US President Eisenhower's \"Atoms for Peace\" speech launched the push for civilian nuclear power."],
    here: "Nuclear power for civilian use was a brand-new idea in 1953, the same year the show says plans for Winden's power plant began." },
  "1954": { de: [
      "The Paris Agreements set out the end of the Allied occupation that had followed the Second World War."],
    world: [
      "The first nuclear power plant to feed an electricity grid opened at Obninsk in the Soviet Union in June."],
    here: "Nuclear power stations like the one planned for Winden were just becoming real." },
  "1986": { de: [
      "The Chernobyl disaster in April sent radioactive fallout over West Germany. Families were warned about milk, vegetables and children's sandpits.",
      "Six weeks later, Germany created its first federal environment ministry in response.",
      "Protests against nuclear power grew, with clashes at the planned reprocessing plant at Wackersdorf in Bavaria.",
      "Germany was still divided by the Berlin Wall, a legacy of the Second World War, and both sides were front lines of the Cold War."],
    here: "Chernobyl made nuclear power the fear of the year in Germany, with power plants like Winden's under new suspicion." },
  "2019": { de: [
      "Germany was in the middle of shutting down nuclear power: a 2011 decision, after Fukushima, set the end of 2022 for its last reactors."],
    world: ["Japan was still cleaning up after the 2011 Fukushima nuclear disaster, the event that turned Germany against nuclear power."],
    here: "With Germany's reactors being switched off, Winden's power plant is shown as due to close in 2020." },
  "2020": { de: [
      "Germany's last nuclear reactors were still scheduled to close by the end of 2022 (the final three actually shut in April 2023)."] }
};

// ---------- Map of Winden (an original, stylised impression, not an exact plan) ----------
// Layout follows the Dark Wiki: a small, dense town in a clearing, surrounded by forest; the power plant,
// also ringed by forest, towers over it; the caves lie in the woods close to the plant, the bunker nearby;
// the church and the Waldhotel stand among the trees.
// ep: the episode where a place is first clearly on screen (erring later when unsure).
// re: words that tie timeline events to the place. nature places exist in every year; buildings are only
// drawn for 1986-2020 (the present-day town); the plant site also shows from 1953, unless an event puts them elsewhere.
module.exports.PLACES = [
  { id:"forest",   name:"Winden forest",     ep:"1.1", x:140, y:430, kind:"nature",   icon:"tree",  re:"forest|woods" },
  { id:"caves",    name:"The caves",         ep:"1.1", x:330, y:215, kind:"nature",   icon:"cave",  re:"cave" },
  { id:"plant",    name:"Power plant",       ep:"1.1", x:470, y:110, kind:"building", icon:"plant", re:"power plant|\\bplant\\b|reactor" },
  { id:"school",   name:"School",            ep:"1.1", x:560, y:345, kind:"building", icon:"school",re:"school|classroom" },
  { id:"police",   name:"Police station",    ep:"1.1", x:665, y:315, kind:"building", icon:"badge", re:"police station|\\bcell\\b|interrogat" },
  { id:"hotel",    name:"Waldhotel",         ep:"1.1", x:830, y:150, kind:"building", icon:"bed",   re:"hotel|room 8" },
  { id:"kahnwald", name:"Kahnwald house",    ep:"1.1", x:455, y:420, kind:"building", icon:"house", re:"kahnwald (house|home)|jonas's (house|home)" },
  { id:"nielsen",  name:"Nielsen house",     ep:"1.1", x:545, y:500, kind:"building", icon:"house", re:"nielsen (house|home)|nielsens' (house|home)" },
  { id:"doppler",  name:"Doppler house",     ep:"1.1", x:650, y:505, kind:"building", icon:"house", re:"doppler (house|home)|dopplers' (house|home)" },
  { id:"resthome", name:"Care home",        ep:"1.1", x:370, y:500, kind:"building", icon:"house", re:"care home|rest home" },
  { id:"church",   name:"Church",            ep:"1.5", x:890, y:455, kind:"building", icon:"cross", re:"church|sermon" },
  { id:"hospital", name:"Hospital",          ep:"1.5", x:745, y:400, kind:"building", icon:"plus",  re:"hospital|\\bward\\b" },
  { id:"shop",     name:"Clockmaker's shop", ep:"1.3", x:600, y:430, kind:"building", icon:"clock", re:"clockmaker|watchmaker|tannhaus's shop|the shop" },
  { id:"tower",    name:"Forest watchtower", ep:"1.7", x:130, y:180, kind:"nature",   icon:"tower", re:"watchtower" },
  { id:"bunker",   name:"Bunker",            ep:"1.7", x:235, y:300, kind:"nature",   icon:"bunker",re:"bunker" },
  { id:"lake",     name:"The lake",          ep:"2.6", x:905, y:300, kind:"nature",   icon:"wave",  re:"\\blake\\b|beach|shore" }
];
