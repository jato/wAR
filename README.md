# wAR
A card game brought to life via Augmented Reality

**LAUNCH 2016**

By [Jose Juan Isaac Taveras](https://github.com/josejuanisaac), [Nathan Micic](https://github.com/Xenonate), [Jeremy Wong](https://github.com/jermspeaks), and [James Allen Brown](https://github.com/jato/)

## Background

### Game of War

More game information can be found on the [Bicycle Cards Website](http://www.bicyclecards.com/how-to-play/war/)

**TO WIN**
Be the first player to win all the cards

**SET UP**
There are two players. Each player gets half the deck, faced down. Players are not allowed to look at their cards during game player.

**GAME Play**
On each turn, each player lays down a card faced up at the same time. The player with the higher card takes both cards and places it on the bottom of their deck.

If the card value is the same, the game play enters War. Each player places three cards faced down, shouting "I declare war!", then opens the next card. The higher card wins. If the cards are still the same value, game play continues with War.

**Card Values**
Ace is high. 2 is low. Goes in the following order:

*2 3 4 5 6 7 8 9 J Q K A*

### AR Technology

Utilizing the JS-ArUco project, which ported over ArUco to Javascript, our team
modified the existing code to place our own pictures on top. Also, since our
card game needs to render two different images on different markers, we extended
the library to include this functionality.

Using Three.js's Stereo API, we split the video canvas in two. The split helps
us use the app on a phone and pair it with Google Cardboard.

You can now play the Game of War with replacable images!

### Generating Markers

Before installing ArUco, you will need to install OpenCV. You can grab it from
[SourceForge](https://sourceforge.net/projects/opencvlibrary/) or Brew.

**Brew**

```bash
brew tap homebrew/science
# Here you can check the open cv package
# brew info opencv
brew install opencv
```

You can grab [ArUco on SourceForge](https://sourceforge.net/projects/aruco/) and install with the following commands.

```bash
tar -zvf aruco.tgz # File will depend on your version
cd arcuo
mkdir build
cd build
cmake ..
make
```

Then go to the utils_hrm folder, and you can use the executables there.

```bash
cd utils_hrm
# Create a board with 5 rows, 2 columns, and output to image and yml config
./aruco_create_board 5:2 board.png board.yml
```

## Installation

To start the rails app on your local machine, go to the `wAR` folder.

```bash
# Install gems
bundle install
# Migrate tables
rake db:migrate RAILS_ENV=development
# Start server, default port:3000
rails server
```
