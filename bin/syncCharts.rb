require 'json'

charts = JSON.parse(File.read("public/charts/hot100/billboard-data.json"))
track_meta = JSON.parse(File.read("public/charts/hot100/previewUrls.json"))

charts.each do |k, v|
  charts.delete(k) unless track_meta[k]
end

File.write("public/charts/hot100/charts.json", JSON.generate(charts))
