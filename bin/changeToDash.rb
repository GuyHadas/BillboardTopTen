require 'json'
require 'digest/sha1'

old_track_images = JSON.parse(File.read("public/charts/rap/images.json"))
charts = JSON.parse(File.read("public/charts/rap/billboard-data.json"))
track_images = {}

charts.each do |date, chart|
  chart.each do |song|
    artist = song['artist']
    title = song['title']
    hashKey = Digest::SHA1.hexdigest("#{artist}/#{title}")

    next if track_images[hashKey]
    if old_track_images["#{artist}/#{title}"]
      track_images[hashKey] = old_track_images["#{artist}/#{title}"]
    end
  end
end

File.write("public/charts/rap/dashed-images.json", JSON.generate(track_images))
