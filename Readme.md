# BillboardTopTen

[BillboardTopTen][heroku] is a web application that allows music enthusiasts to explore Billboard's top ten charts throughout history. Inspired by [Billboard charts][Billboard], BillboardTopTen is built using Ruby on Rails on the backend, React.JS on the Front-end, and a PostgreSQL database.


[heroku]: https://billboardtopten.herokuapp.com/
[Billboard]: http://www.billboard.com/charts

##BillboardTopTen Features

* Dynamic visualization of Billboard's top ten charts for every week
* Week's top song playing while charts are displayed
* Smooth music fade in fade out transitions between different charts
* Date Picker for user exploration of top ten charts through history
* Genre Picker for user exploration of different music genres
* Album Images associated with each artist on the chart


## BillboardTopTen Walk-through

### BillboardTopTen Web Scraping and Search APIs

BillboardTopTen depends on web scraping HTML form [Billboard charts][Billboard] to retrieve all of the charts. A Python script using [billboard.py][billboardpy] API for accessing music charts was written to scrape ten songs for each chart. Each song in a chart contained the following fields: title, artist, weeks, rank, spotifyId, and spotifyLink.

[billboardpy]: https://github.com/guoguo12/billboard-charts

#### Sample Web Scraping Script Snippet

```python
import billboard
from time import sleep

f = open('edm.txt', 'w')

i = 0
chart = billboard.ChartData('dance-electronic-songs')
while chart.previousDate:
    print chart.date
    if len(chart) < 10:
        chart = billboard.ChartData('dance-electronic-songs', chart.previousDate)

    f.write("*****")
    f.write("\n")
    f.write(chart.date)
    f.write("\n")

    for x in range(0, 10):
        f.write(str(chart[x].title))
        f.write("\n")

        f.write(str(chart[x].artist))
        f.write("\n")

    ...
```
Once all of the charts were scraped, a second script was used to parse data into a JSON. This JSON contains a large hash map with a chart's date as a key, and a value as a list top ten tracks.

From the new JSON, another script was used to loop through the hash map and build queries which where used to retrieve track samples from iTunes.

The queries were built by first searching Spotify's API and retrieving clean formats for track artist and title. Once built, queries are sent through a HTTP GET to search iTunes API for track samples. These samples where saved into another JSON map with a week's date as key and sample URLs as values. This new map will later be used to play music for each week.

A final script was used to retrieve URLs for album images associated with each track in the week. Album images may be more difficult to find then tracks. The script required queries to Spotify, iTunes, and Last.fm's APIs. Each album image found was save to a JSON file mapping track and artist names as keys to the album image URL.


#### Sample iTunes Search API Script Snippet

```ruby
def get_itunes_track(query)
  res = HTTP.get("https://itunes.apple.com/search?term=#{query}&country=us&limit=1&media=music")
  if res.code == 200
    JSON.parse(res)
  else
    p "GOT 403"
    return {"resultCount" => 0}
  end
end

def build_query(chart, spotify_id)
  begin
    track = JSON.parse(HTTP.get("https://api.spotify.com/v1/tracks/#{spotify_id}").to_s)
    title = track['name'].gsub(/[^0-9a-zA-Z ]/, "").split(" ").join("+")
    artist = track['artists'][0]['name'].gsub(/[^0-9a-zA-Z ]/, "").split(" ").join("+");
  rescue
    title = chart[0]['title'].gsub(/[^0-9a-zA-Z ]/, "").split(' ').join('+')
    artist = chart[0]['artist'].gsub(/[^0-9a-zA-Z ]/, "").split(' ').join('+')
  ensure
    return [title, artist].join("+");
  end
end

trackMeta = {}

charts = JSON.parse(File.read("public/charts/electric/billboard-data.json"))

charts.each do |date, chart|
  sleep 2
  p date

    top_song = chart[0]
    query = build_query(chart, top_song['spotify_id'])
    response = get_itunes_track(query)
    i = 1
    until response["resultCount"] != 0 || i == 10
      query = build_query(chart, chart[i])
      response = get_itunes_track(query)
      i += 1
    end
    if (response["resultCount"] > 0)
      itunes_track = response["results"][0]
      unless trackMeta[itunes_track['trackId']]
        trackMeta[date] = { 'previewUrl' => itunes_track['previewUrl'], 'albumImg' => itunes_track['artworkUrl100'] }
      end
    end
end

File.write("public/charts/electric/previewUrls.json", JSON.generate(trackMeta))
```

### Data Visualization and Graphing

BillboardTopTen takes advantage of React.JS rapid render library for smooth visualization of Billboard's charts. There are two separate React components in charge of data visualization for BillboardTopTen.

The first component is the charts component. This component displays a track's progression over time by drawing out distinct lines following a tracks ranking. The chart component contains an SVG tag split in two five subsection. Each subsection contains ten lines for each track. Every line's vertical coordinate represents a tracks position for the current week while the lines end represents the position of the track in the next week. Each subsection is given a velocity such that the lines are animated across the screen.


#### Sample Charts Code Snippet

```javascript
class Chart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      offset: 0
    };
  }

  componentDidMount() {
    // This is called 150 times throughout a chart interval
    // Line must move 175 pixels every chart interval
    const VELOCITY = (175 / 75);
    this.offsetInterval = setInterval(() => {
      this.setState({ offset: this.state.offset + VELOCITY });
    }, 40);
  }
 ...
 getLinesForSection(sectionNum, startingChart, endingChart) {
   const STAGING_AREA_RANK = 11;
   const startingTracks = _.map(startingChart, 'title');
   const endingTracks = _.map(endingChart, 'title');
   const tracksOnDeck = _.filter(endingChart, trackOnDeck => {
     return !(_.includes(startingTracks, trackOnDeck.title));
   });

   let lines = _.map(startingChart, track => {
     let nextTrackRank = endingTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

     if (nextTrackRank === 0) {
       nextTrackRank = STAGING_AREA_RANK; // if track is not in next week's charts, animate to bottom of list
     }

     return <Line
       offset={this.state.offset}
       color={this.props.getColorForTitle(track.title)}
       key={`${track.title}sec${sectionNum}rank${track.rank}`}
       weekPosition={sectionNum}
       y1={this.getPositionForRank(track.rank)}
       y2={this.getPositionForRank(nextTrackRank)}/>;
   });

   const tracksOnDeckLines = tracksOnDeck.map(trackOnDeck => {
     return <Line
       offset={this.state.offset}
       color={this.props.getColorForTitle(trackOnDeck.title)}
       key={`${trackOnDeck.title}sec${sectionNum}rank${trackOnDeck.rank}`}
       weekPosition={sectionNum}
       y1={this.getPositionForRank(STAGING_AREA_RANK)}
       y2={this.getPositionForRank(trackOnDeck.rank)}/>;
   });

   return lines.concat(tracksOnDeckLines);
 }

 render() {
   const sectionZero = this.getLinesForSection(0, this.props.chart, this.props.nextChart);
   const sectionOne = this.getLinesForSection(1, this.props.prevChart, this.props.chart);
   const sectionTwo = this.getLinesForSection(2, this.props.twoWeeksBackChart, this.props.prevChart);
   const sectionThree = this.getLinesForSection(3, this.props.threeWeeksBackChart, this.props.twoWeeksBackChart);
   const sectionFour = this.getLinesForSection(4, this.props.fourWeeksBackChart, this.props.threeWeeksBackChart);

   return (
     <div id="chart-wrap-wrapper">
       <div id="chart-wrap">
         <ul id="chart-y-axis">
           <li>1 &mdash;</li>
           <li>2 &mdash;</li>
           <li>3 &mdash;</li>
           <li>4 &mdash;</li>
           <li>5 &mdash;</li>
           <li>6 &mdash;</li>
           <li>7 &mdash;</li>
           <li>8 &mdash;</li>
           <li>9 &mdash;</li>
           <li>10 &mdash;</li>
         </ul>
         <svg width={700} height={579} style={{ borderBottom: '1px solid white', backgroundColor: 'transparent' }}>
           {sectionZero}
           {sectionOne}
           {sectionTwo}
           {sectionThree}
           {sectionFour}
         </svg>
       </div>
       <svg width={700} height={50} style={{ backgroundColor: 'rgb(0, 0, 0)', color: 'white', marginLeft: 'auto' }}>
         <GraphDate offset={this.state.offset} weekPosition={-1} date={this.props.nextChartDate}/>
         <GraphDate offset={this.state.offset} weekPosition={0} date={this.props.currentDate}/>
         <GraphDate offset={this.state.offset} weekPosition={1} date={this.props.prevChartDate}/>
         <GraphDate offset={this.state.offset} weekPosition={2} date={this.props.twoWeeksBackChartDate}/>
         <GraphDate offset={this.state.offset} weekPosition={3} date={this.props.threeWeeksBackChartDate}/>
         <GraphDate offset={this.state.offset} weekPosition={4} date={this.props.fourWeeksBackChartDate}/>
       </svg>
     </div>
   );
 }
}
```


The second component is the graph component. this component is in charge of rendering ten album images and track names according to their ranking for a given week. As the rankings change over time, the graph component updates its state which in turn will update positions of current tracks on the graph. Using CSS transitions the tracks will move smoothly towards there new ranking. The graph and charts components work harmoniously together to create a pleasing visualize for top ten tracks.  

#### Sample Graph Code Snippet

```javascript
class Graph extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    const stagingAreaRank = 11;
    const currentTracks = _.map(this.props.chart, 'title'); // title must act as primary key
    const nextChartTracks = _.map(this.props.nextChart, 'title'); // title must act as primary key

    const trackComponents = _.map(this.props.chart, track => {
      let nextTrackRank = nextChartTracks.indexOf(track.title) + 1; // index 0 should be rank 1, etc...

      if (nextTrackRank === 0) {
        nextTrackRank = stagingAreaRank; // if track is not in next week's charts, animate to bottom of list
      }
      let albumImage = this.props.albumImages[`${track.artist}/${track.title}`];
      albumImage = albumImage ? albumImage : 'http://24.media.tumblr.com/tumblr_m3j315A5l31r6luwpo1_500.png';
      return <Track key={track.title} track={track} nextTrackRank={nextTrackRank} albumImage={albumImage} getColorForTitle={this.props.getColorForTitle}/>;
    });

    let tracksOnDeck = _.filter(this.props.nextChart, trackOnDeck => {
      return !(_.includes(currentTracks, trackOnDeck.title));
    });

    const trackOnDeckComponents = tracksOnDeck.map(trackOnDeck => {
      // renders the track to the staging area at the bottom of the list
      const dummyTrack = {
        title: trackOnDeck.title,
        rank: stagingAreaRank
      };

      let albumImage = this.props.albumImages[`${trackOnDeck.artist}/${trackOnDeck.title}`];
      albumImage = albumImage ? albumImage : 'http://24.media.tumblr.com/tumblr_m3j315A5l31r6luwpo1_500.png';

      return <Track key={trackOnDeck.title} track={dummyTrack} nextTrackRank={trackOnDeck.rank} albumImage={albumImage} getColorForTitle={this.props.getColorForTitle}/>;
    });

    return (
      <div id='graph'>
        <ul id='trackList'>
          {trackComponents}
          {trackOnDeckComponents}
        </ul>
        <div id='stagingArea'/>
      </div>
    );
  }
}
```

### Music

BillboardTopTen plays music synchronously with it's visuals. For every week, BillboardTopTen will play the number one ranked track in the background. Through the used of React Sound library, sound component's containing track URL's will play music.

One unique feature of BillboardTopTen is that it makes use of React's rapid state handling to control which component is playing music and at what volume. Through this, BillboardTopTen is able to create seamless fade in fade out transitions between different top songs for different weeks. While the current week's track component is playing sound the next weeks track component is cached. If the songs between two weeks differ, then a fade in fade out method is applied. This method decrements the volume of the current chart's state while simultaneously incrementing the volume of the next char's state.

#### Sample Music Snippet

```javascript
fadeInFadeOut() {
  if (this.isNextSongDifferent()) {
    if (this.fadeOutOneFadeInTwoInterval) clearInterval(this.fadeOutOneFadeInTwoInterval);
    if (this.fadeOutTwoFadeInOneInterval) clearInterval(this.fadeOutTwoFadeInOneInterval);

    if (this.activeSoundComponent === 'one') {
      this.fadeOutOneFadeInTwoInterval = setInterval(() => {
        this.setState({
          volOne: this.state.volOne - 1.5,
          volTwo: this.state.volTwo + 1.5
        });
      }, (1000 / 30));
    } else {
      this.fadeOutTwoFadeInOneInterval = setInterval(() => {
        this.setState({
          volOne: this.state.volOne + 1.5,
          volTwo: this.state.volTwo - 1.5
        });
      }, (1000 / 30));
    }
  }
}
...
componentDidUpdate() {
  if ((this.isNextSongDifferent() && !this.areBothPlaying()) && this.state.isSoundOn) {

    this.fadeInFadeOut();
    let trackURLSoundComponentOne = this.activeSoundComponent === 'one' ? this.state.currentTrackURL : this.state.nextTrackURL;
    let trackURLSoundComponentTwo = this.activeSoundComponent === 'one' ? this.state.nextTrackURL : this.state.currentTrackURL;

    this.setState({
      trackURLSoundComponentOne: trackURLSoundComponentOne,
      trackURLSoundComponentTwo: trackURLSoundComponentTwo,
      soundComponentOneStatus: Sound.status.PLAYING,
      soundComponentTwoStatus: Sound.status.PLAYING
    });
  }
}
...
```
### Date and Genre Picker

Scribbble comments are unique, each one lives at a specific spot on their respective design. Hovering over comments in the 'commentBox' displays their location on the design while clicking on the design creates a comment at that location.

Green comment pins reference a comment being created, while yellow comment pins reference a comment being viewed.

In addition to having body, design_id, and user_id columns in the database, comments contain X and Y coordinates that eventually pertain to their parent div (the design they belong to).

Scribbble's API efficiently returns each designs' comments through a single query to the database.
