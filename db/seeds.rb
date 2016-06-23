#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'grooveshark'

client = Grooveshark::Client.new

# songs = client.search_songs('Nirvana')
#
# songs.each do |s|
#   s.id          # Song ID
#   s.name        # Song name
#   s.artist      # Song artist name
#   s.album       # Song album name
#   s.duration    # Song duration in seconds (not always present, 0 by default)
# end
