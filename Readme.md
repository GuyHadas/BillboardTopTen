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

#### Sample iTunes Search API Script

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


#### Sample iTunes Search API Script

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

The first component is the charts component. This component displays a track's progression over time by drawing out distinct lines following it's ranking. The chart is an SVG tag split in two five subsection. Each subsection contains ten lines for each track. Every lines vertical coordinate represents a tracks position for the current week while the lines end represents the position of the track in the next week.  

The second component is the the graph component. this component is in charge of rendering ten album images and track names according to their ranking for a given week. As the rankings change over time, the graph component updates all positions of current tracks on the graph. The graph and charts components work harmoniously together to create a pleasing visualize for top ten tracks.  

![homePage]
[homePage]: ./public/homePage.png


#### Sample Graph Code Snippets

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

export default Graph;
```

### Music

BillboardTopTen plays music synchronously with it's visuals. For every week, BillboardTopTen will play the number one ranked track in the background. Through the used of React Sound library, sound component's containing track URL's will play music in the background.

One unique feature of BillboardTopTen is that it makes use of


#### Sample Design Show

```javascript
```

### Comments

Scribbble comments are unique, each one lives at a specific spot on their respective design. Hovering over comments in the 'commentBox' displays their location on the design while clicking on the design creates a comment at that location.

Green comment pins reference a comment being created, while yellow comment pins reference a comment being viewed.

In addition to having body, design_id, and user_id columns in the database, comments contain X and Y coordinates that eventually pertain to their parent div (the design they belong to).

Scribbble's API efficiently returns each designs' comments through a single query to the database.

Ex. Comment Box
![commentBox]
[commentBox]: ./screenshots/commentBox.png

Ex. Comment Pins
![commentPins]
[commentPins]: ./screenshots/commentPins.png


```javascript
```
